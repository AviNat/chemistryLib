# Chemical keyboard question builder (teacher tool)

File: `chemical-question-builder.html` (next to `chemical-keyboard-v4.js`, which it loads). First version 2026-10-08,
built on the **current** library functionality only.

## What the teacher sets
| Setting | Goes into the keyboard config as |
|---|---|
| Student language (he / ar / en), independent of the tool's interface language | `language` |
| Element keys: default set / custom list (periodic table + drag to reorder) / none | omitted / `elements:[...]` / `elements:[]` |
| Reference answer (entered with the keyboard) | `correctAnswer` |
| Initial student answer (optional, e.g. a partial answer to complete) | `value` |
| Rubric per category: no penalty / once / per error (+ cap, + `allMissing` for states), or no grading | `rubric` (format of RUBRIC-DESIGN.md) |
| Isomers as different substances | `distinguishIsomers` |
| Check button with feedback for the student | snippet option |
| Copy the answer into the Moodle question's answer box | snippet option |

- The keyboards in the tool use the **student** language, so the teacher sees what the student sees.
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

## Answer box (option)
- The keyboard writes the student's answer into the first text input / textarea of the enclosing `.que`, hides it,
  and restores the keyboard from it when the page is shown again.
- Stored as the keyboard **model** JSON (`getModel()`), because `getValue()` text is lossy:
  `2H₂O` reads back as `₂H₂O`, `SO₄²⁻` as `SO₄₂-`. A lossless text form (`_{}`/`^{}`) in the library would allow a
  readable stored answer; not available yet.

## Decided (2026-10-08)
- The snippet goes into a Moodle **STACK** question. The connection mechanism will be designed later by the user;
  until then the answer-box option is a placeholder (a STACK input is a text input inside `.que`, so it may fit).
- Library address in the Moodle code: `https://cdn.jsdelivr.net/gh/AviNat/chemistryLib@main/chemical-keyboard-v4.js`
  (GitHub through jsDelivr) by default. Files saved with an empty or a local `file://` address get it when opened.
  The tool page itself still loads the local `chemical-keyboard-v4.js` next to it.
- `<script>` tags in the question text are not a problem.
- The reference answer will not be visible in the Moodle question (not a concern for the snippet).

## Open
- The STACK connection mechanism (where the answer and the score go).
- Planned library features that the tool will need: optional process keys (other panel groups configurable),
  molecule keys on the elements panel (e.g. H₂O), more than one correct answer.
