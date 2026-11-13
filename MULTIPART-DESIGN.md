# Chemical keyboard: several parts in one STACK question (design, open)

**Read with MULTISTEP-DESIGN.md (2026-10-20)**, the earlier design of the same need: each stage its own single-arrow
equation (the user's decision then), copy / paste between equations (done, COPYPASTE-DESIGN.md), and errors carried
forward (designed, not built: what carries, the order of the checks, step 2 pre-filled). That design recommended one
frame per step (option A here, step 2's frame reading step 1's state input); on 2026-11-02 the user leans to one frame
with all the steps (option B). The grading rule of MULTISTEP-DESIGN.md section 3 applies to either.

Status (2026-11-02): **options discussed, not decided.** The user leans to **option B** (one frame with all the
parts) for chemistry, because it can handle errors carried from one stage to the next. Waiting for chemistry
teachers' requirements (section 6). Math is postponed and will be thought about separately (section 9).
Follow-up the same day (section 8): one keyboard and rubric for all stages; a single equation with stages is not
recommended - separate stage equations with the carried species found automatically.
2026-11-13 (section 10): a worked design on one example - the STACK question, an error in stage 1, and the rule
against a double penalty; five points to decide (10.7).

## 1. The request (2026-11-02)

> "I want to look at the option of having two or more elements in a single question for both math and chemistry, in
> one stack question. In chemistry it can be used if there's a multi stage process where the output of one stage is
> the input of the next stage. For math it could be a table with multiple cells that the student needs to fill in.
> [...] consider the option that the tool handles one element at a time but the stack question combines the code of
> all the parts into one question."

Then: "first I want to think about chemistry and math separately since the common case for these subjects are
different. I postpone Math for now. Will check with chemistry teachers the requirement. [...] I tend to think for
chemistry there's a need to support a single question with multiple parts (option B) to handle errors."

## 2. What STACK allows

A STACK question can have many inputs and several PRTs (potential response trees). One part of today's code
uses two inputs: the score (Numerical) and the state (String); see STACKJS-DESIGN.md. N parts can therefore use N
input pairs (option A), or all parts can share one pair (option B).

## 3. Option A - one frame per part

- Each part is today's code unchanged, with its own input pair (ans1/ans2, ans3/ans4, ...). Combining = joining the
  code blocks with different input names (`cfg.inputs` already exists).
- The teacher writes the question text between the frames in Moodle ("Stage 1: ... [frame] Stage 2: ... [frame]").
- One PRT per part: Moodle shows a mark and feedback per part; interactive mode with several tries works per part.
- Parts of different kinds can be mixed (a chemistry stage, then a math calculation).
- Limits: each frame is a separate sandboxed page - no shared keyboard, the libraries loaded per frame (cached by the
  browser). Frames cannot see each other directly: a stage that depends on another stage's answer needs to read that
  stage's STACK input through STACK-JS (`request_access_to_input` from a second frame) - **not probed yet**.

## 4. Option B - one frame with all the parts (the user's leaning for chemistry)

- One frame shows the stages one after another, with the teacher's text between them, and one keyboard area (the
  docked layout, `layout: "docked"`).
- One input pair: the state holds every part's answer, score and feedback; the score input gets the combined score
  (weights per part). Moodle gives one mark; the breakdown per part is shown in the frame.
- A part can use another part's answer directly (same page) - this is why B suits "the output of one stage is the
  input of the next" (section 5).
- Costs: the text between parts lives in the configuration, not in Moodle's question text (escaping as today:
  \u escapes); a builder level for the parts (section 4.2).

### 4.1 Library sketch (not decided)

```
cfg = { language, review, inputs,
        parts: [ { id: "s1", text: "Stage 1: ...", weight: 1, ...today's part config (correctAnswer, value, rubric, keys...) },
                 { id: "s2", text: "Stage 2: ...", weight: 2, from: { part: "s1", use: "initial" | "grade" }, ... } ] }
state = { v: 3, parts: [ { answer, score, feedback }, ... ], score }
```

- `mountStackJs` / `mount` recognise `cfg.parts`; a config without `parts` is one part, as today (old questions keep
  working).
- Each part: its own answer box; the keys open in the shared dock for the box being edited.
- Combined score: the weighted mean of the parts' scores.

### 4.2 The builder (open)

The builder keeps editing one part at a time with the existing tabs (Keyboard, Checker, Didactics). New: a list of
parts (add, remove, order, text, weight, dependency); choosing a part shows it in the tabs. The exercise file
(`.chemq`) holds all the parts; tab 5 produces one question code. Alternative: a separate combiner page that opens
several `.chemq` files. To decide.

