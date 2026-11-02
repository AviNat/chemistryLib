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

## 9. Math (postponed)

The common math case is different: a table with many cells to fill (see FullKBD/tableExerciseDemo.html - one
keyboard per cell, the keys in one dock under the table). One frame per cell (A) would be too heavy, so a table
needs one frame (B-like) with a table layout editor. To be thought about separately, later.
