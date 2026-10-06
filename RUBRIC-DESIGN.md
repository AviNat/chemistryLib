# Chemical keyboard: grading with a teacher rubric (design)

Status: **design phase**, nothing implemented yet. Decided on 2026-10-06. Base: `chemical-keyboard-v4.js`.

## 1. Goal

Add a grading function that turns the errors found by `compareChemicalAnswers` into a score, using a
**rubric defined by the teacher per exercise**. Grading is tied to the existing error checking and error
marking: it does not find errors itself, it decides which errors count and how much.

## 2. Current code (what grading builds on)

- `compareChemicalAnswers(student, reference, language, options)` returns
  `{ correct, errors, notes, studentCanonical, referenceCanonical, reversed, language }`.
- Each error is `{ code, …details (species, atom, expected, actual…), studentRanges, referenceRanges, description }`.
- All checks run **independently**; there is no suppression of follow-on errors today.
  E.g. one wrong coefficient produces `wrong-coefficient` **and** an `unbalanced-atom` for every atom of that substance.
- Notation notes (`redundant-subscript-one`, `repeated-species`, …) are returned separately in `notes`
  and never affect `correct`.
- Exported as `ChemicalGrammar.compare`, `feedbackHighlights`, `feedbackText`, `renderComparison`.

## 3. Rubric format (what the teacher writes)

```js
rubric: {
    answerType:         100,                       // wrong answer type (see 5)
    unknownElement:     50,                        // a symbol that is not a chemical element
    substances:         25,                        // once
    coefficients:       { each: 10, max: 20 },     // per wrong coefficient, capped
    scaledCoefficients: 15,                        // balanced, but all coefficients a multiple of the reference (see 5)
    states:             { each: 5, max: 15, allMissing: 20 },
    charges:            { each: 10, max: 20 },
    arrow:              10,
    conditions:         5
}
```

- **The rubric is a configuration element**, given as its own parameter (`rubric`) of the keyboard configuration.
  **If it is missing, no grading is done**; error checking and feedback work as today.
- A teacher tool for defining the rubric would help later; that is a separate component.

| Teacher writes | Meaning |
|---|---|
| `arrow: 10` | 10% once, however many times the error occurs |
| `coefficients: { each: 10, max: 20 }` | 10% per error, at most 20%. Without `max`, no cap |
| `states: { …, allMissing: 20 }` | if states are missing on **every** substance, a flat 20% replaces the per-error count |

- **A category not mentioned in the rubric has no penalty.** Teachers define the issues they care about per exercise.
- Penalties are percent of the question's score. Score = 100 − total penalty, never below 0.
- Optional override per error code, for rare needs: `codes: { "wrong-structure": 15 }`.

## 4. Categories (grouping the checker's error codes)

| Category | Error codes |
|---|---|
| `answerType` | `wrong-answer-type` |
| `unknownElement` | `unknown-element` |
| `substances` | `missing-species`, `unexpected-species`, `wrong-atom-count`, `wrong-structure`, `missing-structure`, `wrong-dot-parts`, `unexpected-atom`, `missing-atom` |
| `coefficients` | `wrong-coefficient` (also a missing coefficient, i.e. 1 instead of n) |
| `scaledCoefficients` | **new code** `scaled-coefficients`: the equation is balanced, the substances are right, but all coefficients are the same whole-number multiple of the reference (`4H₂ + 2O₂ → 4H₂O` for `2H₂ + O₂ → 2H₂O`). Reported as **one** error; it's a different misunderstanding from a wrong coefficient |
| `balance` | `unbalanced-atom`, counted only when not explained by a substance or coefficient error (see 5) |
| `states` | `missing-state`, `wrong-state`, `unexpected-state` |
| `charges` | `missing-charge`, `wrong-charge`, `unexpected-charge` |
| `arrow` | `wrong-arrow` |
| `conditions` | `missing-condition`, `wrong-condition` |
| `notation` | notes: `redundant-subscript-one`, `redundant-charge-one`, `repeated-species`, `different-form`, `missing-dot`, `condition-not-required` |
| (not gradable) | `syntax-error`: the answer can't be analyzed. **Score 0**, fixed by the system, not in the rubric |

## 5. Hierarchy (system logic, not teacher configuration)

