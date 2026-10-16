/*
 * Automated tests for ChemicalKeyboard (chemical-keyboard-v4.js).
 *
 * Four kinds of cases:
 *   keys:    a key sequence typed through the keyboard's own functions (the panel buttons
 *            and, with k:, the physical-key handler); the result is the editor content
 *   value:   setValue(text) and back - the text must come back unchanged
 *   compare: a student answer against a reference answer - correct, error codes, notes
 *   grade:   the same with a rubric - the score and the penalty lines
 *
 * Editor content is written in the value notation that setValue reads:
 *   H_{2}O   subscript       SO_{4}^{2−}   superscript (charge)      NaCl(aq)   state
 *   →[Δ]     condition above the arrow    CuSO_{4}·5H_{2}O  dot
 *
 * Keys (space separated):
 *   H Ca Fe ...        element key (the panel / full list)
 *   0-9                digit (a digit after a symbol or ")" becomes a subscript by itself)
 *   + −                plus, minus (minus only as a charge, in the superscript)
 *   _ ^ norm           subscript / superscript / normal level buttons
 *   · → ⇌ ()           dot, arrows, parentheses pair
 *   (s) (l) (g) (aq)   states
 *   +(aq) −(aq)        ion shortcut keys (config.ionKeys): charge sign + (aq)
 *   (F)                formula state key (config.formulaStateKey): I₂(CCl₄), value I_{2}({CCl_{4}})
 *   α β β⁺ γ e⁻ n p    particle keys of a nuclear keyboard (config.nuclear)
 *   M:H_{2}O           a molecule key (config.molecules) with its formula
 * A case may give "config" for the keyboard, e.g. { autoSubscript: false }.
 *   cond Δ hν °C kelvin   condition: open, or open with a symbol
 *   ← →| DEL AC        navigation (→| = move right), delete left, clear all
 *   Enter              the Enter key
 *   k:x                the physical key x (e.g. k:a, k:C, k:-)
 *
 * Used by chemTestHarness.html.
 */
