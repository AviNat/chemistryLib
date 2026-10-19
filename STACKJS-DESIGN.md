# Chemical keyboard: STACK-JS and other systems (design)

Status: **implemented 2026-10-18 - library 3.0.0, builder template "2026-10-18.1 STACK-JS"** (probe results in section 7;
two questions on one page confirmed by the user). Implemented as designed with option A for the review:
`ChemicalKeyboard.mountStackJs(stack_js, config)` / `ChemicalKeyboard.mount(element, config, {state, readOnly,
onChange})`, `runQuestion(host, cfg, adapter)`; the classic queue and snippet removed; the frame follows its content
(`fitFrame`: the page height and any open fixed window, `resize_containing_frame`); without MathJax the answer box and
the formulas in the feedback are drawn as HTML (`formulaNodes`, `formulaTextToChars`). Builder: generates the
template (hidden inputs + `[[iframe]]` + one-line `[[script type="module"]]`), reads it back, model answer of the state
input = the state JSON as a Maxima string; the review-div option is hidden (a frame cannot reach the question text).

**Docked keyboard (library 3.1.0, 2026-10-18, the user):** a frame cannot show a window over the page, so
`mountStackJs` uses `layout: "docked"` (other systems keep the floating window unless they set it): the typing area
and the keys open in place of the answer box and close back to it - × button, Esc (when no element window is open),
or a click outside the frame (the frame's window `blur`). The frame follows: 63 px closed, about 500 px open.
`fitFrame` measures the bottom of the content (not `scrollHeight`, which never shrinks below the frame's height) and
checks with `setTimeout` (an unfocused frame may hold back `requestAnimationFrame`).

Original status: **design, 2026-10-18.** Requested by the user: follow the STACK-JS convention, keep one
builder for Moodle STACK and for other systems, fixed code in the library and only the configuration generated,
and several questions on one page.

**Decided 2026-10-18 (the user):** no backward compatibility - there are only a few demo questions. The classic
snippet (`__chemkbdQuestions` queue, `DomAdapter`, the "answer || feedback" text state) is **removed**, not kept
beside STACK-JS; the builder's targets are STACK-JS and "other systems". Sections below that mention the classic
path describe what is replaced. Probe question: `STACKJS-PROBE.md`.

## 1. What STACK-JS requires (official documentation, checked 2026-10-18)

Sources: [STACK-JS](https://docs.stack-assessment.org/en/Specialist_tools/STACK-JS/),
[Iframe blocks](https://docs.stack-assessment.org/en/Authoring/Question_blocks/Iframe_blocks/).

- Question code runs in a **sandboxed iframe**, not in the Moodle page. It cannot touch the page's DOM; it can only
  read and set the question's inputs and a few other things through `stack_js`.
- `[[javascript]] … [[/javascript]]` builds a **hidden** iframe (its content becomes a `<script type="module">`).
  It suits logic without a visible UI - **not** a keyboard.
- `[[iframe width=… height=… title=…]] … [[/iframe]]` is a **visible** sandbox (default 500×400 px; `width`,
  `height`, `aspect-ratio` as for `[[jsxgraph]]`; `scrolling='false'`). Inside it: `[[script src=…/]]` (into the
  frame's head; attributes `type`, `src`, `async`, …) and `[[style]]`. `stack_js` is available.
- Inputs: `stack_js.request_access_to_input(name, inputevents, limittoquestion)` → a promise of the id of a copy of
  the input inside the sandbox. A value set there reaches Moodle after `el.dispatchEvent(new Event('change'))`.
  `limittoquestion = true` restricts the search to the question that contains the frame (several questions on a
  page). Without it the first input of that name **on the page** is used.
- Other functions used here: `resize_containing_frame(width, height)`, `display_error(msg)`,
  `get_input_metadata(name)`, `clear_input(name)`.
- The pasted example (`stack_js.then((channel) => …)`, `channel.request('set_input_value', …)`, `<script src>` in
  the question text, the UI in `[[javascript]]`) does not match this documentation; the design follows the
  documentation.

Consequences for the keyboard:

| Today (classic snippet) | Under STACK-JS |
|---|---|
| Runs in the Moodle page; finds the inputs by `name$='_ans1'` in `.que` | Runs in an iframe; inputs through `request_access_to_input(…, true)` |
| Hides the STACK inputs itself (`style.display`) | Cannot - the question text must hide them (a hidden wrapper) |
| Keyboard window floats over the page | Confined to the iframe: the frame must grow when the keyboard opens |
| MathJax of the page renders the read-only displays | No MathJax inside (unless loaded): HTML rendering (already the fallback) |
| Review = the inputs are read-only | To be verified (section 7); alternative: the review in the feedback (section 5) |
| Several questions: ids made unique, `.que` search | Each frame is its own document: isolated by construction |

## 2. Principle: one core, several adapters

The library keeps **all** student-side code. A question is started by one fixed entry point per platform; each
platform is an *adapter* with the same small interface. The builder generates only data (the configuration) and
a fixed, platform-specific wrapper.

```
           builder  ──>  configuration (JSON, the same for every platform)
                              │
     ┌────────────────────────┼─────────────────────────┐
  classic STACK            STACK-JS                 other systems
 (snippet in page)     ([[iframe]] sandbox)     (HTML page, LMS, app)
     │                        │                         │
 DomAdapter              StackJsAdapter        CallbackAdapter / EventAdapter
     └──────────────> ChemicalKeyboard.runQuestion(host, cfg, adapter) <──────┘
                     (keyboard, grading, feedback, review - unchanged)
```

### Adapter interface

```js
adapter = {
  /* the saved state when the page is shown again, or null */
  load():            Promise<{ answer: "H_{2}O", ... } | null>,
  /* after every change: what to store and the score 0..1 */
  save(state, score): void,
  /* answering, or showing the submitted answer */
  isReview():        Promise<boolean>,
  /* the space the keyboard needs (iframe platforms) */
  resize(width, height): void,
  /* errors where the teacher can see them */
  error(message):    void
}
```

`runQuestion` stops looking for inputs itself (today's `findInput`, `setInput`, `.que`, `style.display`): it asks the
adapter. The grading, the feedback text and the review rendering stay as they are.

### Adapters

| Adapter | Where | load / save | review |
|---|---|---|---|
| `DomAdapter` | classic STACK snippet (today), any page with hidden inputs | the inputs found by name in the question | inputs read-only |
| `StackJsAdapter` | inside `[[iframe]]` | `request_access_to_input(name, false, true)`; set value + `change` event | section 5 / 7 |
| `CallbackAdapter` | other systems, the builder's "Try" | `cfg.initialState`; `onChange(state, score)` callback | `cfg.readOnly` |
| `EventAdapter` (optional) | systems talking to an iframe | `postMessage` in / out (`chemkbd:state`, `chemkbd:change`) | a message |

## 3. Entry points (fixed code in the library)

```js
// classic STACK snippet - unchanged, existing questions keep working
window.__chemkbdQuestions.push({ id, script })          // -> startQueuedQuestions -> DomAdapter

// STACK-JS: inside [[iframe]]
ChemicalKeyboard.mountStackJs(config)                    // -> StackJsAdapter, element #chemkbd

// any other system
ChemicalKeyboard.mount(element, config, {
  state: savedStateOrNull, readOnly: false,
  onChange: function (state, score) { /* store it */ }
})                                                       // -> CallbackAdapter
```

## 4. What the builder generates for STACK-JS

Only the configuration changes from question to question; the rest is a fixed template.

```html
<!-- hide the inputs: STACK-JS cannot hide them from inside the sandbox -->
<div style="display:none">[[input:ans1]] [[validation:ans1]] [[input:ans2]] [[validation:ans2]]</div>

[[iframe width="100%" height="110px" scrolling="false" title="Chemical keyboard"]]
[[script src="https://avinat.github.io/chemistryLib/chemical-keyboard-v4.js"/]]
<div id="chemkbd"></div>
[[script type="module"]]
ChemicalKeyboard.mountStackJs({"formatVersion":2,"correctAnswer":"2H_{2}+O_{2}→2H_{2}O", ...,
  "inputs":{"score":"ans1","state":"ans2"}});
[[/script]]
[[/iframe]]
```

Plus a short instruction the builder shows (not code): input types (ans1 numeric or algebraic, ans2 string),
"validation: none", the PRT on ans1 (`ATNumAbsolute(ans1, 1, 0.0001)` or a mark = ans1).

- **Several questions on one page:** each question has its own frame (its own document: no shared ids or
  globals); `limittoquestion = true` binds each frame to the inputs of its own question even when two questions
  use `ans1`. The library file is cached by the browser, so it is downloaded once.
- **Several keyboards in one question:** one frame per keyboard, each with its own pair
  (`ans1`/`ans2`, `ans3`/`ans4`): the builder's input-name fields already exist.
- **The keyboard window:** inside a frame the floating window cannot leave the frame. New layout option
  `layout: "inline"` - the keys open below the answer box inside the frame - and the frame follows the content:
  a `ResizeObserver` calls `stack_js.resize_containing_frame("100%", height + "px")` (small while closed, tall
  while open).
- **MathJax:** none in the frame; the read-only displays use the HTML rendering (already the fallback).
  Optional: `[[script src=MathJax]]` in the template for the LaTeX look.

## 5. Review: two options

**A. The same frame detects the review** - if the copy of a read-only input is read-only / disabled in the
sandbox too (section 7, test 2). Simplest for the teacher; the builder's review options stay in the configuration.

**B. The review in the feedback (recommended if A fails, and worth considering anyway).** The question text has
the answering frame only; the review is a second frame in the **PRT feedback** (or general feedback):

```
[[iframe width="100%" height="220px" title="Feedback"]]
[[script src=".../chemical-keyboard-v4.js"/]]
<div id="chemkbd"></div>
[[script type="module"]]
ChemicalKeyboard.mountStackJsReview({ ...same configuration..., "inputs":{"state":"ans2"} });
[[/script]]
[[/iframe]]
```

Moodle shows feedback only when its review options allow it - so "show the reference answer / the details after
the quiz closes" is set **in the quiz settings**, as teachers expect (the earlier deferred design "Review settings
outside the code", QUESTION-BUILDER.md). The answering frame never needs to know whether it is the review.

## 6. The saved state (ans2)

Today: `answer || score% | feedback | …` (text; quotes removed for the STACK string input). Proposed - versioned JSON:

```json
{"v":2,"answer":"2H_{2}+O_{2}→2H_{2}O","score":0.9,"feedback":["90%","The coefficient of O2 ..."]}
```

- The reader accepts both forms (old questions and old attempts keep working).
- Kept short: no AST, only what is needed to show the answer again and for Moodle's response history.
- If the string input mishandles quotes (section 7, test 4), the old text form stays the STACK format and JSON is
  used only by other systems.

## 7. To verify on the STACK server first (a probe question, ~30 minutes)

1. The STACK version on the server (STACK-JS and `[[iframe]]` need a recent STACK; `limittoquestion` is newer).
2. Review: is the sandbox copy of a submitted (read-only) input `disabled` / `readOnly`? -> option A or B.
3. `[[script type="module"]] … [[/script]]` with inline code inside `[[iframe]]` (the documentation shows `src` only).
4. JSON with quotes in a string input: saved and read back unchanged?
5. Two copies of the question on one quiz page (and the same question twice): each frame writes only its own
   inputs.
6. The keyboard inside the frame: keyboard focus, the physical keyboard, Hebrew / Arabic, resize while opening.

### Probe results (petel.stweizmann.org.il/chemistry, 2026-10-18)

| Test | Result |
|---|---|
| T1 version | not reported yet; `corsscripts/cors.php` exists, so a recent STACK with STACK-JS |
| T2 review | the sandbox copies of submitted inputs are `readOnly = true` (attribute `readonly`), `disabled = false` -> **option A**: the frame detects the review itself (`readOnly \|\| disabled`) |
| T3 inline module script in `[[iframe]]` | works |
| T4 JSON with quotes and Hebrew in a string input | saved and read back identical -> **JSON state** (section 6) |
| T5 several questions on a page | not tested yet |
| T6 library from GitHub Pages inside the frame | loads (2.8.8); the keyboard is created; usability inside the frame not reported yet |
| T7 frame in the PRT feedback | the `<iframe>` is in the page (srcdoc correct) but nothing is shown - not needed after T2 (option B dropped) |
| other | the frame gets the page language (`lang="he_kids"`): "system" language works inside the frame; STACK shows the inputs' model answers on the review page -> the inputs need the extra option **`hideanswer`** |

## 8. Plan

1. Probe question (section 7) - decides A/B and the state format.
2. Library: adapter interface; `DomAdapter` = today's code moved out of `runQuestion` (no behaviour change, all
   tests pass); `CallbackAdapter` + `ChemicalKeyboard.mount`; the builder's "Try" uses it.
3. Library: `StackJsAdapter`, `mountStackJs` (+ `mountStackJsReview` if B), `layout: "inline"`, frame resize.
4. Builder: a **Target** choice - "Moodle STACK (STACK-JS)", "Moodle STACK (classic, current)", "Other system
   (HTML + JavaScript)"; the same configuration, a different fixed template and instructions for each.
5. Tests: the adapters with a fake `stack_js` (promises, change events) in chemTests; then the probe question.

Existing questions are not affected: the classic snippet and its queue stay in the library.