## 5. "The output of one stage is the input of the next" - three meanings

1. **Fixed intermediate:** the teacher knows the correct product of stage 1; every stage is graded against its own
   correct answer. Works in A and B.
2. **Start from the student's product:** stage 2's initial answer is made from the student's stage-1 answer (e.g. the
   product as the reactant). Needs one stage to read another (easy in B).
3. **Error carried forward:** stage 2 is graded against the student's own stage-1 product, so one early mistake does
   not cost every later stage. Needs B (or the probe in A), and a way to grade stage 2 without a fixed reference:
   e.g. stage 2 must use the student's stage-1 product as a reactant and be a valid, balanced equation
   (`validate` + balance), with partial credit set in the rubric. **Open:** how the teacher defines the dependency
   and the credit.

## 6. Questions for the chemistry teachers

1. Typical multi-stage examples (a synthesis route, a sequence of reactions, a calculation chain?) and the usual
   number of stages.
2. Which meaning of section 5 they need: fixed intermediates, starting from the student's own product, or error
   carried forward - and the credit for a stage that is right for a wrong input.
3. Are all stages equations, or also formulas, names, states, conditions?
4. Should a stage appear only after the previous one is answered (or answered correctly), or all at once?
5. Feedback per stage while answering, or only at the end?
6. One mark for the whole question, or a mark per stage in Moodle (this alone would favour A)?
7. (2026-11-02, section 8) Are multi-stage processes written as separate balanced equations, or as one chain? Is a
   by-product left out of the next stage, and should an overall equation be asked too?
8. (section 8.3) A stage that is right for the student's own wrong input: full credit, or a penalty of its own?

## 8. Follow-up (2026-11-02): one keyboard and rubric; one equation with stages?

The user: "it makes sense that for a multi stage process in a chemistry exercise, the keyboard and the rubric will be
the same for all the stages. I would even consider a single equation with multiple stages but the problem is that
not all the products of 1st stage participate in the process of the 2nd stage. Not sure if this is the proper
approach from a pedagogical point of view but I can think of a solution where a product that does not participate in
the next stage will be put inside [ ] so it is evaluated as an output of 1st stage but ignored in the 2nd stage."

### 8.1 One keyboard and one rubric for all the stages - agreed

- Builder: tab 1 (keyboard) and the rubric once; the Checker tab has a **list of stages** instead of one reference
  (each: its text, its correct equation, its weight); Didactics: an initial answer per stage (optional).
- Library: one keyboard configuration, one answer box per stage, the keys in the shared dock.
- Section 4.1's `parts` then carry only what differs per stage: `{ id, text, weight, correctAnswer, value }`.

### 8.2 One equation with stages (`A + B → C + [D] → E`) - not recommended

1. Reactants added in a later stage cannot be told from products of the earlier one (`... → C + [D] + X → E`: is X a
   product of stage 1 or a reactant of stage 2?) - a second marker would be needed.
2. Each stage is balanced on its own, with its own coefficients. The Ostwald process:
   `4NH₃ + 5O₂ → 4NO + 6H₂O`, `2NO + O₂ → 2NO₂`, `3NO₂ + H₂O → 2HNO₃ + NO` - stage 1 makes 4NO, stage 2 uses
   2NO; O₂ and H₂O are added later; H₂O of stage 1 is not carried. One line cannot hold different coefficients for the
   same substance.
3. `[ ]` already has meanings: right after an arrow it holds the reaction conditions in the library (`→[Δ]`, the
   value text and the copy text); chemists also use it for complex ions and concentrations.
4. Pedagogy (to check with the teachers): multi-stage processes are written as separate balanced equations; a chain
   `A → B → C` belongs mainly to organic synthesis routes - not balanced, side products usually left out. That may be
   a separate question kind, if the teachers need it.

### 8.3 The proposal: separate stage equations, the carried species found automatically

- The student writes each stage as a full equation and simply leaves by-products out of the next stage (as chemists
  write it) - nothing to mark.
- **Carried species:** a reactant of stage k that is a product of stage k-1 (of the student's answer, and of the
  reference) came from the previous stage.
- **Error carried forward:** stage k is graded against its own reference, but a carried reactant that is wrong
  compared with the reference and equals the student's own (wrong) product of stage k-1 is not penalised again - a
  mistake costs once, where it was made. Its balancing is still checked with the student's species.
- **Optional overall equation:** the sum of the stages with the intermediates cancelled - the checker can derive it
  from the stage answers (a last stage, or a check only).
