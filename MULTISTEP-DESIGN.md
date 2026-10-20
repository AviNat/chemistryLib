# Chemical keyboard: a sequence of equations - errors carried forward (design)

Status: **design, 2026-10-20 - not implemented.** Decided by the user: each transformation is its own single-arrow
equation (A → B, then B → C), not one equation with several arrows. Two needs: (1) simple copy / paste of B from the
first equation to the second - **implemented** (library 3.2.0, COPYPASTE-DESIGN.md); (2) grading and feedback of a
later step that take a mistake of an earlier step into account - this document.

## 1. The problem

Reference: step 1 `A → B`, step 2 `B → C`. A student writes step 1 `A → B'` (B' wrong) and then step 2. Graded
alone, step 2 is either "correct by itself" (the student wrote `B → C`) or "wrong" (the student continued from B' and
wrote `B' → C'`) - but neither verdict is fair without step 1:

| Step 1 | Step 2 written | Graded alone | Fair ("one mistake = one penalty", the bagrut's טעות גוררת) |
|---|---|---|---|
| correct (B) | `B → C` | correct | correct |
| wrong (B') | `B' → C'` - continues the student's own B' | wrong substances | the B' mistake was counted in step 1: step 2 should not lose it again |
| wrong (B') | `B → C` - the correct B, not the student's own | correct | correct by itself, but does not follow the student's step 1 (question 3) |
| wrong (B') | something else | wrong | wrong, as now |

## 2. Where the steps live

**Recommended: one STACK question with one keyboard per step** (step 1 inputs ans1 / ans2, step 2 ans3 / ans4; each
keyboard its own frame). Step 2's frame reads step 1's saved answer live through `request_access_to_input("ans2",
true, true)` - the same question, so it is always found, and it follows changes while the student works. One PRT per
step gives a mark per step.

Not recommended: two separate questions. A frame can reach another question's input only with `limittoquestion =
false` (the first input of that name on the page - both questions use ans1 / ans2), and not at all when the quiz puts
them on different pages.

## 3. Grading a later step

The teacher marks in the builder **what carries forward**: by default the products of step 1 are the starting
substances of step 2; or chosen substances only (B, without a by-product such as H₂O).

Step 2 is then compared in this order:

1. **Step 1 correct** (its carried substances equal the reference's): step 2 is graded as today.
2. **Step 1 wrong, step 2 starts from the student's own B'** (carried forward): the starting side is accepted - its
   mistake was counted in step 1 - with the note "This step continues your step 1 (B'); that mistake was counted
   there." The rest of step 2 (question 2):
   - checked against **alternatives the teacher anticipated**: "if B was written as X, step 2 is X → Y" (the common
     mistakes; any number), and if none fits
   - checked for what does not depend on B: the writing, the balance of the student's own equation, the states, the
     arrow, the conditions; the new product is compared with the reference's C.
3. **Step 1 wrong, step 2 starts from the correct B**: graded as today, plus a note that it does not continue the
   student's step 1 (question 3 - with or without a penalty).
4. **Anything else**: graded as today.

The marking and the review follow the same rule: a carried substance is not marked red in step 2.

## 4. Builder and library

- Builder: a "Steps" section - add a step, each with its reference answer (and its own rubric if wanted); "starts
  from": the products of the previous step / chosen substances; anticipated alternatives (a list of pairs). The code:
  one question text with a frame per step and its input pair; the PRT instructions per step (the "?" window).
- Library: `cfg.steps` (the steps' references), `cfg.step` (which one this frame is), `cfg.carry`; the frame of step
  n > 1 reads the state input of step n − 1 and grades with the rule of section 3; a new note code `carried-forward`
  and a match type for "the student's own previous product". Optional: start step n already filled with the carried
  substances and an arrow (question 5) - then carrying forward cannot go wrong.

## 5. Questions for the decision

1. **One question with steps** (recommended), or separate questions?
2. **Step 1 wrong, step 2 continues from the wrong B'**: the starting side is not penalized - agreed? And the rest of
   step 2: (a) the teacher's anticipated alternatives, (b) the writing / balance / states / arrow and the product
   against C (recommended: a, then b), or (c) only "consistent with step 1", no further check?
3. **Step 1 wrong, step 2 starts from the correct B** (the "correct by itself" case): full marks (recommended, with a
   note), or a penalty for not following step 1?
4. **What carries forward**: all the products of step 1, or the substances the teacher marks (recommended: the
   teacher marks; default all)?
5. **Step 2 pre-filled** with the carried substances and the arrow (the student writes only the rest), or the student
   writes it all (copy / paste helps)?
