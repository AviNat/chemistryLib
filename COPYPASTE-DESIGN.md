# Chemical keyboard: copy and paste (design)

**Menu version, library 3.3.0 (2026-10-20, the user):** the keys in the keyboard row were replaced by a ⧉ menu button
at the corner of the box that shows the answer - the answer box on the page (closed, both layouts) and the typing area
(open: next to × when docked, below the title bar when floating). The menu: Products (right side) / Whole equation /
Reactants (left side), each with its formula (an answer without an arrow: Copy), then Paste with what it will paste
(greyed when nothing was copied); it inserts at the cursor. The menu is position:fixed, so a STACK frame grows to show
it. Builder: the check box "Allow copy and paste" (on; off writes `clipboard:false`). The labels name the sides
chemically, since "right" is ambiguous in a right-to-left interface.

Status before: **the simple version implemented 2026-10-20 (library 3.2.0)**: the keys ⧉ Copy (the whole answer) and ⎘ Paste
(at the cursor) at the end of the arrows row, Ctrl+C / Ctrl+V, the library's own clipboard in `localStorage`
(`chemkbd.clipboard`: value, readable text, time; kept a day; shared by the frames of a STACK page), the system
clipboard gets the readable text, pasted readable text is converted (`valueFromPlain`), a pasted equation keeps the
conditions above its arrows. `config.clipboard: false` turns it off. Not done: the selection (section 4), copy from
the review page. Use: a sequence of single-arrow equations (MULTISTEP-DESIGN.md).

Original status: **design, 2026-10-18.** Requested by the user: copy from the keyboard's typing area, paste
into a keyboard; a key that copies the whole content without selecting it, and copying a selection (there is no
selection today). Rationale: a sequence of transformations, where the product of one equation is the input of the
next one (often the next question).

## 1. What there is today

- The editor is a list of characters (`this.chars`: `{ch, script, pair, kind, condition}`) and one cursor
  (`this.cursor`; inside a condition above an arrow: `this.cond = {arrow, pos}`). No selection.
- `valueTextOf(chars)` writes characters as value text (`2H_{2}+O_{2}→[Δ]2H_{2}O`) and `modelFromValue` reads it back
  exactly (the saved answer uses it). `insertMolecule(text)` already inserts value text at the cursor with new
  parenthesis / state groups and formula states - **paste is that function**.
- Each STACK question runs in its own frame (a separate document): a variable in the library is **not** shared
  between questions.

## 2. Copy

**A. "Copy" key - the whole content, no selection needed.** Copies everything in the typing area. The simplest
action for the main use (take the whole product side or the whole equation).

**B. Copy a selection.** New: a selection in the typing area (section 4); Ctrl+C or the copy key copies only it.
Rule: with a selection the key copies the selection; without one, everything.

What is put on the clipboard:
- **Plain text, readable** - `2H₂(g) + O₂(g) → 2H₂O(l)` (Unicode subscripts / superscripts, the condition as
  `→[Δ]`): useful when a student pastes into a document or a forum.
- **The exact value text**, stored by the library next to it (section 5), so a paste into another keyboard is
  lossless (states, pairs, nuclide numbers, formula states).

Also from the review page (read-only answer)? Recommended: yes for the student's own answer, **no** for the reference
answer (it would hand the answer to the next question). A teacher option `clipboard` (on by default) turns copy and
paste off for a question where copying would defeat the task.

## 3. Paste

- **"Paste" key** and **Ctrl+V**: inserts at the cursor (replacing the selection, if any), with `insertMolecule`.
- Where the text comes from, in order:
  1. the library's own last copy (section 5) - exact, works between questions on the page;
  2. otherwise the system clipboard text: value text is read as is; readable text (`2H₂O`, `Na⁺(aq)`, `→`, `⇌`) is
     converted - Unicode script digits to sub / superscripts, `(s) (l) (g) (aq)` after a formula to states, `->` to
     `→`; anything else is inserted as typed characters, and the red "!" then shows what is not valid.
- After pasting, the automatic-subscript rules do not change what was pasted (it is inserted as written).
- Pasting inside a condition above an arrow: the formula's characters only (states left out), as `insertMolecule`
  already does.

## 4. Selection (new)

- **Keyboard:** Shift+← / Shift+→ extend the selection by one unit (an element symbol, a state, a cis/trans word -
  the same units the arrows already use); Ctrl+A selects everything; Esc or an arrow without Shift clears it.
- **Mouse / touch:** drag across the typing area; Shift+click extends; a plain click places the cursor (as today).
- **Units are never split:** the selection always starts and ends between units. A selection that would take one
  parenthesis of a pair takes the whole pair.
- **Drawn** as a light-blue background behind the selected characters (the same mechanism as the feedback marking).
- **With a selection:** typing replaces it, DEL deletes it, Ctrl+X / a cut key copies then deletes it.
- Not inside a condition above an arrow in the first version (that editor has its own cursor) - copy there copies
  the whole condition's arrow with the equation.

## 5. Sharing between questions on the page

- **System clipboard:** `navigator.clipboard.writeText` from a click / key press; the STACK frame is same-origin
  (`allow-same-origin`, `srcdoc`), so writing is allowed. **Reading** the system clipboard from a button needs a
  browser permission (a prompt, or blocked in a frame) - so the Paste key does not depend on it.
- **The library's own clipboard: `localStorage`** (key `chemkbd.clipboard`: `{valueText, plain, time}`). All the
  frames of the page share the Moodle site's origin, so a copy in question 3 is there for the paste in question 4,
  without any permission. Kept 24 hours; written on every copy.
- **Ctrl+V** uses the browser's paste event, which carries the system clipboard text without a permission prompt: if
  it equals the stored `plain`, the stored exact `valueText` is used; otherwise the text is converted (section 3).

## 6. Keys and texts

- Two keys in the operator row (or the window header): **⧉ Copy** and **📋 Paste** (icons, with tooltips "Copy (all,
  or the selection)" / "Paste"), in he / ar / en. A short confirmation "Copied" near the key.
- Paste disabled (greyed) when there is nothing to paste - neither a stored copy nor a permission to read.
- Hidden when the teacher turns `clipboard` off; the builder gets the check box "Allow copy and paste".

## 7. Plan

1. Library: `getSelection` / `setSelection` and drawing; Shift+arrows, Ctrl+A, drag; typing / DEL replace the selection.
2. Library: copy (keys, Ctrl+C, readable text + `localStorage`), paste (key, Ctrl+V, conversion of readable text).
3. Builder: "Allow copy and paste"; the keys appear in "Try".
4. Tests: selection and units (keys), copy → paste round trips for every kind of formula (states, charges, nuclides,
   conditions, hydrates, formula states, fatty-acid notation), readable-text conversion.
5. In Moodle: copy in one question, paste in the next (two frames), and the review page.

## 8. Questions

1. Copy from the review page: the student's own answer only (recommended), or also the reference answer?
2. Should the teacher be able to turn copy / paste off per question (recommended), or always on?
3. Keys in the operator row (always visible) or in the window header (less crowded)?