- Open: the credit when the carried species is wrong (full, or a rubric category of its own); several products
  carried at once; a species carried from two stages back.

### 8.4 Copy one substance, or paste the side and erase? (2026-11-02)

The user: "so maybe the missing functionality is easy copy paste of elements from one equation to the other.
Currently it is possible to copy the whole products side (as well as the reactants or the whole equation). Need to
look at real life examples and see if there's a need to copy a molecule from the products part, or the student can
erase the parts that are not required."

Examples (to check with the teachers):

| Process | Stages | Carried into the next stage |
|---|---|---|
| Ostwald | 4NH₃+5O₂→4NO+6H₂O · 2NO+O₂→2NO₂ · 3NO₂+H₂O→2HNO₃+NO | one product of two; coefficient changes (4→2); O₂, H₂O added |
| Contact process | S+O₂→SO₂ · 2SO₂+O₂→2SO₃ · SO₃+H₂O→H₂SO₄ | the only product; coefficient changes; a new reactant each stage |
| Blast furnace | C+O₂→CO₂ · CO₂+C→2CO · Fe₂O₃+3CO→2Fe+3CO₂ | the only product, then a coefficient (3CO) |
| Organic sequence | C₂H₄+H₂O→C₂H₅OH · C₂H₅OH →(oxidation) CH₃COOH | the main product; a by-product dropped |
| Lead(II) nitrate | 2Pb(NO₃)₂ →(Δ) 2PbO+4NO₂+O₂ · 4NO₂+O₂+2H₂O→4HNO₃ | 2 of 3 products, same coefficients; H₂O added |
| Marble + HCl | CaCO₃+2HCl→CaCl₂+H₂O+CO₂ · CO₂+H₂O→H₂CO₃ | 2 of 3 products (CaCl₂ left) |
| Cu + conc. HNO₃ | Cu+4HNO₃→Cu(NO₃)₂+2NO₂+2H₂O · 3NO₂+H₂O→2HNO₃+NO | 2 of 3 products, coefficients change |
| Cu + conc. H₂SO₄ | Cu+2H₂SO₄→CuSO₄+SO₂+2H₂O · SO₂+H₂O→H₂SO₃ | 2 of 3 products |
| Ammonium carbonate → urea | (NH₄)₂CO₃→2NH₃+CO₂+H₂O · 2NH₃+CO₂→CO(NH₂)₂+H₂O | 2 of 3 products (H₂O left) |

Stage 1 with three products, two of them used in stage 2 (the user asked, 2026-11-02): with the same coefficients
(lead nitrate) copying the products side and erasing one substance is quicker; with new coefficients (Cu + HNO₃)
copying single products (no coefficient) is quicker - both are in the menu.

- In almost every case the carried substance gets a **new coefficient** and new co-reactants. With one product,
  pasting the products side and editing is easy; with by-products (Ostwald, organic) the student erases a substance
  and its coefficient - a few key presses.
- Cheap improvement if needed: the ⧉ menu also lists **each substance** of the answer ("Products: 4NO + 6H₂O" →
  "NO", "H₂O"), copied as formula + state **without the coefficient**. No selection needed (the selection of
  COPYPASTE-DESIGN.md section 4 stays not done).
- The user (2026-11-02): "the cheap improvement makes a lot of sense if the teacher chooses a multistage question" -
  **implemented, library 3.6.0**: `multistage: true` (builder: "A stage of a multi-stage process", under copy and
  paste); details in COPYPASTE-DESIGN.md. The future multi-stage question turns it on by itself.

## 10. Worked design (2026-11-13): two products carried, an error in stage 1, no double penalty

The user: "find an example where the first stage creates 2 or more products. The second stage takes some of those
products and uses them as input. Design how it will work in a STACK question, how to deal with an error in the first
stage, and how to define the rubric so there's no double penalty." **Design only - nothing is built.**

### 10.1 The example: lead(II) nitrate, then nitric acid

| Stage | Reference | |
|---|---|---|
| 1 | `2Pb(NO₃)₂(s) →[Δ] 2PbO(s) + 4NO₂(g) + O₂(g)` | three products |
| 2 | `4NO₂(g) + O₂(g) + 2H₂O(l) → 4HNO₃(aq)` | uses two of them (NO₂, O₂); PbO is left; H₂O is new |

Chosen because one question shows every case: a product that is not carried (PbO), two that are (NO₂, O₂), a new
reactant (H₂O), and a realistic stage-1 mistake that still gives a balanced stage 2 (NO for NO₂:
`4NO + 3O₂ + 2H₂O → 4HNO₃`). To check with the teachers that it fits the curriculum; the table of 8.4 has others
(Cu + conc. HNO₃: coefficients change; marble + HCl: simpler).

