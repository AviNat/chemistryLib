# Chemical keyboard: fatty acids and triglycerides (design)

Status: **implemented 2026-10-16** (library 2.8.0, builder snippet 2026-10-16.5); all questions answered by the user
from the bagrut rules (section 5b). Requested by the user (high-school level: the structure of fatty acids and
triglycerides, not lipidomics).

## 5b. Decided (2026-10-16, bagrut rules) and implemented

- Several double bonds: only the first ω position and one `cis` (`C18:2(ω6)cis`); Δ and `cis,cis` are not accepted.
- The answer must be in the reference's format; another format -> `wrong-lipid-format`, score 0 (fatal, like a wrong
  answer type), message "requires shorthand notation (e.g. C16:0), not a condensed structural formula".
- A fatty acid is graded in three independent parts, each a rubric category: `lipidCarbons` (X), `lipidDoubleBonds`
  (Y), `lipidOmega` (ω position + cis/trans); builder defaults 33 / 33 / 34 once each, so C16:1(ω9)cis for
  C18:1(ω9)cis scores 67. Carbons wrong with the ω position right -> the combined message ("ω right, carbon count
  wrong - check the length of the acid").
- Also: `lipidStructure` (condensed formula: COOH / CH₃ ends, hydrogens per carbon), `lipidFattyAcids` (triglyceride:
  missing / extra / not three), `lipidNotation` (letter case).
- Implementation: `parseLipid` / `parseShorthand` / `parseCondensed` / `compareLipidAnswers` in the library, used when
  `options.lipids` (config `lipids`) or the reference is a shorthand / TG; the parsed answer keeps its plain `text`.
  Keyboard (`config.lipids`): keys `:` ω cis trans = `TG( )`, the comma between fatty acids, group keys COOH CH₃ CH₂
  CH=CH and the elements C H O by default, states and condition keys hidden; a digit after a C that starts a term or
  after ω / w stays at the normal level (also when a plain-text answer is read, `modelFromValue`); physical keys
  `: , = - ( )` and lowercase letters accepted. Builder: option "Fatty acids / triglycerides", six rubric rows shown
  only with it. Tests: group "Lipids" in chemTests.js (30 cases); 182 / 182 pass.
- Not in this version: ester / group formulas of triglycerides (needs several reference answers).
- **Parentheses with a place to type** (2026-10-17, library 2.8.2, the user; all question types): the key `(▢)`
  (and `TG(▢)`) inserts a pair with the cursor inside; an empty pair is drawn with a dashed box, like the formula
  state; → leaves it. DEL in an empty pair removes both; DEL right after its ")" goes inside. A physical "(" opens a
  pair and ")" steps over its closing parenthesis. A state (aq) is not affected.
- **cis / trans are one unit** (2026-10-17, library 2.8.1, the user): DEL removes the whole word and the arrows jump
  over it, like a two-letter element symbol (`markElements` groups them as kind "word" in a fatty-acid question - also
  when typed letter by letter or read back from a saved answer).

## 1. The three writing formats

| Format | Example (bagrut) | What the system extracts |
|---|---|---|
| Shorthand of a fatty acid | `C18:1(ω9)cis`, `C18:0`, also `C18:1ω9cis` (no parentheses) | X = 18 carbons, Y = 1 double bond, Z = 9 (ω position), configuration cis / trans |
| Condensed structural formula | `CH3(CH2)7CH=CH(CH2)7COOH` | terminal methyl CH₃, methylene groups CH₂, double bond CH=CH, carboxyl COOH -> X, Y, the positions of the double bonds |
| Shorthand of a triglyceride | `TG(C16:0, C18:1ω9cis, C18:0)` | a triglyceride of three fatty acids, each as in the first row |

Probe of the current grammar (2026-10-16): a saturated condensed formula already parses (CH₃(CH₂)₁₆COOH ->
C₁₈H₃₆O₂); `=` is a syntax error (the atom count is still right); the shorthand is not understood at all.

## 2. Approach

A **question type** like the nuclear equation: `config.lipids: true` (builder: "Fatty acids / triglycerides").
- The **format of the answer is decided by its shape**, not by an option: starts with `TG(` -> triglyceride;
  contains `:` after `C` and a number -> shorthand; otherwise a condensed structural formula. The reference answer
  decides which format is expected.
- A new parser for the shorthand and the TG list (small, own grammar); the condensed formula uses the existing
  formula parser plus the bond symbol `=` and a **chain analysis** (below).
- Comparison builds a **description of the fatty acid** - carbons, double bonds and their positions (ω numbering:
  from the CH₃ end), cis / trans when written - and compares descriptions; errors per property (section 4).

### Shorthand rules
- `C` + X + `:` + Y; then optionally the ω position `(ω Z)` / `ωZ` / `w Z` (w accepted as ω, as requested), then
  optionally `cis` / `trans`.
- Checks: Y ≤ (X - 1) / 2 roughly (a chain of X carbons has at most X - 1 C-C bonds; a C=C needs 2 carbons);
  Y = 0 -> no ω and no cis / trans; Y ≥ 1 -> ω position 1 ≤ Z ≤ X - 2 (the carboxyl carbon is not part of it).
- Missing ω or cis/trans when the reference has them: errors `missing-omega`, `missing-configuration`.

### Condensed structural formula: chain analysis
The formula is read as a chain of units from the CH₃ end: `CH3`, `CH2` (or `(CH2)n`), `CH=CH` (also `CH=` and
`=CH` as parts), `COOH`. The analysis checks:
- it starts with CH₃ and ends with COOH (`missing-carboxyl`, `missing-methyl-end`);
- every carbon has four bonds: CH₂ between single bonds, CH on a double bond (`wrong-hydrogens`, e.g.
  `CH2=CH` inside the chain);
- X = number of carbons, Y = number of `=`, and the position of every double bond from the CH₃ end
  (CH₃ is ω1; in oleic acid CH₃(CH₂)₇CH=… the first double-bond carbon is ω9).
- Written differently but the same chain - `CH3CH2CH2…` instead of `CH3(CH2)2…`, `(CH2)1` - is the same molecule
  (a note, as `different-form` today).
- cis / trans cannot be seen in a condensed formula: not compared in this format.

### Triglyceride
`TG(` + three fatty acids in shorthand separated by commas + `)`. Compared as three fatty acids (each with the errors
of section 4), paired best-to-best like substances today; `missing-fatty-acid` / `extra-fatty-acid`; not three ->
`wrong-fatty-acid-count`.

## 3. Keys (lipid question)

- Letters: C, H, O; ω (and w accepted as ω). Element panel otherwise optional.
- Group keys (the existing molecule keys - each types its characters): COOH, CH₃, CH₂, CH=CH.
- Punctuation: `:`, `( )`, `,`, `=` (bond).
- Configuration keys: `cis`, `trans` (each inserted as one word, not letters to edit).
- `TG` key (one unit), opening `TG(`.
- Automatic subscript in the condensed formula (H then 2 -> H₂) as today. **But in the shorthand the numbers are
  normal**: C18:1, not C₁₈:₁ - the keyboard must not make 18 a subscript after C when a `:` follows (see Q1).

## 4. Errors and rubric (proposal)

| Code | When | Rubric category |
|---|---|---|
| `wrong-carbon-count` | X differs | `carbons` |
| `wrong-double-bond-count` | Y differs | `doubleBonds` |
| `wrong-omega-position` / `missing-omega` | Z differs / missing | `omega` |
| `wrong-configuration` / `missing-configuration` | cis / trans | `configuration` |
| `wrong-double-bond-position` | condensed formula: a double bond elsewhere | `omega` |
| `missing-carboxyl`, `missing-methyl-end`, `wrong-hydrogens` | condensed formula structure | `structure` |
| `missing-fatty-acid`, `extra-fatty-acid`, `wrong-fatty-acid-count` | triglyceride | `fattyAcids` |
| `wrong-format` | the answer is in another format than the reference (see Q4) | `answerType` |

Hiding rules ("one mistake = one penalty"): a wrong carbon count does not also cost the ω position when the double
bond is at the same place counted from the carboxyl end? - to be decided with Q5; a wrong double-bond count hides
`missing-omega`.

## 5a. Decided (2026-10-16, the user's material)

- **Subscripts follow the question type (Q1):** in a lipid question the keyboard handles subscripts by the format.
  Proposed rule while typing: a digit directly after `C` at the start of a term, after `:` or after ω/w is normal
  (C18:1, ω9); after `H` or `)` it is a subscript (CH₃, (CH₂)₇). Analysis reads the shorthand numbers whether
  normal or subscript.
- **Shorthand equivalences (full match):** ω = w; parentheses around the ω part optional (`C18:1(ω9)cis` =
  `C18:1ω9cis`); the order of the ω part and cis/trans free (`C18:1cis(ω9)`).
- **Saturated acid:** `C16:0` with ω or cis/trans (`C16:0(ω3)cis`, `C16:0(ω0)`) is an error, with the message
  "a saturated acid (0 double bonds) has no double bonds, so ω and cis/trans have no meaning".
- **Unsaturated without ω / configuration** (`C18:1`): "you forgot the position of the double bond (ω) and its
  configuration (cis/trans)".
- **Letter case:** `C` capital, `cis`/`trans` small (`c18:1(W9)Cis` -> a specific message). The keyboard itself cannot
  produce these (the keys insert the right case); the message matters for answers typed or pasted as text.
- **Academic notation** `TG 54:3` -> "in high-school chemistry a triglyceride is written with its three fatty acids,
  e.g. TG(C16:0, C16:0, C16:0)".
- **Condensed formula equivalences:** written from either end (`HOOC(CH2)14CH3` = `CH3(CH2)14COOH`; HOOC read as
  COOH); CH₂ groups grouped or written out (`CH3(CH2)6CH2CH=CHCH2(CH2)6COOH` = oleic acid) - compared by the chain
  (counts of CH₂ before / between / after the double bonds), not by text. `CH-CH` (single bond) where the reference has
  `CH=CH` is a chemical error (a saturated chain); `CH==CH` is a syntax error.
- **Saturated written for unsaturated:** e.g. `CH3(CH2)14COOH` for oleic acid -> the message names both problems: the
  carbon count (that formula has 14 + 1 + 1 = **16** carbons, not 18 - the example in the material says 18) and the
  missing double bond.
- **Triglyceride (Q3):** the order of the fatty acids does not matter (glycerol treated as symmetric) - compared as
  a set.
- **Ester / group formulas of triglycerides** (`CH2(O-CO-R1)-CH(O-CO-R2)-CH2(O-CO-R3)`, `E-C15H31`): too varied to
  normalize; the material recommends **several reference answers per question**. That is a separate feature (more
  than one correct answer - already open in QUESTION-BUILDER.md); not in the first version.

## 5. Questions

- ~~Q1~~ answered (5a). ~~Q3~~ answered: order does not matter. ~~Q7~~ answered: `TG(...)`; `TG 54:3` gets a message.
- **Q2** More than one double bond: written as `C18:2(ω6)cis` (only the first position from the ω end, one cis/trans
  for all)? Or `cis,cis`, or the Δ notation (Δ9,12 from the carboxyl end)? Which do your exams use?
- **Q3** Triglyceride: does the order of the three fatty acids matter (positions 1, 2, 3 on the glycerol), or are they
  a set?
- **Q4** Formats: when the reference is a shorthand, may the student answer with a condensed formula (and the
  reverse), with the system comparing the descriptions? (A condensed formula has no cis / trans.)
- **Q5** A wrong number of carbons with the double bond in the right place counted from the ω end - one error or
  two?
- **Q6** "Similar cases": what else - glycerol, the esterification equation (glycerol + 3 fatty acids -> TG + 3H₂O),
  soap (RCOO⁻Na⁺), hydrogenation of a double bond, iodine number? Each is a separate step.
- **Q7** Is `TG` the notation of your exams, or something else (e.g. a Hebrew word)?
