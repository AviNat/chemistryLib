# Chemical keyboard: enhancements requested 2026-10-15

All four are implemented (library 2.4.1, builder snippet 2026-10-15.3). Tests: `chemTests.js`, 142 / 142 pass
(groups "No automatic subscript", "Ion keys", "Formula state", "Nuclear"). A test case may give a keyboard `config`.

| # | Option (library config) | Builder | Default |
|---|---|---|---|
| 1 | `formulaStateKey: true` | "Show the key (▢) for a state written as a formula" | off |
| 2 | `autoSubscript: false` | "Automatic subscript" | on |
| 3 | `ionKeys: true` | "Show the ion keys ⁺(aq) and ⁻(aq)" | off |
| 4 | `nuclear: true`, `particleLabels: "short" \| "full"` | "Nuclear equation", "Particle keys show" | off, short |

## 2. No automatic subscript

A digit after a symbol or ")" is no longer made a subscript by itself; the student chooses the level with `_` / `^`
or the panel's level keys. Kept: a capital letter, "+", an arrow and "·" return to the normal level, and a charge sign
ends the superscript. Only typing changes; analysis and grading are the same.

## 3. Ion keys ⁺(aq) and ⁻(aq)

A key inserts exactly what the student would type: a charge sign at the superscript level, then (aq). No new kind of
object: DEL removes (aq) first, then the sign; the arrows step over them the same way; `Ca ^2 ⁺(aq)` gives Ca²⁺(aq).

## 1. State written as a formula (decided: formulas only)

I₂(CCl₄), Br₂(C₆H₁₄). Words like dil / conc are not accepted; if needed later, each gets a dedicated key.
- The key (▢) adds a box in the state position (lower line). One character of kind `fstate` (ch "◌") holds the
  formula in `.condition`, so it is edited exactly like the condition above an arrow: the cursor enters it, the same
  keys work, Enter / → leave it, a click enters it. Inside: element letters only (a lowercase letter only after a
  capital), digits, `_` `^`, parentheses; no commas, words or condition symbols (those keys leave the box first).
- DEL after the box goes into it (deleting from its end); DEL in an empty box removes it.
- Value notation: `I_{2}({CCl_{4}})` - the braces tell it from (aq). `getValue()` gives `I2(CCl4)`.
- Analysis: the state is the formula in a fixed order with Unicode subscripts ("CCl₄"), so the same formula written
  in another order is the same state, and it reads well in messages. Errors are the existing state errors
  (`missing-state`, `wrong-state`, `unexpected-state`, rubric category `states`). An unknown element inside is
  reported as usual (pointing at the box).

## 4. Nuclear equations (decided)

- **Writing**: mass number A (superscript) and atomic number Z (subscript) before the symbol, ²³⁸₉₂U, typed as
  `^238 _92 U`; drawn right-aligned against the symbol. A coefficient still comes first: 3¹₀n. In a nuclear keyboard
  a sign at the start of a subscript is the sign of Z (⁰₋₁e typed by hand).
- **Particle keys** (condition keys are hidden): α, β, β⁺ (positron), γ, e⁻, n, p.
  `particleLabels: "full"` shows and inserts ⁴₂α, ⁰₋₁β, ⁰₊₁β, ⁰₀γ, ¹₀n, ¹₁p (e⁻ has no full form), as separate
  characters, so DEL and the arrows work as if typed by hand. The labels are drawn with the typing area's
  stacked layout (fixed box, numbers placed absolutely), in a larger font (2026-10-15).
- **State keys are the teacher's choice** (decided 2026-10-15): `states` - hidden by default in a nuclear question,
  `states: true` shows them (builder: "Show the state keys ... in the nuclear equation"). The row also holds the ion
  keys and the formula-state key. Grading of states works on nuclides as on substances.
- **Numbers entered with the element** (`autoNuclideNumbers`, builder option under "Nuclear equation"; for an early
  stage of learning): an element typed at the start of a substance gets its mass and atomic numbers - the most
  abundant isotope, for radioactive elements the one usually taught (U 238, Ra 226, Rn 222, Pu 239, Am 241) or the
  longest-lived (table `MASS_NUMBERS`). C then l gives ³⁵₁₇Cl (the automatic numbers are replaced). Only characters
  marked `.auto` are ever replaced: numbers the student typed or changed are kept, and nothing happens inside a
  formula.
- **Parsing does not depend on the option**: chemical formulas never start with a superscript / subscript, and the
  particle letters can only be typed with the particle keys. A comparison is nuclear when the reference has a nuclide
  or particle (or `options.nuclear`).
- **Identity = (A, Z)**, so equivalent forms are equal (decided): ⁴₂α = ⁴₂He; ⁰₋₁β = ⁰₋₁e; ⁰₊₁β = ⁰₊₁e; ¹₁p = ¹₁H;
  and, when the reference writes no numbers, α = ⁴₂He, β = e⁻, β⁺ = e⁺. A nuclide keeps the identity of its symbol
  (²³⁸₉₁U is U-238 with a wrong Z), so one mistake gives one error.
- **Numbers written in the reference must be written** (decided 2026-10-15, second round): the explicit numbers help
  the student check the balance, so when the teacher writes them the student must too - for elements and particles.
  A species written with no numbers at all is `missing-numbers` (α for ⁴₂He, e⁻ for ⁰₋₁e, U for ²³⁸₉₂U). When the
  reference writes no numbers, the student may still write them. Whether a symbol without numbers could be accepted
  against a reference with numbers is left open, for teachers' input.
- **Conservation**: a nuclear species has the composition {"#A": A, "#Z": Z}; the existing balance check then is the
  conservation of mass and atomic numbers (`unbalanced-atom` with atom #A / #Z, shown as "mass numbers / atomic
  numbers are not conserved"), and the existing hiding rules apply.
- **A and Z come together** (decided): no numbers or both. Only one of them is an error of the student's own writing
  (`missing-atomic-number` / `missing-mass-number`). A symbol with no numbers (U) is paired with the reference
  nuclide and reported as `missing-numbers` when the reference writes them.
- **γ omitted** when the reference has it: `missing-species`, an error like any other particle (decided).
- **⇌** is valid writing; the reference decides (`wrong-arrow`) (decided).
- New errors and rubric categories:

  | Code | Category |
  |---|---|
  | `wrong-mass-number`, `missing-mass-number`, `missing-numbers` | `massNumbers` (also hide the species' coefficient error and the balances, like a wrong substance) |
  | `wrong-atomic-number`, `missing-atomic-number` | `atomicNumbers` |
  | `invalid-prescript` (numbers before a symbol that are not A / Z) | syntax |
  | `nuclide-compound` (a nuclide followed by more: ²³⁸₉₂UO, ²³⁸₉₂U¹⁶₈O - each term is one nucleus or particle, no molecules; 2026-10-16) | syntax; the term is read as its first nuclide |

  The builder shows the two new rubric rows only for a nuclear question.
- Not checked in nuclear equations: elements missing / extra in the whole answer (elements change in a nuclear
  reaction).