### 10.2 The STACK question (option B, one frame)

- **Question text:** the teacher's introduction, then the builder's code - one frame. In the frame: "Stage 1" text and
  answer box, "Stage 2" text and answer box, one keyboard dock for the box being edited (8.1). The ⧉ menu of stage 2
  lists the student's stage-1 products one by one, without coefficients (`multistage`, built in 3.6.0).
- **Inputs, as today:** ans1 = the score of the whole question (Numerical), ans2 = the state (String):
  `{ v: 3, parts: [ { answer, score, feedback }, { answer, score, feedback } ], score }`.
  Total = the weighted mean of the stage scores (weights in the builder, default equal).
- **PRT, as today:** one node, `AlgEquiv(ans1, 1)`, false branch score `ans1`.
- **A mark per stage in Moodle - decided no (10.7):** the frame could also fill one more score input per stage (ans3, ans4), each
  with its own one-node PRT. Then Moodle shows a mark per stage, and the frame still grades the stages together.
  Only if the teachers want it (question 6 of section 6).
- **Every change regrades all the stages:** stage 2's score depends on stage 1's answer, so a later correction of
  stage 1 changes stage 2's score too. Both are in one frame, so this is one function call.
- **Review page:** per stage - the evaluation (grade, feedback), the marked answer, the marked reference - then the
  total. A carried-forward note names the stage-1 mistake (10.4).

### 10.3 What "carried" means (found by the system, nothing for the teacher to mark)

- **Carried species:** a reactant of the reference's stage 2 that is a product of the reference's stage 1. Here NO₂
  and O₂. PbO is not carried; H₂O is not carried (new in stage 2).
- **Coefficients are never carried:** each stage is balanced by itself (4NO₂ in both stages here is a coincidence;
  in Cu + HNO₃ it is 2NO₂ then 3NO₂).

### 10.4 The rule against a double penalty

**One rule: what the student writes about a carried species in stage 2 exactly as in their own stage 1, and that was
already an error in stage 1, is not counted again in stage 2.** It covers a wrong formula, a wrong state and a wrong
charge. It is a hiding rule of the system, like those of RUBRIC-DESIGN.md (`SUPPRESSION_RULES`): **the rubric stays
one rubric for all the stages, with no new row and no teacher setting.** The error stays in the feedback of stage 2,
shown as "not counted - this continues your stage 1; the mistake was counted there", and the species is not marked red.

Stage 2 is graded in this order:

1. **Equal to the reference:** 100%.
2. **An alternative the teacher anticipated** (the common-mistakes list of tab 3, per stage): "stage 2 written as
   `4NO + 3O₂ + 2H₂O → 4HNO₃`" with its score and feedback. Optional; for the mistakes the teacher wants to word.
3. **Otherwise, against the reference, with the carried rule:**
   - a. An error on a carried species that repeats the student's stage 1 (wrong formula / state / charge): not counted.
   - b. A carried species that the student left out of stage 1 and also out of stage 2: not counted (it was a
     missing substance in stage 1).
   - c. When a or b applies to a formula, the reference's coefficients no longer fit the student's substances, so
     **the coefficients are not compared with the reference; the student's own equation must be balanced.** An
     unbalanced atom then costs the `balance` row (decided 2026-11-13, 10.7 point 2).
   - d. Everything else is graded as today: the new reactant (H₂O), the products (HNO₃), states, arrow, conditions.
4. **Stage 1 wrong but stage 2 written with the correct species** (the student did not continue their own answer):
   graded as today - full marks if it equals the reference - with a note. No penalty (MULTISTEP question 3).
5. **Stage 1 empty or with a syntax error:** nothing is carried; stage 2 is graded as today.

### 10.5 The example, graded (the builder's default rubric: substances 25, coefficients 10 each, states 5 each)