The hierarchy is part of the system, not the rubric:
- it's chemistry logic, the same for every question, not teaching policy
- it keeps the rubric simple
- the same answer gets the same grade in every question

Rule: **one mistake = one penalty.** A counted error hides the errors it causes.

| If this is counted… | …these are not counted |
|---|---|
| `wrong-answer-type` | everything else; grading stops (comparing an expression with an equation is meaningless). Score = 100 − the teacher's `answerType` penalty |
| wrong / missing / unexpected **substance** | `unbalanced-atom` for the atoms of that substance; coefficient, state and charge errors of that substance; `missing-atom` / `unexpected-atom` explained by the missing or extra substance |
| `wrong-coefficient` of a substance (including a missing coefficient) | `unbalanced-atom` for **all atoms of that substance**. One wrong coefficient is one error, however many atoms it unbalances |
| `scaled-coefficients` | all the individual `wrong-coefficient` errors (one error for the whole equation) |
| states missing on every substance (`allMissing` in the rubric) | the individual `missing-state` errors |

- `unbalanced-atom` is counted only when no substance or coefficient error explains it.
- Keep these rules as a **data table** in the code, so they can be adjusted without touching the logic.
- A "count all errors" switch for teachers is not planned; add it only if someone asks.

## 6. Output: marking the existing error objects

Grading adds fields to the existing errors instead of producing a separate list:

```js
errors: [
  { id: 1, code: "wrong-coefficient", species: "H₂O", …, category: "coefficients", counted: true },
  { id: 2, code: "unbalanced-atom", atom: "H", …, category: "balance", counted: false, suppressedBy: 1 },
  { id: 3, code: "unbalanced-atom", atom: "O", …, category: "balance", counted: false, suppressedBy: 1 },
  { id: 4, code: "missing-state", species: "H₂", …, category: "states", counted: true },
  { id: 5, code: "missing-state", species: "O₂", …, category: "states", counted: true }
],
score: {
  total: 80,
  penalties: [
    { category: "coefficients", penalty: 10, errorIds: [1] },
    { category: "states", penalty: 10, errorIds: [4, 5] }     // { each: 5 } × 2
  ]
}
```

- **A penalty is written once, even when it covers several errors.** `score.penalties` has one line per category that
  costs points, with the ids of the errors it covers. Errors only say whether they were `counted`.
  - `arrow: 10` (once) with 2 arrow errors → one line, −10%, both errors listed under it.
  - `{ each: 5, max: 15 }` with 4 errors → one line, −15% (capped), 4 errors listed.
  - `allMissing: 20` → one line, −20%, all the missing-state errors listed.
- The feedback shows each penalty line once, with its errors under it; a suppressed error is shown under the error
  that caused it (or hidden).

- Every error gets an `id`. A suppressed error's `suppressedBy` holds the **id of the specific error** that caused it,
  so the feedback can say "not counted, caused by the wrong coefficient of H₂O" and highlighting can link the two.
- Without a rubric, errors keep their current shape (no `counted` / `suppressedBy`) and there is no `score`.

- Feedback can show each error with its deduction, and show suppressed errors greyed out
  ("not counted, caused by the wrong coefficient of H₂O"), or hide them.
- Highlighting uses the same objects, so it's easy to highlight only the counted errors.
- An error whose category isn't in the rubric is still reported as feedback, with `penalty: 0` (no `suppressedBy`).

## 7. Decided (2026-10-06, second round)

- `unknown-element` is a rubric category (`unknownElement`), set by the teacher.
- Balanced with all coefficients a multiple of the reference is its own error type (`scaled-coefficients`, rubric
  category `scaledCoefficients`), counted once, hiding the individual `wrong-coefficient` errors.
- `suppressedBy` points to the id of the specific error that caused the suppression.
- The rubric is a separate configuration parameter; without it, no grading. A teacher tool to define it is a separate, later component.

## 8. Decided (third round)

- `syntax-error` → score 0, fixed by the system.
- Fractional coefficients count as `wrong-coefficient`, not `scaled-coefficients`. (The keyboard currently has no way
  to enter a fraction coefficient anyway.)
- A penalty that covers several errors is written once (`score.penalties`, see 6).

No open questions remain; next step is implementation.
