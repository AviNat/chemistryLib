# Chemical keyboard as a Moodle question type (design)

Status: **idea stage, not decided** (2026-10-13). Nothing implemented. Related: `QUESTION-BUILDER.md` (the snippet
and STACK approach, which stays), `RUBRIC-DESIGN.md`, `MOLECULES-DESIGN.md`.

## 0. Goal and principle

A dedicated Moodle question type (`qtype_chemkbd`) that uses the library to present, edit and evaluate a formula, and
uses Moodle's own features: review options (marks, specific feedback, right answer), behaviours (deferred,
interactive, adaptive), general and combined feedback, hints, question bank, import/export, backup.

**Principle: the library knows nothing about Moodle.** A thin Moodle adapter (PHP + a small JS module in the plugin)
translates between Moodle and the library, as `chemkbdRun` does today for STACK. Other platforms keep using the
library directly or through the snippet.

## 1. What the plugin's parts need from the library

| Moodle part | What it does | Library interface |
|---|---|---|
| Edit form (teacher) | Embeds the builder; saves the question config | Builder core mounted in a container, reading/writing one hidden JSON field; the config format |
| Renderer, attempt page | Shows the field and keyboard; writes the answer into Moodle's form field | `new ChemicalKeyboard({...})`, `onChange`, `setValue`, `validate`, the answer as value text |
| Grading (`grade_response`) | Mark 0-1 on submit, on Check (interactive), on regrade | `ChemicalGrammar.compare(...)` with the rubric -> `score` (see 4) |
| Renderer, review page | Marked answer, grade, feedback, right answer, per the review options | Read-only keyboard, `setComparisonFeedback`, `renderComparison`, `fontSize` |
| Response history / reports | Text of the answer and its feedback | Answer as value text; a one-line feedback summary |
| Import/export, backup | Question as Moodle XML | The config JSON, as is |

## 2. Shared data formats (the core of platform independence)

1. **Question config:** the builder's JSON - `language`, `elementsMode` / `elements`, `conditions`, `displayChars`,
   `correctAnswer`, `value` (initial answer), `rubric`, `distinguishIsomers`, plus `formatVersion`. The same JSON serves
   the snippet, the question type and other platforms. Moodle stores it in the plugin's options table. Settings that
   Moodle provides itself are not used by the question type: `review`, `stack`, `reviewDiv`, `checkButton`.
2. **Student response:** the answer in value notation (see 5.1). Stored by Moodle per attempt step; `setValue` reads it.
3. **Evaluation result:** the object `compare` returns (`correct`, `errors`, `notes`, `score`), JSON-safe.

## 3. Moodle settings passed to the library

The renderer gets `question_display_options` and passes them to the JS module - nothing is guessed from the page:

| Moodle | Library / adapter |
|---|---|
| `readonly` | `mode: "readonly-errors"` (replaces detecting read-only STACK inputs) |
| `marks` | show the grade line |
| `feedback` (specific feedback) | show the detailed evaluation |
| `rightanswer` | show the reference answer and mark the student's answer |
| `current_language()` | `language` (he / ar / en) |
| the response's form field name | where `onChange` writes the answer |

General feedback, combined feedback (correct / partly correct / incorrect texts), hints and penalties in interactive
mode are Moodle features; the library is not involved.

## 4. Open decision: where grading runs

Moodle grades on the **server** (`grade_response`, PHP), also when **regrading** after the teacher changes a question.
The library is JS.

| Option | Regrade after a rubric change | Score safe from students | Effort |
|---|---|---|---|
| A. The browser grades and posts the score with the answer (as with STACK today) | No - the stored score stays | No | Small |
| B. Port the comparison and grading to PHP | Yes | Yes | Large; two engines to keep identical |
| C. Run the JS library on the server (Node / a PHP JS engine) | Yes | Yes | Medium, but most Moodle hosts can't |

A keeps one engine and fits practice use; the response is then `{answer, score, feedback summary}`, not only the
answer. A can come first, with B or C added later behind the same response format.

## 5. Library gaps (useful on every platform, also without the question type)

### 5.1 `getValueText()`: the answer in value notation

**Done 2026-10-13 (library 2.1.0):** `keyboard.getValueText()`, `ChemicalGrammar.valueText(model)`, and `valueText` in
`result()`. The builder (`modelToValue`), the snippet (`valueText`, `SNIPPET_VERSION` 2026-10-13.1) and the tests
(`showChars` in chemTests.js) now use it - no copies left; all 68 tests pass. Round trip checked on 9 answers (ions,
conditions with subscripts, hν, hydrate, parentheses, equilibrium): all exact. With `getValue()` 5 of the 9 were lost,
including `N2+3H2⇌2NH3`, where the coefficient 3 was read back as a subscript.

**The problem.** The library has two text forms of an answer:

| Method | H₂O | SO₄²⁻ | Cr₂O₇²⁻ | Keeps the levels? |
|---|---|---|---|---|
| `getValue()` | `H2O` | `SO42-` | `Cr2O72-` | No - only the characters |
| value notation (what `setValue` reads best) | `H_{2}O` | `SO_{4}^{2-}` | `Cr_{2}O_{7}^{2-}` | Yes |

`getValue()` joins the characters and drops whether each is normal, subscript or superscript. Reading such text back,
`modelFromValue` has to **guess** the levels. `H2O` is easy, but `SO42-` could be SO₄²⁻ or SO₄₂⁻ and `Cr2O72-` could be
Cr₂O₇²⁻ or Cr₂O₇₂⁻ - the text has lost the information. With `_{}` / `^{}` present, `modelFromValue` reads the levels
exactly ("explicit" mode).

**Where it hurts today.** Every place that saves an answer and shows it again needs the exact form:
- the builder saves the reference answer and the initial answer in the file (`modelToValue` in the builder page);
- the snippet writes the student's answer into STACK's `ans2` and reads it back on the next page and the review page
  (`valueText` in `chemkbdRun`);
- a question type would store it as the Moodle response, and `is_same_response` / `summarise_response` use it.

So the conversion exists **twice, outside the library**, as two copies of the same walk over `getModel()`. A third
platform would have to write it a third time and could get it subtly different (conditions above the arrow, states,
a condition that has its own subscripts like V₂O₅).

**The interface.**
```js
keyboard.getValueText()                       // "2H_{2}(g)+O_{2}(g)→[V_{2}O_{5}]2H_{2}O(l)"
ChemicalGrammar.valueText(model)              // the same from a model (getModel() or result().model)
keyboard.setValue(keyboard.getValueText())    // guaranteed round trip: the same model
```
Rules (as the two copies do today):
- a run of subscript characters -> `_{...}`, a run of superscript characters -> `^{...}`;
- states `(s)`, `(l)`, `(g)`, `(aq)` written as they are (they are recognized as states when read);
- a condition above an arrow -> `[...]` right after the arrow, its content in the same notation;
- everything else as typed.

Also: `result()` (given to `onChange`) gets a `valueText` field, so adapters don't call anything extra.

**What changes.** The builder and `chemkbdRun` call the library instead of their own copies (`chemkbdRun` keeps a
fallback for older library copies, or requires the new version). `getValue()` stays as it is, for display or
search-like uses where the levels don't matter. A test: for each example of the test page,
`setValue(getValueText())` gives the same model.

### 5.2 `ChemicalGrammar.summary(result, language)` - dropped (2026-10-13)
Proposed: the one-line feedback text ("50% | error | error"), now `feedbackLine` in `chemkbdRun`. **Dropped** for the
same reason as 5.3: it is only read by people (response history), never read back, so it can't be wrong; an
integrator builds it in a few lines from `result.score` and the errors' `description`. Reconsider only if the question
type is built and must show the same line as the snippet.

### 5.3 `renderReview(container, result, {grade, details, reference})` - dropped (2026-10-13)
Proposed: one call for the whole review display. **Dropped:** every integration is written by a developer, who can
call the existing parts in the order and places they need - a combined call would add little and could limit
platforms that want only some parts. The review display is built from what the library already has:
- `ChemicalGrammar.compare(student, reference, language, {rubric, distinguishIsomers})` - the result, computed once;
- a read-only `ChemicalKeyboard` (`mode: "readonly-errors"`, optional `fontSize`) + `setComparisonFeedback(result,
  "student" | "reference", value)` - the student's answer or the reference, marked;
- `ChemicalGrammar.renderComparison(result, language, summaryEl, detailsEl)` - the grade line and the details (fills
  both; a caller that wants only one leaves the other element off the page, as `chemkbdRun` does).
`chemkbdRun` in the builder is the reference example of putting them together.

### 5.4 Loading as a module
A UMD wrapper so Moodle can load the library as an AMD module, while plain `<script>` loading (globals
`ChemicalKeyboard`, `ChemicalGrammar`) keeps working on every other platform.

### 5.5 Builder core
Split the builder's logic from its page: mountable in a container, "config in, config out". The standalone page keeps
file open / save; Moodle's edit form uses the same core with a hidden field.

### 5.6 Documented, versioned config format
`formatVersion`, the fields and their defaults, and a validation the PHP side can mirror when saving a question.

## 6. What disappears in the question type (still available to the snippet on other platforms)

Copying code into the question; the hidden `ans1` / `ans2` inputs; the review checkboxes and the deferred
`chemkbdSettings` design; detecting the review page by read-only inputs; `reviewDiv` (the renderer controls the
layout); the jsDelivr cache problem, if the library is bundled with the plugin.

## 7. Open

1. Grading location (section 4).
2. Admin access: the plugin must be installed by a site admin on every Moodle that uses it.
3. Library loading in the plugin: bundled (versioned with the plugin) or the CDN.
4. Order of work: 5.1-5.3 are worth doing first in any case - they remove duplicated code from the snippet and the
   builder.