(function (global) {
"use strict";

let SAMPLE_RUBRIC = {
    answerType: 100,
    unknownElement: 50,
    substances: 25,
    coefficients: { each: 10, max: 20 },
    scaledCoefficients: 15,
    states: { each: 5, max: 15, allMissing: 20 },
    charges: { each: 10, max: 20 },
    arrow: 10,
    conditions: 5
};

let WATER = "2H_{2}(g)+O_{2}(g)→2H_{2}O(l)";
let SILVER = "Ag^{+}(aq)+Cl^{-}(aq)→AgCl(s)";
let LIME = "CaCO_{3}(s)→[Δ]CaO(s)+CO_{2}(g)";

let OLEIC = "C18:1(ω9)cis";
let OLEIC_CONDENSED = "CH_{3}(CH_{2})_{7}CH=CH(CH_{2})_{7}COOH";
let LIPID_RUBRIC = { syntax: 100, answerType: 100, lipidCarbons: 33, lipidDoubleBonds: 33, lipidOmega: 34,
    lipidStructure: 20, lipidFattyAcids: { each: 33, max: 100 }, lipidNotation: 10 };

let ALPHA_DECAY = "^{238}_{92}U→^{234}_{90}Th+^{4}_{2}He";
let BETA_DECAY = "^{14}_{6}C→^{14}_{7}N+^{0}_{−1}e";
let POSITRON = "^{11}_{6}C→^{11}_{5}B+^{0}_{+1}e";
let PROTON = "^{14}_{7}N+^{4}_{2}He→^{17}_{8}O+^{1}_{1}p";
let GAMMA = "^{60}_{27}Co→^{60}_{28}Ni+^{0}_{−1}e+γ";
let FISSION = "^{1}_{0}n+^{235}_{92}U→^{141}_{56}Ba+^{92}_{36}Kr+3^{1}_{0}n";
let NUCLEAR_RUBRIC = { syntax: 100, substances: 25, massNumbers: 20, atomicNumbers: 10, coefficients: 10, balance: 10, arrow: 10 };

/* --------------------------------------------------------------
   Test cases. "expect" is the reference result - verify it by eye
   before accepting it (the harness shows the rendered expression).
   -------------------------------------------------------------- */
let CASES = [
    /* Typing: formulas */
    { group: "Typing", name: "digit after a symbol is a subscript", keys: "H 2 O", expect: "H_{2}O" },
    { group: "Typing", name: "coefficient at the start", keys: "2 H 2 O", expect: "2H_{2}O" },
    { group: "Typing", name: "two-digit subscript", keys: "C 1 2 H 2 2 O 1 1", expect: "C_{12}H_{22}O_{11}" },
    { group: "Typing", name: "two-letter symbols", keys: "Na Cl", expect: "NaCl" },
    { group: "Typing", name: "parentheses then subscript", keys: "Ca () O H →| 2", expect: "Ca(OH)_{2}" },
    { group: "Typing", name: "dot: number after it is a multiplier", keys: "Cu S O 4 · 5 H 2 O", expect: "CuSO_{4}·5H_{2}O" },
    { group: "Typing", name: "capital letter leaves the subscript", keys: "H 2 S O 4", expect: "H_{2}SO_{4}" },

    /* Parentheses with a place to type ((▢) key, 2026-10-17) */
    { group: "Parentheses", name: "DEL in an empty pair removes both", keys: "Ca () DEL", expect: "Ca" },
    { group: "Parentheses", name: "DEL after ) goes inside and deletes from the end", keys: "Ca () O H →| DEL DEL", expect: "Ca(O)" },
    { group: "Parentheses", name: "deleting the content, then the empty pair", keys: "Ca () O H →| DEL DEL DEL DEL", expect: "Ca" },
    { group: "Parentheses", name: "physical ( opens a pair, ) steps over it", keys: "Ca k:( k:O k:H k:) 2", expect: "Ca(OH)_{2}" },
    { group: "Parentheses", name: "fatty acid: (ω9) with physical keys", config: { lipids: true },
      keys: "C 1 8 k:: 1 k:( k:w k:9 k:) k:c k:i k:s", expect: "C18:1(w9)cis" },

    /* Typing without the automatic subscript (config.autoSubscript: false) */
    { group: "No automatic subscript", name: "digits stay at the normal level", config: { autoSubscript: false },
      keys: "H 2 O", expect: "H2O" },
    { group: "No automatic subscript", name: "subscript chosen with _", config: { autoSubscript: false },
      keys: "2 H _ 2 O", expect: "2H_{2}O" },
    { group: "No automatic subscript", name: "capital letter still leaves the subscript", config: { autoSubscript: false },
      keys: "H _ 2 S O _ 4", expect: "H_{2}SO_{4}" },
    { group: "No automatic subscript", name: "physical keys _ and ^", config: { autoSubscript: false },
      keys: "S O k:_ 4 k:^ 2 −", expect: "SO_{4}^{2−}" },
    { group: "No automatic subscript", name: "parentheses: subscript after ) also chosen", config: { autoSubscript: false },
      keys: "Ca () O H →| _ 2", expect: "Ca(OH)_{2}" },

    /* Ion shortcut keys (config.ionKeys) */
    { group: "Ion keys", name: "Na then +(aq)", config: { ionKeys: true }, keys: "Na +(aq)", expect: "Na^{+}(aq)" },
    { group: "Ion keys", name: "Cl then −(aq)", config: { ionKeys: true }, keys: "Cl −(aq)", expect: "Cl^{−}(aq)" },
    { group: "Ion keys", name: "charge 2 typed first: Ca^2 +(aq)", config: { ionKeys: true }, keys: "Ca ^ 2 +(aq)", expect: "Ca^{2+}(aq)" },
    { group: "Ion keys", name: "DEL removes the state, then the sign, as if typed", config: { ionKeys: true },
      keys: "Na +(aq) DEL", expect: "Na^{+}" },
    { group: "Ion keys", name: "second DEL removes the sign", config: { ionKeys: true }, keys: "Na +(aq) DEL DEL", expect: "Na" },
    { group: "Ion keys", name: "← jumps over the state, then over the sign", config: { ionKeys: true },
      keys: "Na +(aq) ← ← K", expect: "NaK^{+}(aq)" },
    { group: "Ion keys", name: "two ← then a digit: the charge number", config: { ionKeys: true },
      keys: "Na +(aq) ← ← 2", expect: "Na^{2+}(aq)" },
    { group: "Ion keys", name: "same for a charge typed by hand", keys: "S O 4 ^ − ← 2", expect: "SO_{4}^{2−}" },
    { group: "Ion keys", name: "in an equation", config: { ionKeys: true },
      keys: "Ag +(aq) + Cl −(aq) → Ag Cl (s)", expect: "Ag^{+}(aq)+Cl^{−}(aq)→AgCl(s)" },

    /* Typing: equations */
    { group: "Typing: equations", name: "+ ends the subscript, coefficient after it", keys: "N 2 + 3 H 2 → 2 N H 3", expect: "N_{2}+3H_{2}→2NH_{3}" },
    { group: "Typing: equations", name: "arrow ends the subscript", keys: "2 H 2 + O 2 → 2 H 2 O", expect: "2H_{2}+O_{2}→2H_{2}O" },
    { group: "Typing: equations", name: "equilibrium arrow", keys: "N 2 O 4 ⇌ 2 N O 2", expect: "N_{2}O_{4}⇌2NO_{2}" },

    /* Typing: states and charges */
    { group: "Typing: states & charges", name: "state", keys: "Na Cl (aq)", expect: "NaCl(aq)" },
    { group: "Typing: states & charges", name: "state after a subscript", keys: "Fe 2 O 3 (s)", expect: "Fe_{2}O_{3}(s)" },
    { group: "Typing: states & charges", name: "positive charge", keys: "Ag ^ +", expect: "Ag^{+}" },
    { group: "Typing: states & charges", name: "charge after a subscript", keys: "S O 4 ^ 2 −", expect: "SO_{4}^{2−}" },
    { group: "Typing: states & charges", name: "charge then state", keys: "Ag ^ + (aq)", expect: "Ag^{+}(aq)" },
    { group: "Typing: states & charges", name: "after a charge the level is normal again", keys: "Ag ^ + + Cl ^ −", expect: "Ag^{+}+Cl^{−}" },
    { group: "Typing: states & charges", name: "minus outside a charge is ignored", keys: "H −", expect: "H" },

    /* Typing: conditions above the arrow */
    { group: "Typing: conditions", name: "Δ without an arrow adds the arrow", keys: "Ca C O 3 Δ →| Ca O", expect: "CaCO_{3}→[Δ]CaO" },
    { group: "Typing: conditions", name: "temperature", keys: "→ cond 4 5 0 °C", expect: "→[450°C]" },
    { group: "Typing: conditions", name: "kelvin", keys: "→ cond 3 0 0 kelvin", expect: "→[300 K]" },
    { group: "Typing: conditions", name: "formula in a condition", keys: "→ cond V 2 O 5", expect: "→[V_{2}O_{5}]" },
    { group: "Typing: conditions", name: "Enter leaves the condition", keys: "→ cond Fe Enter H 2", expect: "→[Fe]H_{2}" },
    { group: "Typing: conditions", name: "DEL empties and removes the condition", keys: "→ Δ DEL", expect: "→" },

    /* Typing: physical keys */
    { group: "Physical keys", name: "C then a is Ca", keys: "k:C k:a", expect: "Ca" },
    { group: "Physical keys", name: "lowercase at the start is rejected", keys: "k:c", expect: "" },
    { group: "Physical keys", name: "third letter is rejected", keys: "k:C k:l k:a", expect: "Cl" },
    { group: "Physical keys", name: "_ and ^ keys", keys: "k:S k:O k:4 k:^ k:2 k:-", expect: "SO_{4}^{2-}" },

    /* Typing: navigation and delete */
    { group: "Navigation & delete", name: "DEL removes a two-letter symbol whole", keys: "Na Cl DEL", expect: "Na" },
    { group: "Navigation & delete", name: "DEL removes a state whole", keys: "Na Cl (aq) DEL", expect: "NaCl" },
    { group: "Navigation & delete", name: "← then DEL", keys: "H 2 O ← DEL", expect: "HO" },
    { group: "Navigation & delete", name: "← jumps over a two-letter symbol", keys: "Na Cl ← ← 2", expect: "2NaCl" },
    { group: "Navigation & delete", name: "clear all", keys: "H 2 O AC", expect: "" },

    /* setValue round trip */
    { group: "setValue", name: "water", value: WATER },
    { group: "setValue", name: "ions", value: SILVER },
    { group: "setValue", name: "condition", value: LIME },
    { group: "setValue", name: "hydrate", value: "CuSO_{4}·5H_{2}O(s)→[Δ]CuSO_{4}(s)+5H_{2}O(g)" },
    { group: "setValue", name: "polyatomic ion", value: "SO_{4}^{2-}" },
    { group: "setValue", name: "parentheses", value: "Ca(OH)_{2}" },
    { group: "setValue", name: "formula in a condition", value: "2SO_{2}+O_{2}⇌[V_{2}O_{5}, 450°C]2SO_{3}" },
    { group: "setValue", name: "charge with a state", value: "Fe^{3+}(aq)+3OH^{-}(aq)→Fe(OH)_{3}(s)" },

    /* Comparison */
    { group: "Compare", name: "identical", student: WATER, reference: WATER, expect: "correct" },
    { group: "Compare", name: "substances in another order", student: "O_{2}(g)+2H_{2}(g)→2H_{2}O(l)", reference: WATER, expect: "correct" },
    { group: "Compare", name: "wrong coefficient", student: "2H_{2}(g)+O_{2}(g)→H_{2}O(l)", reference: WATER, expect: "wrong: unbalanced-atom(H), unbalanced-atom(O), wrong-coefficient(H2O)" },
    { group: "Compare", name: "scaled coefficients", student: "4H_{2}(g)+2O_{2}(g)→4H_{2}O(l)", reference: WATER, expect: "wrong: scaled-coefficients" },
    { group: "Compare", name: "missing state", student: "2H_{2}(g)+O_{2}(g)→2H_{2}O", reference: WATER, expect: "wrong: missing-state(H2O)" },
    { group: "Compare", name: "wrong state", student: "2H_{2}(g)+O_{2}(g)→2H_{2}O(g)", reference: WATER, expect: "wrong: wrong-state(H2O)" },
    { group: "Compare", name: "wrong arrow", student: "2H_{2}(g)+O_{2}(g)⇌2H_{2}O(l)", reference: WATER, expect: "wrong: wrong-arrow" },
    { group: "Compare", name: "formula instead of equation", student: "H_{2}O", reference: WATER, expect: "wrong: wrong-answer-type, missing-species(O2), missing-species(H2), unexpected-species(H2O), missing-species(H2O)" },
    { group: "Compare", name: "unknown element", student: "2H_{2}(g)+Q_{2}(g)→2H_{2}O(l)", reference: WATER, expect: "wrong: unknown-element(Q), unexpected-atom(Q), unbalanced-atom(O), unbalanced-atom(Q), missing-species(O2), unexpected-species(Q2)" },
    { group: "Compare", name: "missing substance", student: "2H_{2}(g)→2H_{2}O(l)", reference: WATER, expect: "wrong: unbalanced-atom(O), missing-species(O2)" },
    { group: "Compare", name: "syntax error", student: "2H_{2}(g)+→2H_{2}O(l)", reference: WATER, expect: "wrong: syntax-error, unbalanced-atom(O), missing-species(O2)" },
    { group: "Compare", name: "missing charge", student: "Ag(aq)+Cl^{-}(aq)→AgCl(s)", reference: SILVER, expect: "wrong: missing-charge(Ag)" },
    { group: "Compare", name: "wrong charge", student: "Ag^{2+}(aq)+Cl^{-}(aq)→AgCl(s)", reference: SILVER, expect: "wrong: wrong-charge(Ag^2+)" },
    { group: "Compare", name: "missing condition", student: "CaCO_{3}(s)→CaO(s)+CO_{2}(g)", reference: LIME, expect: "wrong: missing-condition" },
    { group: "Compare", name: "isomer accepted by default", student: "CH_{3}OCH_{3}", reference: "C_{2}H_{5}OH", expect: "correct | notes: different-form(CH3OCH3)" },
    { group: "Compare", name: "isomer with distinguishIsomers", student: "CH_{3}OCH_{3}", reference: "C_{2}H_{5}OH", options: { distinguishIsomers: true }, expect: "wrong: wrong-structure(CH3OCH3)" },
    { group: "Compare", name: "hydrate without the dot: note", student: "CuSO_{4}H_{10}O_{5}", reference: "CuSO_{4}·5H_{2}O", expect: "correct | notes: missing-dot(CuSO4H10O5)" },
    { group: "Compare", name: "redundant subscript 1: note", student: "H_{2}O_{1}", reference: "H_{2}O", expect: "correct | notes: redundant-subscript-one(H2O1)" },

    /* Grading with the sample rubric */
    { group: "Grade", name: "correct", student: WATER, reference: WATER, rubric: SAMPLE_RUBRIC, expect: "score 100" },
    { group: "Grade", name: "one wrong coefficient hides its unbalanced atoms", student: "2H_{2}(g)+O_{2}(g)→H_{2}O(l)", reference: WATER, rubric: SAMPLE_RUBRIC, expect: "score 90: coefficients −10" },
    { group: "Grade", name: "two wrong coefficients: each", student: "H_{2}(g)+O_{2}(g)→H_{2}O(l)", reference: WATER, rubric: SAMPLE_RUBRIC, expect: "score 80: coefficients −20" },
    { group: "Grade", name: "scaled coefficients: once", student: "4H_{2}(g)+2O_{2}(g)→4H_{2}O(l)", reference: WATER, rubric: SAMPLE_RUBRIC, expect: "score 85: scaledCoefficients −15" },
    { group: "Grade", name: "one state missing", student: "2H_{2}(g)+O_{2}(g)→2H_{2}O", reference: WATER, rubric: SAMPLE_RUBRIC, expect: "score 95: states −5" },
    { group: "Grade", name: "all states missing", student: "2H_{2}+O_{2}→2H_{2}O", reference: WATER, rubric: SAMPLE_RUBRIC, expect: "score 80: states −20 (allMissing)" },
    { group: "Grade", name: "wrong answer type", student: "H_{2}O", reference: WATER, rubric: SAMPLE_RUBRIC, expect: "score 0: answerType −100" },
    { group: "Grade", name: "syntax error gives 0", student: "2H_{2}(g)+→2H_{2}O(l)", reference: WATER, rubric: SAMPLE_RUBRIC, expect: "score 0: syntax −100" },
    { group: "Grade", name: "category not in the rubric costs nothing", student: "2H_{2}(g)+O_{2}(g)⇌2H_{2}O(l)", reference: WATER, rubric: { coefficients: 10 }, expect: "score 100" },
    { group: "Grade", name: "wrong substance hides its coefficient", student: "2H_{2}(g)+O_{3}(g)→2H_{2}O(l)", reference: WATER, rubric: SAMPLE_RUBRIC, expect: "score 75: substances −25" },

    /* Molecule keys (MOLECULES-DESIGN.md): the key types the characters */
    { group: "Molecule keys", name: "after a coefficient", keys: "2 M:H_{2}O", expect: "2H_{2}O" },
    { group: "Molecule keys", name: "DEL removes one character (a sequence, not one unit)", keys: "M:H_{2}O DEL", expect: "H_{2}" },
    { group: "Molecule keys", name: "an ion: DEL removes the sign", keys: "M:SO_{4}^{2-} DEL", expect: "SO_{4}^{2}" },
    { group: "Molecule keys", name: "a group, then its count", keys: "Al 2 M:(SO_{4}) 3", expect: "Al_{2}(SO_{4})_{3}" },
    { group: "Molecule keys", name: "in an equation", keys: "M:CH_{4} + 2 M:O_{2} → M:CO_{2} + 2 M:H_{2}O",
      expect: "CH_{4}+2O_{2}→CO_{2}+2H_{2}O" },
    { group: "Molecule keys", name: "inside the condition above the arrow", keys: "→ cond M:V_{2}O_{5}", expect: "→[V_{2}O_{5}]" },
    { group: "Molecule keys", name: "with a state", keys: "M:NaCl(aq)", expect: "NaCl(aq)" },
    { group: "Molecule keys", name: "the state is left out inside the condition", keys: "→ cond M:NaCl(aq)", expect: "→[NaCl]" },
    { group: "Molecule keys", name: "the inserted formula can be edited inside", keys: "M:H_{2}O ← DEL 3", expect: "H_{3}O" },
    { group: "Molecule keys", name: "and continued", keys: "M:H_{2}O 2", expect: "H_{2}O_{2}" },

    /* Fatty acids and triglycerides (LIPIDS-DESIGN.md) */
    { group: "Lipids", name: "typing: shorthand, numbers at the normal level", config: { lipids: true },
      keys: "C 1 8 k:: 1 () ω 9 →| cis", expect: "C18:1(ω9)cis" },
    { group: "Lipids", name: "typing: condensed formula, subscripts after H and )", config: { lipids: true },
      keys: "C H 3 () C H 2 →| 7 C H = C H () C H 2 →| 7 C O O H", expect: "CH_{3}(CH_{2})_{7}CH=CH(CH_{2})_{7}COOH" },
    { group: "Lipids", name: "typing: triglyceride", config: { lipids: true },
      keys: "TG C 1 6 k:: 0 k:, C 1 8 k:: 1 ω 9 cis", expect: "TG(C16:0,C18:1ω9cis)" },
    { group: "Lipids", name: "typing: physical keys", config: { lipids: true },
      keys: "k:C k:1 k:8 k:: k:2 k:( k:w k:6 k:) k:c k:i k:s", expect: "C18:2(w6)cis" },
    { group: "Lipids", name: "typing: DEL removes the whole word cis", config: { lipids: true },
      keys: "C 1 8 k:: 1 ω 9 cis DEL", expect: "C18:1ω9" },
    { group: "Lipids", name: "typing: DEL removes the whole word trans", config: { lipids: true },
      keys: "C 1 8 k:: 1 trans DEL", expect: "C18:1" },
    { group: "Lipids", name: "typing: ← jumps over the word", config: { lipids: true },
      keys: "C 1 8 k:: 1 cis ← ω 9", expect: "C18:1ω9cis" },
    { group: "Lipids", name: "typing: cis typed letter by letter is one word too", config: { lipids: true },
      keys: "C 1 8 k:: 1 ω 9 k:c k:i k:s DEL", expect: "C18:1ω9" },
    { group: "Lipids", name: "typing: group keys", config: { lipids: true },
      keys: "M:CH_{3} () M:CH_{2} →| 1 4 M:COOH", expect: "CH_{3}(CH_{2})_{14}COOH" },
    { group: "Lipids", name: "shorthand: identical", student: OLEIC, reference: OLEIC, expect: "correct" },
    { group: "Lipids", name: "shorthand: w for ω", student: "C18:1(w9)cis", reference: OLEIC, expect: "correct" },
    { group: "Lipids", name: "shorthand: no parentheses", student: "C18:1ω9cis", reference: OLEIC, expect: "correct" },
    { group: "Lipids", name: "shorthand: cis before ω", student: "C18:1cis(ω9)", reference: OLEIC, expect: "correct" },
    { group: "Lipids", name: "shorthand: ω and configuration forgotten", student: "C18:1", reference: OLEIC,
      expect: "wrong: missing-omega-configuration" },
    { group: "Lipids", name: "shorthand: ω and cis on a saturated acid", student: "C16:0(w3)cis", reference: "C16:0",
      expect: "wrong: saturated-with-omega" },
    { group: "Lipids", name: "shorthand: letter case", student: "c18:1(W9)Cis", reference: OLEIC, expect: "wrong: letter-case" },
    { group: "Lipids", name: "shorthand: carbons wrong, ω right", student: "C16:1(ω9)cis", reference: OLEIC,
      expect: "wrong: wrong-carbon-count" },
    { group: "Lipids", name: "grade: one part of three wrong", student: "C16:1(ω9)cis", reference: OLEIC, rubric: LIPID_RUBRIC,
      expect: "score 67: lipidCarbons −33" },
    { group: "Lipids", name: "shorthand: two double bonds, wrong ω", student: "C18:2(ω3)cis", reference: "C18:2(ω6)cis",
      expect: "wrong: wrong-omega-position" },
    { group: "Lipids", name: "shorthand: trans for cis", student: "C18:1(ω9)trans", reference: OLEIC, expect: "wrong: wrong-configuration" },
    { group: "Lipids", name: "condensed: identical", student: OLEIC_CONDENSED, reference: OLEIC_CONDENSED, options: { lipids: true },
      expect: "correct" },
    { group: "Lipids", name: "condensed: written from the COOH end", student: "HOOC(CH_{2})_{7}CH=CH(CH_{2})_{7}CH_{3}",
      reference: OLEIC_CONDENSED, options: { lipids: true }, expect: "correct" },
    { group: "Lipids", name: "condensed: CH2 groups written out", student: "CH_{3}(CH_{2})_{6}CH_{2}CH=CHCH_{2}(CH_{2})_{6}COOH",
      reference: OLEIC_CONDENSED, options: { lipids: true }, expect: "correct" },
    { group: "Lipids", name: "condensed: saturated for oleic", student: "CH_{3}(CH_{2})_{14}COOH", reference: OLEIC_CONDENSED,
      options: { lipids: true }, expect: "wrong: wrong-carbon-count, wrong-double-bond-count" },
    { group: "Lipids", name: "condensed: single bond CH-CH", student: "CH_{3}(CH_{2})_{7}CH-CH(CH_{2})_{7}COOH", reference: OLEIC_CONDENSED,
      options: { lipids: true }, expect: "wrong: wrong-double-bond-count, wrong-hydrogens, wrong-hydrogens" },
    { group: "Lipids", name: "condensed: double bond elsewhere", student: "CH_{3}(CH_{2})_{5}CH=CH(CH_{2})_{9}COOH", reference: OLEIC_CONDENSED,
      options: { lipids: true }, expect: "wrong: wrong-double-bond-position" },
    { group: "Lipids", name: "condensed: linoleic, two double bonds", student: "CH_{3}(CH_{2})_{4}CH=CHCH_{2}CH=CH(CH_{2})_{7}COOH",
      reference: "CH_{3}(CH_{2})_{4}CH=CHCH_{2}CH=CH(CH_{2})_{7}COOH", options: { lipids: true }, expect: "correct" },
    { group: "Lipids", name: "format: condensed for shorthand", student: OLEIC_CONDENSED, reference: OLEIC, options: { lipids: true },
      expect: "wrong: wrong-lipid-format" },
    { group: "Lipids", name: "grade: wrong format gives 0", student: OLEIC_CONDENSED, reference: OLEIC, options: { lipids: true },
      rubric: LIPID_RUBRIC, expect: "score 0: answerType −100" },
    { group: "Lipids", name: "TG: order free", student: "TG(C18:1ω9cis, C16:0, C16:0)", reference: "TG(C16:0, C16:0, C18:1w9cis)",
      expect: "correct" },
    { group: "Lipids", name: "TG: one fatty acid wrong", student: "TG(C16:0, C16:0, C18:0)", reference: "TG(C16:0, C16:0, C18:1w9cis)",
      expect: "wrong: wrong-double-bond-count, missing-omega-configuration" },
    { group: "Lipids", name: "TG: two fatty acids", student: "TG(C16:0, C18:1ω9cis)", reference: "TG(C16:0, C16:0, C18:1w9cis)",
      expect: "wrong: missing-fatty-acid, wrong-fatty-acid-count" },
    { group: "Lipids", name: "TG: academic notation", student: "TG54:3", reference: "TG(C16:0, C16:0, C18:1w9cis)",
      expect: "wrong: academic-tg-notation" },
    { group: "Lipids", name: "a chemical formula with COOH is not a lipid without the option", student: "CH_{3}COOH",
      reference: "CH_{3}COOH", expect: "correct" },

    /* State written as a formula (ENHANCEMENTS-DESIGN.md, section 1) */
    { group: "Formula state", name: "typing: box, formula, Enter leaves it", keys: "I 2 (F) C Cl 4 Enter + Br 2",
      expect: "I_{2}({CCl_{4}})+Br_{2}" },
    { group: "Formula state", name: "typing: → leaves the box", keys: "I 2 (F) C Cl 4 →| →| + Br 2", expect: "I_{2}({CCl_{4}})+Br_{2}" },
    { group: "Formula state", name: "DEL after the box goes into it", keys: "I 2 (F) C Cl 4 Enter DEL DEL", expect: "I_{2}({CCl})" },
    { group: "Formula state", name: "DEL in an empty box removes it", keys: "I 2 (F) DEL", expect: "I_{2}" },
    { group: "Formula state", name: "physical keys: element letters only, no words or commas", keys: "I 2 (F) k:c k:, k:C k:l k:4",
      expect: "I_{2}({Cl_{4}})" },
    { group: "Formula state", name: "value round trip", value: "I_{2}({CCl_{4}})+Br_{2}({C_{6}H_{14}})" },
    { group: "Formula state", name: "same formula in another order", student: "I_{2}({Cl_{4}C})", reference: "I_{2}({CCl_{4}})", expect: "correct" },
    { group: "Formula state", name: "another solvent", student: "I_{2}({C_{6}H_{14}})", reference: "I_{2}({CCl_{4}})", expect: "wrong: wrong-state(I2)" },
    { group: "Formula state", name: "missing", student: "I_{2}", reference: "I_{2}({CCl_{4}})", expect: "wrong: missing-state(I2)" },
    { group: "Formula state", name: "(aq) instead", student: "I_{2}(aq)", reference: "I_{2}({CCl_{4}})", expect: "wrong: wrong-state(I2)" },
    { group: "Formula state", name: "unknown element inside", student: "I_{2}({CQ_{4}})", reference: "I_{2}({CCl_{4}})",
      expect: "wrong: unknown-element(Q), wrong-state(I2)" },
    { group: "Formula state", name: "typing: charge after the box", keys: "I 3 (F) C Cl 4 Enter ^ −", expect: "I_{3}({CCl_{4}})^{−}" },
    { group: "Formula state", name: "charge after the box = charge before it", student: "I_{3}({CCl_{4}})^{−}",
      reference: "I_{3}^{−}({CCl_{4}})", expect: "correct" },
    { group: "Formula state", name: "charge 2+ after the box", student: "Cu({CH_{3}OH})^{2+}", reference: "Cu^{2+}({CH_{3}OH})", expect: "correct" },
    { group: "Formula state", name: "wrong charge after the box", student: "Cu({CH_{3}OH})^{+}", reference: "Cu^{2+}({CH_{3}OH})",
      expect: "wrong: wrong-charge(Cu^+)" },
    { group: "Formula state", name: "charge after (aq) = before it", student: "Na(aq)^{+}", reference: "Na^{+}(aq)", expect: "correct" },
    { group: "Formula state", name: "in an equation", student: "Br_{2}({CCl_{4}})+C_{2}H_{4}→C_{2}H_{4}Br_{2}",
      reference: "Br_{2}({CCl_{4}})+C_{2}H_{4}→C_{2}H_{4}Br_{2}", expect: "correct" },

    /* Nuclear equations (ENHANCEMENTS-DESIGN.md, section 4) */
    { group: "Nuclear", name: "typing: numbers before the symbol, α key", config: { nuclear: true },
      keys: "^ 2 3 8 _ 9 2 U → ^ 2 3 4 _ 9 0 Th + α", expect: "^{238}_{92}U→^{234}_{90}Th+α" },
    { group: "Nuclear", name: "typing: full label inserts the numbers", config: { nuclear: true, particleLabels: "full" },
      keys: "α + β + β⁺", expect: "^{4}_{2}α+^{0}_{−1}β+^{0}_{+1}β" },
    { group: "Nuclear", name: "typing: short β⁺ and e⁻ keep their sign", config: { nuclear: true }, keys: "β⁺ + e⁻ + γ", expect: "β^{+}+e^{−}+γ" },
    { group: "Nuclear", name: "typing: DEL after a full α removes one character at a time", config: { nuclear: true, particleLabels: "full" },
      keys: "α DEL DEL", expect: "^{4}" },
    { group: "Nuclear", name: "typing: a sign at the start of a subscript", config: { nuclear: true }, keys: "^ 0 _ − 1 β", expect: "^{0}_{−1}β" },
    { group: "Nuclear", name: "auto numbers: an element gets its numbers", config: { nuclear: true, autoNuclideNumbers: true },
      keys: "U → Th + α", expect: "^{238}_{92}U→^{232}_{90}Th+α" },
    { group: "Nuclear", name: "auto numbers: C then l becomes Cl", config: { nuclear: true, autoNuclideNumbers: true },
      keys: "C k:l", expect: "^{35}_{17}Cl" },
    { group: "Nuclear", name: "auto numbers: H then e becomes He", config: { nuclear: true, autoNuclideNumbers: true },
      keys: "H k:e", expect: "^{4}_{2}He" },
    { group: "Nuclear", name: "auto numbers: after a coefficient", config: { nuclear: true, autoNuclideNumbers: true },
      keys: "2 He", expect: "2^{4}_{2}He" },
    { group: "Nuclear", name: "auto numbers: numbers typed by hand are kept", config: { nuclear: true, autoNuclideNumbers: true },
      keys: "^ 2 3 5 _ 9 2 U", expect: "^{235}_{92}U" },
    { group: "Nuclear", name: "auto numbers: a changed number is kept (C then l)", config: { nuclear: true, autoNuclideNumbers: true },
      keys: "C ← 5 →| k:l", expect: "^{12}_{65}Cl" },
    { group: "Nuclear", name: "auto numbers: off by default", config: { nuclear: true }, keys: "U", expect: "U" },
    { group: "Nuclear", name: "typing: coefficient of neutrons", config: { nuclear: true, particleLabels: "full" }, keys: "3 n", expect: "3^{1}_{0}n" },
    { group: "Nuclear", name: "value round trip", value: "^{238}_{92}U→^{234}_{90}Th+^{4}_{2}α" },
    { group: "Nuclear", name: "value round trip: beta and neutrons", value: "^{1}_{0}n+^{235}_{92}U→^{141}_{56}Ba+^{92}_{36}Kr+3^{1}_{0}n+^{0}_{−1}β" },
    { group: "Nuclear", name: "identical", student: ALPHA_DECAY, reference: ALPHA_DECAY, expect: "correct" },
    /* numbers written in the reference must be written by the student; equivalent forms with numbers are equal */
    { group: "Nuclear", name: "α without numbers for ⁴₂He", student: "^{238}_{92}U→^{234}_{90}Th+α", reference: ALPHA_DECAY,
      expect: "wrong: missing-numbers(α)" },
    { group: "Nuclear", name: "⁴₂α for ⁴₂He", student: "^{238}_{92}U→^{234}_{90}Th+^{4}_{2}α", reference: ALPHA_DECAY, expect: "correct" },
    { group: "Nuclear", name: "⁰₋₁β for ⁰₋₁e", student: "^{14}_{6}C→^{14}_{7}N+^{0}_{−1}β", reference: BETA_DECAY, expect: "correct" },
    { group: "Nuclear", name: "e⁻ without numbers for ⁰₋₁e", student: "^{14}_{6}C→^{14}_{7}N+e^{−}", reference: BETA_DECAY,
      expect: "wrong: missing-numbers(e⁻)" },
    { group: "Nuclear", name: "⁰₊₁β for ⁰₊₁e (positron)", student: "^{11}_{6}C→^{11}_{5}B+^{0}_{+1}β", reference: POSITRON, expect: "correct" },
    { group: "Nuclear", name: "reference without numbers: α accepted", student: "^{238}_{92}U→^{234}_{90}Th+α",
      reference: "^{238}_{92}U→^{234}_{90}Th+α", expect: "correct" },
    { group: "Nuclear", name: "reference without numbers: ⁴₂He accepted", student: "^{238}_{92}U→^{234}_{90}Th+^{4}_{2}He",
      reference: "^{238}_{92}U→^{234}_{90}Th+α", expect: "correct" },
    { group: "Nuclear", name: "reference without numbers: β⁺ for the positron", student: "^{11}_{6}C→^{11}_{5}B+β^{+}",
      reference: "^{11}_{6}C→^{11}_{5}B+e^{+}", expect: "correct" },
    { group: "Nuclear", name: "β for a positron is wrong", student: "^{11}_{6}C→^{11}_{5}B+β", reference: POSITRON,
      expect: "wrong: unbalanced-atom(#Z), missing-species(⁰₊₁e), unexpected-species(β)" },
    { group: "Nuclear", name: "¹₁H for ¹₁p", student: "^{14}_{7}N+^{4}_{2}He→^{17}_{8}O+^{1}_{1}H", reference: PROTON, expect: "correct" },
    { group: "Nuclear", name: "wrong mass number", student: "^{238}_{92}U→^{235}_{90}Th+^{4}_{2}He", reference: ALPHA_DECAY,
      expect: "wrong: unbalanced-atom(#A), wrong-mass-number(²³⁵₉₀Th)" },
    { group: "Nuclear", name: "wrong atomic number (identity kept)", student: "^{238}_{91}U→^{234}_{90}Th+^{4}_{2}He", reference: ALPHA_DECAY,
      expect: "wrong: wrong-atomic-number(²³⁸₉₁U)" },
    { group: "Nuclear", name: "mass number without atomic number", student: "^{238}U→^{234}_{90}Th+^{4}_{2}He", reference: ALPHA_DECAY,
      expect: "wrong: missing-atomic-number(²³⁸U)" },
    { group: "Nuclear", name: "symbol without numbers", student: "U→^{234}_{90}Th+^{4}_{2}He", reference: ALPHA_DECAY,
      expect: "wrong: unbalanced-atom(#A), missing-numbers(U)" },
    { group: "Nuclear", name: "atomic number without mass number", student: "_{92}U→^{234}_{90}Th+^{4}_{2}He", reference: ALPHA_DECAY,
      expect: "wrong: unbalanced-atom(#A), missing-mass-number(₉₂U)" },
    { group: "Nuclear", name: "grade: numbers missing hides the mass balance", student: "U→^{234}_{90}Th+^{4}_{2}He",
      reference: ALPHA_DECAY, rubric: NUCLEAR_RUBRIC, expect: "score 80: massNumbers −20" },
    { group: "Nuclear", name: "γ missing is an error", student: "^{60}_{27}Co→^{60}_{28}Ni+^{0}_{−1}e", reference: GAMMA,
      expect: "wrong: missing-species(γ)" },
    { group: "Nuclear", name: "α missing", student: "^{238}_{92}U→^{234}_{90}Th", reference: ALPHA_DECAY,
      expect: "wrong: unbalanced-atom(#A), unbalanced-atom(#Z), missing-species(⁴₂He)" },
    { group: "Nuclear", name: "a compound with a nuclide is a syntax error", student: "^{238}_{92}UO→^{234}_{90}Th+^{4}_{2}He", reference: ALPHA_DECAY,
      expect: "wrong: syntax-error" },
    { group: "Nuclear", name: "two nuclides in one term is a syntax error", student: "^{238}_{92}U^{16}_{8}O→^{234}_{90}Th+^{4}_{2}He", reference: ALPHA_DECAY,
      expect: "wrong: syntax-error" },
    { group: "Nuclear", name: "grade: compound with a nuclide gives 0", student: "^{238}_{92}UO→^{234}_{90}Th+^{4}_{2}He", reference: ALPHA_DECAY,
      rubric: NUCLEAR_RUBRIC, expect: "score 0: syntax −100" },
    { group: "Nuclear", name: "⇌ is valid writing; the reference decides", student: "^{238}_{92}U⇌^{234}_{90}Th+^{4}_{2}He", reference: ALPHA_DECAY,
      expect: "wrong: wrong-arrow" },
    { group: "Nuclear", name: "grade: wrong mass number hides the mass balance", student: "^{238}_{92}U→^{235}_{90}Th+^{4}_{2}He",
      reference: ALPHA_DECAY, rubric: NUCLEAR_RUBRIC, expect: "score 80: massNumbers −20" },
    { group: "Nuclear", name: "grade: wrong neutron coefficient hides the balance", student: "^{1}_{0}n+^{235}_{92}U→^{141}_{56}Ba+^{92}_{36}Kr+2^{1}_{0}n",
      reference: FISSION, rubric: NUCLEAR_RUBRIC, expect: "score 90: coefficients −10" },
    { group: "Nuclear", name: "grade: missing α hides the balance", student: "^{238}_{92}U→^{234}_{90}Th", reference: ALPHA_DECAY,
      rubric: NUCLEAR_RUBRIC, expect: "score 75: substances −25" },
    { group: "Nuclear", name: "grade: wrong atomic number", student: "^{238}_{91}U→^{234}_{90}Th+^{4}_{2}He", reference: ALPHA_DECAY,
      rubric: NUCLEAR_RUBRIC, expect: "score 90: atomicNumbers −10" },
    { group: "Nuclear", name: "chemical equations are unchanged", student: WATER, reference: WATER, expect: "correct" }
];

/* --------------------------------------------------------------
   Editor content in the value notation (lossless: getValue() drops
   the sub/sup levels, so it cannot be used for the expectations).
   The library's own ChemicalGrammar.valueText (library 2.1.0), so
   every key-sequence case also tests it.
   -------------------------------------------------------------- */
function showChars(chars) {
    return ChemicalGrammar.valueText(chars);
}

/* Comparison result: "correct" or "wrong", then the error codes with their substance / atom, then the notes */
function showComparison(result) {
    function item(e) {
        let detail = e.species || e.atom || "";
        return e.code + (detail ? "(" + detail + ")" : "");
    }

    let text = result.correct ? "correct" : "wrong: " + result.errors.map(item).join(", ");
    if (result.notes && result.notes.length) text += " | notes: " + result.notes.map(item).join(", ");
    return text;
}

/* Grading result: "score N", then one entry per penalty line */
function showGrade(result) {
    if (!result.score) return "no score";

    return "score " + result.score.total + (result.score.penalties.length ? ": " : "") +
        result.score.penalties.map(function (p) {
            return p.category + " −" + p.penalty + (p.allMissing ? " (allMissing)" : "") + (p.capped ? " (capped)" : "");
        }).join(", ");
}

/* --------------------------------------------------------------
   Keys -> keyboard functions
   -------------------------------------------------------------- */
let KEY_ACTIONS = {
    "+": function (k) { k.insertSign("+"); },
    "−": function (k) { k.insertSign("−"); },
    "_": function (k) { k.setScript("sub"); },
    "^": function (k) { k.setScript("sup"); },
    "norm": function (k) { k.setScript("normal"); },
    "·": function (k) { k.insertText("·", "normal"); },
    "→": function (k) { k.insertText("→", "normal"); },
    "⇌": function (k) { k.insertText("⇌", "normal"); },
    "()": function (k) { k.insertPair(); },
    "(s)": function (k) { k.insertState("s"); },
    "(l)": function (k) { k.insertState("l"); },
    "(g)": function (k) { k.insertState("g"); },
    "(aq)": function (k) { k.insertState("aq"); },
    "(F)": function (k) { k.insertFormulaState(); },
    "ω": function (k) { k.insertText("ω", "normal"); },
    "cis": function (k) { k.insertText("cis", "normal"); },
    "trans": function (k) { k.insertText("trans", "normal"); },
    "=": function (k) { k.insertText("=", "normal"); },
    "TG": function (k) { k.insertText("TG", "normal"); k.insertPair(); },
    "+(aq)": function (k) { k.insertIon("+"); },
    "−(aq)": function (k) { k.insertIon("−"); },
    "cond": function (k) { k.openCondition(); },
    "Δ": function (k) { k.openCondition("Δ"); },
    "hν": function (k) { k.openCondition("hν"); },
    "°C": function (k) { k.openCondition("°C"); },
    "kelvin": function (k) { k.openCondition(" K"); },
    "←": function (k) { k.move(-1); },
    "→|": function (k) { k.move(1); },
    "DEL": function (k) { k.del(); },
    "AC": function (k) { k.chars = []; k.cursor = 0; k.cond = null; k.script = "normal"; k.changed(); },
    "Enter": function (k) { physicalKey(k, "Enter"); }
};

function physicalKey(k, key) {
    k.key({ key: key, preventDefault: function () {}, stopPropagation: function () {} });
}

/* particle keys of a nuclear keyboard, by their short label: α β β⁺ γ e⁻ n p */
function particleKey(k, label) {
    let key = ChemicalGrammar.nuclearKeys.filter(function (x) { return x.short === label; })[0];
    if (!key) return false;
    k.insertParticle(key, k.config.particleLabels === "full");
    return true;
}

function pressKey(k, key) {
    if (/^[0-9]$/.test(key)) return k.insertDigit(key);
    if (k.config.nuclear && particleKey(k, key)) return;
    if (key.indexOf("M:") === 0) return k.insertMolecule(key.slice(2));
    if (key.indexOf("k:") === 0 && key.length > 2) return physicalKey(k, key.slice(2));
    if (Object.prototype.hasOwnProperty.call(KEY_ACTIONS, key)) return KEY_ACTIONS[key](k);
    if (ChemicalGrammar.elements.indexOf(key) >= 0) return k.insertText(key, "normal");
    throw new Error("unknown key: " + key);
}

/* An edit-mode keyboard also adds its window and element panels to <body>. */
function removeKeyboard(k) {
    [k.root, k.elementPanel, k.atomPanel].forEach(function (el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
    });
}

function caseKind(testCase) {
    if (testCase.keys !== undefined) return "keys";
    if (testCase.value !== undefined) return "value";
    if (testCase.rubric) return "grade";
    return "compare";
}

/* The input column of the harness */
function caseInput(testCase) {
    switch (caseKind(testCase)) {
        case "keys": return testCase.keys + (testCase.config ? "\nconfig: " + JSON.stringify(testCase.config) : "");
        case "value": return testCase.value;
        default: return "student: " + testCase.student + "\nreference: " + testCase.reference +
            (testCase.options ? "\noptions: " + JSON.stringify(testCase.options) : "") +
            (testCase.rubric && testCase.rubric !== SAMPLE_RUBRIC ? "\nrubric: " + JSON.stringify(testCase.rubric) : "");
    }
}

/*
 * Run all cases. KeyboardClass = window.ChemicalKeyboard; host = a DOM
 * element that receives a temporary container for each keyboard.
 */
function run(KeyboardClass, host) {
    let results = [];
    let i;

    for (i = 0; i < CASES.length; i += 1) {
        let testCase = CASES[i];
        let kind = caseKind(testCase);
        let result = { testCase: testCase, kind: kind, actual: null, expect: testCase.expect, latex: "", error: null, pass: false };
        let div = document.createElement("div");
        let k = null;

        div.id = "chemTestHost" + i;
        host.appendChild(div);

        try {
            if (kind === "keys" || kind === "value") {
                let config = { divId: div.id, language: "en", mode: "edit", value: "" };
                let key;
                for (key in testCase.config || {}) config[key] = testCase.config[key];
                k = new KeyboardClass(config);

                if (kind === "keys") {
                    testCase.keys.split(/\s+/).filter(Boolean).forEach(function (key) { pressKey(k, key); });
                } else {
                    k.setValue(testCase.value);
                    result.expect = testCase.value;
                }

                result.actual = showChars(k.getModel());
                result.latex = k.toLatex();
            } else {
                let options = {};
                let key;
                for (key in testCase.options || {}) options[key] = testCase.options[key];
                if (testCase.rubric) options.rubric = testCase.rubric;

                let comparison = ChemicalGrammar.compare(testCase.student, testCase.reference, "en", options);
                result.actual = kind === "grade" ? showGrade(comparison) : showComparison(comparison);
                result.details = comparison.errors.concat(comparison.notes || []).map(function (e) { return e.description; }).join("\n");
            }

            result.pass = result.actual === result.expect;
        } catch (e) {
            result.error = e.message;
        }

        if (k) removeKeyboard(k);
        host.removeChild(div);
        results.push(result);
    }

    return results;
}

global.ChemTests = {
    cases: CASES,
    sampleRubric: SAMPLE_RUBRIC,
    showChars: showChars,
    showComparison: showComparison,
    showGrade: showGrade,
    pressKey: pressKey,
    caseInput: caseInput,
    run: run
};
})(window);
