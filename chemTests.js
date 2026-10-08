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
    { group: "Grade", name: "wrong substance hides its coefficient", student: "2H_{2}(g)+O_{3}(g)→2H_{2}O(l)", reference: WATER, rubric: SAMPLE_RUBRIC, expect: "score 75: substances −25" }
];

/* --------------------------------------------------------------
   Editor content in the value notation (lossless: getValue() drops
   the sub/sup levels, so it cannot be used for the expectations)
   -------------------------------------------------------------- */
function showChars(chars) {
    let out = "";
    let i = 0;

    while (i < chars.length) {
        let c = chars[i];

        if (c.kind === "state") {
            out += c.ch;
            i += 1;
            continue;
        }

        if (c.script === "sub" || c.script === "sup") {
            let script = c.script;
            let run = "";

            while (i < chars.length && chars[i].script === script && chars[i].kind !== "state") {
                run += chars[i].ch;
                i += 1;
            }

            out += (script === "sub" ? "_{" : "^{") + run + "}";
            continue;
        }

        out += c.ch;
        if (c.condition && c.condition.length) out += "[" + showChars(c.condition) + "]";
        i += 1;
    }

    return out;
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

function pressKey(k, key) {
    if (/^[0-9]$/.test(key)) return k.insertDigit(key);
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
        case "keys": return testCase.keys;
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
                k = new KeyboardClass({ divId: div.id, language: "en", mode: "edit", value: "" });

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
