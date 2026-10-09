# Chemical keyboard: molecule keys (design)

Status: **design phase**, nothing implemented. Decided on 2026-10-09. Base: `chemical-keyboard-v4.js` (library 2.0.5)
and the question builder (`QUESTION-BUILDER.md`).

## 1. Goal

Keys that insert a whole molecule, ion or group (H₂O, SO₄²⁻, (NO₃), CH₃…) as a shortcut for typing it.

## 2. Approach: syntactic sugar (decided)

A molecule key **types the characters** of its formula at the cursor, with their sub/superscript levels, exactly as
if the student had typed them. There is no new node type:

- comparison, grading, the saved answer (STACK `ans2`) and the review page are unchanged;
- the inserted formula can be edited like typed text (H₂O → H₂O₂, SO₄²⁻ → SO₃²⁻);
- a typed H₂O and a key-inserted H₂O are the same thing.

Rejected: an indivisible token (needs parser and comparison changes, cannot be edited, and must still compare equal to
the typed formula, so it gains nothing but a one-press undo); typing names (`water`) (a text field, clashes with symbols,
three languages).

### Delete as a block (decided)
The inserted characters form a **block**: one DEL right after it removes the whole block, like a two-letter element.
Once the student edits inside the block (insert or delete a character in it), the block is dissolved and DEL removes
one element at a time. After a page reload there are no blocks (the saved answer is plain text) - harmless.

### Insertion rules
The same rules as typing: after a coefficient (2 + H₂O = 2H₂O), after `·` (·5 + H₂O), inside the condition above the
arrow (V₂O₅ as a catalyst). Items with a state are not allowed in the condition (as states are not today).

## 3. Domains (to be confirmed against the curriculum with an expert)

| Kind | Examples | Typical use |
|---|---|---|
| Common molecules | H₂O, CO₂, O₂, H₂, N₂, NH₃, CH₄, HCl | combustion, synthesis, decomposition |
| Free polyatomic ions (with charge) | SO₄²⁻, NO₃⁻, CO₃²⁻, PO₄³⁻, OH⁻, NH₄⁺, HCO₃⁻, MnO₄⁻, Cr₂O₇²⁻, CH₃COO⁻ | ionic equations, dissolution |
| Groups without charge (inside a compound) | (SO₄), (NO₃), (OH), (NH₄) | Al₂(SO₄)₃, (NH₄)₂SO₄, Ca(OH)₂ |
| Organic groups | CH₃, CH₂, OH, COOH, C₆H₅ | condensed structural formulas |
| Water of crystallization | ·5H₂O, ·6H₂O | hydrates |
| Above the arrow | V₂O₅, Pt, conc. H₂SO₄ | catalysts |

- A charged ion and the same group inside a compound are **separate keys** (charges inside a compound are a common
  error).
- Expected per question: one domain, **4-8 keys**.
- **Teaching risk:** a key can give the answer away (an SO₄²⁻ key answers "write the formula of sulfate"). The set is
  chosen per question by the teacher; the default is **no molecule keys**.

## 4. Configuration (proposal)

```js
molecules: [
  "H_{2}O",                                   // value notation, as read by setValue
  "SO_{4}^{2-}",
  { formula: "(SO_{4})", label: "(SO₄)" },    // optional label
  { formula: "CH_{3}COO^{-}", name: { he: "אצטט", en: "acetate", ar: "أسيتات" } }
]
```
- Missing or `[]`: no molecule keys, the panel as today.
- Key label: the formula (subscripts and charges drawn). Tooltip: the name in the student language (built-in items from
  a name table in the library; custom items their `name`, else the formula).

## 5. Panel (decided)

**One combined panel** (no switching between elements and molecules - with 4-8 molecule keys it fits):
elements in **3 columns** (the element buttons are made narrower to fit), molecules in **2 wider columns** beside them
(labels like Cr₂O₇²⁻ are longer). The keyboard window grows (today 435 px); on a narrow screen the molecule part wraps
below the elements. Without molecule keys the panel stays as today (but with the narrower 3-column elements).

## 6. Builder (proposal)

A "Molecule keys" section after the element keys:
- built-in sets with checkboxes, grouped by domain (section 3);
- "add your own": a small keyboard input (like the reference answer) and an optional name;
- chips in panel order, drag to reorder, click to remove;
- a **note** listing the molecules / ions of the reference answer and which of them are keys, warning that a key may
  give the answer away (no automatic "add" button, because of that risk).

## 7. Open (waiting for the curriculum expert)

1. **Electrons:** redox half-equations need e⁻ (Fe³⁺ + e⁻ → Fe²⁺). Likely answer: add `e^{-}`. The grammar and the
   comparison do not accept it today (lowercase `e` is not an element) - a grammar change, not just a key.
2. **The built-in sets** (section 3): which molecules, ions and groups the curriculum needs.
3. **Later: particles for nuclear / physics equations** - γ, and probably α, β⁻, β⁺, n, p, e⁻. Another category of
   "elements"; nuclear notation also needs mass and atomic numbers before the symbol (²³⁸₉₂U), a larger grammar change.
   Electrons (item 1) should be designed so that this category can be added later.
