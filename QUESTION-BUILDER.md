# Chemical keyboard question builder (teacher tool)

File: `chemical-question-builder.html` (next to `chemical-keyboard-v4.js`, which it loads). First version 2026-10-08,
built on the **current** library functionality only.

## What the teacher sets
| Setting | Goes into the keyboard config as |
|---|---|
| Student language (he / ar / en), independent of the tool's interface language | `language` |
| Element keys: default set / custom list (periodic table + drag to reorder, or one-click sort A–Z / by atomic number) / none | omitted / `elements:[...]` / `elements:[]` |
| Reference answer (entered with the keyboard) | `correctAnswer` |
| Initial student answer (optional, e.g. a partial answer to complete) | `value` |
| Rubric per category: no penalty / once / per error (+ cap, + `allMissing` for states), or no grading | `rubric` (format of RUBRIC-DESIGN.md) |
| Isomers as different substances | `distinguishIsomers` |
| Check button with feedback for the student | snippet option |
| Copy the answer into the Moodle question's answer box | snippet option |

- The keyboards in the tool use the **student** language, so the teacher sees what the student sees.
- Student language **"system"** (2026-10-09): one copy of the question serves all languages. The student-side code
  takes `window.studentLanguage` when a script on the page sets it (e.g. with Moodle's multilang filter), otherwise
  `<html lang>`, which Moodle sets to the user's current language (`he`, `ar`, `en`, `en_us` → first two letters);
  anything else is English. The builder previews a "system" question in the interface language (also the language of
  the ans2 model answer's "correct" text - STACK never compares with it).
- An empty element panel is valid: every element is reachable through the keyboard's full alphabetical list.
- "Check the reference answer" button: compares the reference with itself and reports syntax errors, unknown elements
  and **unbalanced atoms** (the live status under the keyboard reports only the first two), with the problem parts
  marked on a read-only copy. The result is cleared when the reference changes.
- The elements section comes **after** the reference answer. It lists the elements of the reference answer, each marked
  "on the panel" (green) or "only in the full list" (orange, dashed), also on the periodic table, and follows the
  reference answer as it is typed. "Add the elements of the reference answer" adds the missing ones; from the default
  set or "none" it switches to a custom panel that starts from the current one.
- Answers typed in the tool are stored in the value notation (`H_{2}O`, `SO_{4}^{2-}`) by `modelToValue`, not with
  `getValue()`, which drops the sub/sup levels.
- "Try it as a student" runs the same student-side code as the snippet (`chemkbdRun`, copied with `toString()`).

## Output / file
- The saved `.txt` **is** the Moodle snippet: a `div`, the configuration as JSON in
  `<script type="application/json" id="chemkbd-<id>-config">`, and a script that loads the library (once per page)
  and runs `chemkbdRun`. Opening a file reads only the JSON block (`tool: "chemkbd-question-builder"`, `formatVersion: 1`).
- Paste into the Moodle question text in the editor's HTML view. The question id must be unique per page.
- Save uses the File System Access API when available (save back to the same file), otherwise a download.

## Connection to STACK (decided 2026-10-08)
- Config `stack: { scoreInput: "ans1", answerInput: "ans2" }` (both optional), set in the builder's settings.
- On **every change** of the student's answer the keyboard writes, and hides both inputs:
  - `scoreInput`: the score **0 to 1** (rubric score / 100; without a rubric 1 = correct, 0 = not). The PRT gives it as the mark.
  - `answerInput`: `answer || score% | feedback | feedback…`: the answer in the value notation
    (`2H_{2}(g)+O_{2}(g)→2H_{2}O(l)`), then the feedback the student got (counted errors and notes, in the student
    language; quotes and backslashes removed), for Moodle's response history. The keyboard reads back the part
    before ` || ` when the page is shown again.
  - The builder shows the **model answers** to copy into the STACK inputs: `1` for the score input, and for the answer
    input the quoted string it holds for a correct answer (`"<reference> || 100%"`, or the "correct" text in the student
    language without a rubric), built by `stackModelAnswer` in the same format as `feedbackLine` in `chemkbdRun`.
  - Defaults in the builder: `ans1` and `ans2`. The config always contains `stack`, so an emptied field stays empty.
- **Review page** (after submission; Moodle renders the inputs `readonly`, which is how it is detected): the keyboard
  always shows the saved answer read-only. Three builder options (`cfg.review`, all on by default; set them to match
  the quiz review options for marks and right answer):
  - `grade`: the score line (or correct / number of issues without a rubric)
  - `reference`: the reference answer, marked; when off, the student's answer is **not marked** either (the marking
    gives the answer away)
  - `details`: the detailed evaluation (rubric penalty lines / list of errors)
- `ans2` does not need a PRT: it is saved and restored without one (confirmed in Moodle 2026-10-08).
- Inputs are left `readonly` (as Moodle renders them), never set to `disabled`: a disabled field is not sent with the
  form ("Try again" in interactive mode would lose the answer).
- **While answering** (attempt page, also when it starts from a saved answer): no feedback is shown by itself. The
  marked copy of the student's answer and the reference answer appear **only on the review page**, read-only.
- The keyboard's own button ("Check the writing", when on) checks **only the writing**: syntax errors and symbols that
  are not elements (the answer compared with itself; unbalanced atoms left out). No grade, nothing compared with the
  reference: a private, free, unlimited check would let students try until 100% and bypass Moodle's penalties; grading
  feedback during the attempt is Moodle's own Check (interactive / adaptive behaviour). Trial, to see if it has merit.
- Option **condition keys** (`conditions`, default true; library `config.conditions`): when off, the keyboard has no
  reaction-condition (process) keys - the arrow with the condition placeholder, Δ, hν, °C, K. The builder's keyboards
  follow it, and it warns when the reference answer has a condition while the keys are off.
- The builder page must not contain the text of a script tag anywhere except in its real tags (comments and JS
  strings included; build it as `"<"+"script"`). htmlpreview.github.io rewrites every `<script` it finds in the page
  text, which broke a JS string ("Unexpected identifier 'text'", found 2026-10-09). GitHub Pages serves the page as is
  and is the better way to publish it.
- htmlpreview also drops every `<script src>` that is not on GitHub (it keeps only the tag's empty text), so MathJax
  never loaded and the keyboards showed plain LaTeX. MathJax's tag is therefore created from a script (like the
  keyboard library's), which htmlpreview does not touch.
- Formulas are always left to right and left-aligned, also in a Hebrew / Arabic Moodle page (2026-10-09): the library
  sets `direction:ltr; text-align:left` on its root and display fields (they inherited rtl / right before), and the
  snippet puts the keyboard and the reference in `dir="ltr"` boxes; feedback texts keep the student language direction.
- MathJax version: Moodle (up to 4.x) loads **MathJax 2.7**. The library typesets with whichever version the page has
  (`typesetMath`: version 3 `typesetPromise`, version 2 `Hub.Queue`). Before, it knew only version 3, so in Moodle the
  formula field in the question text turned into plain LaTeX as soon as the student typed (2026-10-09).
- **Releasing a library change** (Moodle loads it through jsDelivr `@main`, which caches for hours):
  1. raise `ChemicalGrammar.version` in `chemical-keyboard-v4.js` (2.0.5 on 2026-10-09);
  2. commit and push (GitHub Desktop);
  3. open `https://purge.jsdelivr.net/gh/AviNat/chemistryLib@main/chemical-keyboard-v4.js` (wait for "finished");
  4. in Moodle start a new preview, Ctrl+F5, and check `ChemicalGrammar.version` in the console.
  A change in the student-side code (`chemkbdRun`) instead needs the Moodle code copied again (`SNIPPET_VERSION`).
- The debug log messages were removed (2026-10-08). Still reported in the console: a STACK input not found, the code
  pasted twice / duplicate question id, a failure, the library not loading. The code version is in the snippet's
  first comment.
- The snippet starts the keyboard only after the page is fully read (`DOMContentLoaded`): the `[[input:…]]` boxes come
  after the code in the question text, and when the library is already loaded (cached) the keyboard otherwise started
  before they existed - the answer was not restored and no feedback was shown (found 2026-10-08 in Moodle).
  A STACK input named in the config but not found is reported in the browser console.
  - An empty answer empties both, so STACK sees an unanswered question.
- Inputs are found inside the enclosing `.que` by the end of their name (STACK names them `q<usage>:<slot>_ans1`), and
  get `input` + `change` events so STACK notices the new value.
- The score is computed in the browser, so a determined student could change it (acceptable for practice).
- The earlier placeholder "copy the answer into the first answer box" (model JSON) is removed.
- The STACK integration works and is simple to set up (confirmed by the user 2026-10-10, with a demo question).

## Review settings outside the code (design, 2026-10-10 - not implemented, deferred)

**Deferred** until the decision on a dedicated Moodle question type (see "Decided"): such a question type would take
the review options from Moodle and make this mechanism unnecessary in Moodle.

Goal: the teacher changes what the review page shows (grade, feedback, correct answer) **without generating the code
again**, and the same generated code serves every quiz.

### Why not read Moodle's review page (rejected)
The keyboard could guess the quiz review options from what Moodle renders (`.rightanswer`, `.specificfeedback`,
the mark in `.info .grade`). Rejected: Moodle's output may change between versions, and STACK leaves some parts out
even when the option is on (no `.specificfeedback` when the PRT gives no text). Named settings are a stable contract.

### The settings are quiz-wide by nature
In Moodle the review options (marks, specific feedback, right answer) are set **per quiz** and apply to every question
in it. So the display is the same in every case:
- a question with **several parts** (several keyboards in one question, each with its own question id);
- **several questions on one page**;
- the **review / summary** page, which can show all the questions of the quiz.

So the main setting is **one page-wide value**; a per-question value is only an exception.

### Mechanism: one namespace object on `window`
```html
<script>
  window.chemkbdSettings = window.chemkbdSettings || {};
  chemkbdSettings["*"]  = { showGrade: true, showFeedback: true, showCorrectAnswer: false };  // all keyboards on the page
  chemkbdSettings["q1"] = { showCorrectAnswer: true };                                     // exception for one question id
</script>
```
- One object (`chemkbdSettings`), not `window.<questionName>`: the browser creates a `window` global for every
  element id (`window["chemkbd-q1"]` is already the host div), and plain names may clash with Moodle's scripts.
- Lookup per setting: `chemkbdSettings[id]` → `chemkbdSettings["*"]` → `review` in the config JSON → shown (true).
  Each setting is looked up on its own, so an exception can name only the setting it changes.
- The keyboard reads the object when it starts (`DOMContentLoaded`), after all scripts in the page text have run,
  so the block can be anywhere on the page.
- Names follow Moodle's review options, which teachers know:

  | Setting | Moodle review option | Today in the config |
  |---|---|---|
  | `showGrade` | Marks | `review.grade` |
  | `showFeedback` | Specific feedback | `review.details` |
  | `showCorrectAnswer` | Right answer | `review.reference` (also turns the marking of the student's answer on / off) |

- Not tied to Moodle: any platform that can put a script on the page can set the same object.
- STACK may fill the values from question variables (`showGrade: {#sg#}`) - not tested.

### Builder output
- The generated code starts with a short, separate settings block with a comment ("edit true / false here"), filled
  from the builder's review checkboxes, so the teacher edits three words in the HTML view and never the JSON or the code.
- The config JSON keeps `review` as the fallback; old files (only `review` in the JSON) keep working.
- Changes `chemkbdRun` → new `SNIPPET_VERSION`. No library change.

### Open
- **Where a quiz-wide block lives.** Moodle has no per-quiz place for page scripts. Candidates: in each question's
  text (works, but must be edited in every question, and the last block run wins for `"*"`); a Description item in the
  quiz (only on its own page; a paged review shows other questions without it); the site's "Additional HTML" (admin
  only, the whole site). Decide whether the generated block writes `"*"` or the question's own id - if every question
  writes `"*"`, they must agree, which matches the quiz-wide nature but hides a mismatch.
- The teacher must keep the settings in step with the quiz's real review options by hand (the price of not reading
  Moodle's page).

## Decided (2026-10-08)
- The snippet goes into a Moodle **STACK** question. The connection mechanism will be designed later by the user;
  until then the answer-box option is a placeholder (a STACK input is a text input inside `.que`, so it may fit).
- Library address in the Moodle code: `https://cdn.jsdelivr.net/gh/AviNat/chemistryLib@main/chemical-keyboard-v4.js`
  (GitHub through jsDelivr) by default. Files saved with an empty or a local `file://` address get it when opened.
- The builder page loads the library **local first**: `chemical-keyboard-v4.js` next to the page, and if that fails the
  public GitHub copy (`LIBRARY_SOURCES`, `loadKeyboardLibrary`; the builder code runs in `startBuilder` after the load).
  The same file serves development (local copy, changes visible before they are pushed) and teachers on the internet.
  The settings show which copy is in use (orange when local). The Moodle code always uses the public address.
- `<script>` tags in the question text are not a problem.
- The reference answer will not be visible in the Moodle question (not a concern for the snippet).
- A dedicated Moodle question type (the builder as the edit form, saved in Moodle, review options from Moodle) was
  is under consideration (2026-10-10), **not decided**. Concerns: porting the grading and keeping it compatible across
  platforms is a large effort. Either way the snippet approach stays, so the keyboard remains usable on other
  learning platforms. The review-settings design above waits for this decision.

## Open
- Verify in the real STACK: score field of the PRT taking `ans1`, hidden inputs with validation off.
- Planned library features that the tool will need: optional process keys (other panel groups configurable),
  molecule keys on the elements panel (e.g. H₂O), more than one correct answer.