| # | Stage 1 | Stage 2 | Stage 1 | Stage 2 today | Stage 2 with the rule |
|---|---|---|---|---|---|
| A | `Pb` for `PbO` (not carried) | correct | 75 | 100 | 100 |
| B | `4NO + 3O₂` for `4NO₂ + O₂` | `4NO + 3O₂ + 2H₂O → 4HNO₃` (own NO, balanced) | 65 | 65 | **100** + note |
| C | `4NO + O₂` (NO, unbalanced) | `4NO + O₂ + 2H₂O → 4HNO₃` (own NO, unbalanced) | 75 | 75 | **90** (balance) |
| D | `4NO + 3O₂` | `4NO₂ + O₂ + 2H₂O → 4HNO₃` (the correct one) | 65 | 100 | 100 + note |
| E | correct | `4NO + 3O₂ + 2H₂O → 4HNO₃` | 100 | 65 | 65 (a new mistake) |
| F | `NO₂(aq)` for `NO₂(g)` | `NO₂(aq)` again | 95 | 95 | **100** + note |
| G | a wrong coefficient | correct | 90 | 100 | 100 (coefficients are not carried) |
| H | `O₂` left out | `4NO₂ + 2H₂O → ...` (no O₂, as in stage 1) | 75 | 75 | **90**: missing O₂ not counted; own balance checked (unbalanced O) |

**The table is as first written. After the decisions of 10.7 (default rubric with `balance: 10`):** row B's stage 1 and
stage 2 "today" are 75; rows C and H's stage 1 and stage 2 "today" are 65 (substance 25 + balance 10); with the rule
their stage 2 stays 90.

"Today" = each stage graded alone with library 3.8.0 (run on 2026-11-13). Without the rule, student B loses 35 points
twice for one mistake.

**Found while grading the example (today's library, one stage):** the student of row B who balanced their own wrong
equation gets 65, and the student of row C who did not gets 75 - the wrong substance hides the unbalanced atom, but
not the coefficient that differs from the reference. To fix with rule 3c also inside one stage: a wrong coefficient
next to a wrong substance is not counted when the student's own equation is balanced.

### 10.6 What it needs in the library and the builder

- Library: `cfg.parts` (section 4.1) with the shared keyboard and rubric (8.1); `compare` gets the previous stage's
  comparison (`options.previous = { student, reference }`) and applies rule 10.4 as a suppression step in
  `gradeComparison`; a note code `carried-forward`; the combined score and state `v: 3`.
- Builder: the Checker tab's list of stages (8.1) with a weight each; the student-answer test of tab 2 with one box
  per stage, so the teacher can try rows A-H; tab 5's help: the same two inputs and PRT (plus the optional input per
  stage).

### 10.7 Decided by the user (2026-11-13)

1. **Full marks** for a stage 2 that consistently continues a wrong stage 1 (rows B, F), **plus an option in the
   rubric** that lets the teacher penalize this case: a rubric row `carriedForward` (shown only in a multi-stage
   question; default 0 = no penalty; a number = that penalty once per stage, whatever the number of carried
   mistakes). The row replaces the hidden errors' penalties - it is never added to them.
2. **Fix the 65 / 75 finding inside one stage - done, library 3.8.0:** with a wrong substance and the student's own
   equation balanced, a coefficient that differs from the reference is not counted (`gradeComparison`; test in
   chemTests.js, group "Grade"). Row B's stage 1 and its stage 2 "today" are now 75, like row C.
   **Then decided: the one-stage behaviour was too loose.** "The purpose of the system is to teach, to establish good
   practices; balancing is a basic skill" - an unbalanced equation with a wrong substance is penalized for the balance
   **in addition to** the substance. Done in library 3.8.0: a wrong / missing / extra substance no longer hides
   `unbalanced-atom` (except the mass / atomic numbers of a nuclear equation); the default rubric got `balance: 10`.
   Row C's stage 1 is now 65, row B's 75 - balancing is rewarded. So in stage 2 the strict design stands: row C = 90.
3. **Decided: one mistake, one penalty.** The same wrong formula for the same reference substance in both stages is
   counted in stage 1 only, also when the substance is not carried. So the rule of 10.4 is about **any substance of
   the reference that appears in both stages**, not only a product of stage 1 used as a reactant of stage 2 (10.3's
   "carried" is widened to this). The case: a substance that is not carried (not a product of stage 1 used as a
   reactant of stage 2) but appears in both stages. Cu + conc. HNO₃: `Cu + 4HNO₃ → Cu(NO₃)₂ + 2NO₂ + 2H₂O`, then
   `3NO₂ + H₂O → 2HNO₃ + NO` - HNO₃ is a reactant of stage 1 and a product of stage 2. A student who writes HNO₂ in
   both stages: one mistake (counted in stage 1 only), or two?
4. **One mark:** only ans1 and ans2, no score input per stage. The stage marks are shown in the frame.
5. **Look back one stage only.**

## 9. Math (postponed)

The common math case is different: a table with many cells to fill (see FullKBD/tableExerciseDemo.html - one
keyboard per cell, the keys in one dock under the table). One frame per cell (A) would be too heavy, so a table
needs one frame (B-like) with a table layout editor. To be thought about separately, later.
