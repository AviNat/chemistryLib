# STACK-JS probe question for the chemical keyboard

Purpose: answer the open questions of STACKJS-DESIGN.md (section 7) on the real Moodle / STACK server before the
library is changed. The question does nothing useful for students: it writes a log of what works.

| Test | What it checks | Decides |
|---|---|---|
| T1 | STACK version (by hand, step 1) | whether STACK-JS / `limittoquestion` exist |
| T2 | the sandbox copy of a submitted input: disabled / readOnly? | review option A or B |
| T3 | inline code in `[[script type="module"]]` inside `[[iframe]]` | the template |
| T4 | JSON with quotes and Hebrew in a string input, saved and read back | the state format |
| T5 | two questions on one page each write only their own inputs (`limittoquestion`) | several questions per page |
| T6 | the library loaded from GitHub Pages inside the frame; the keyboard works in the frame; frame resize | layout, loading |
| T7 | a frame inside the PRT feedback can read the answer | review option B |

The JavaScript below avoids the characters `<`, `>` and `&` (no arrow functions, no `&&`), because Moodle's
editors may escape them.

---

## Step 1 - STACK version (T1)

Site administration → Plugins → Plugins overview → search "STACK" → note the version of **qtype_stack**.
(STACK-JS with `[[iframe]]` needs a recent STACK; write the version in the report.)

## Step 2 - create the question

New question → STACK. **Use the plain-text editor or the HTML source view** (an HTML editor may change the code).

**Question name:** `chemkbd STACK-JS probe`

**Question variables:** (empty)

**Question text** - paste all of it:

```
<p>Chemical keyboard - STACK-JS probe. The inputs are visible on purpose.</p>
<p>ans1: [[input:ans1]] [[validation:ans1]]</p>
<p>ans2: [[input:ans2]] [[validation:ans2]]</p>

[[iframe width="100%" height="420px" title="chemkbd probe"]]
[[script src="https://avinat.github.io/chemistryLib/chemical-keyboard-v4.js"/]]
<div id="log" style="font:13px monospace;white-space:pre-wrap;direction:ltr;border:1px solid #ccc;padding:6px"></div>
<p>
<button type="button" id="json">T4: write JSON to ans2</button>
<button type="button" id="grow">T6: grow frame</button>
<button type="button" id="shrink">T6: shrink frame</button>
</p>
<div id="kbd" dir="ltr"></div>
[[script type="module"]]
import {stack_js} from '[[cors src="stackjsiframe.js"/]]';
var log = document.getElementById("log");
function say(s) { log.textContent += s + "\n"; }
window.addEventListener("error", function (e) { say("ERROR " + e.message); });

say("T3 inline module script in [[iframe]]: OK");
var lib = typeof ChemicalKeyboard !== "undefined";
say("T6 library from GitHub Pages: " + (lib ? "loaded, version " + (window.ChemicalGrammar || {}).version : "NOT loaded"));

var me = "frame-" + Math.random().toString(36).slice(2, 7);
say("this frame: " + me);

stack_js.request_access_to_input("ans1", true, true).then(function (id) {
  var el = document.getElementById(id);
  say("T2 ans1 copy: disabled=" + el.disabled + " readOnly=" + el.readOnly + " readonly-attr=" + el.hasAttribute("readonly") + " value=" + JSON.stringify(el.value));
  if (!(el.disabled || el.readOnly)) {
    if (el.value === "") {
      el.value = me;
      el.dispatchEvent(new Event("change"));
      say("T5 wrote " + me + " into ans1 of THIS question");
    } else {
      say("T5 ans1 already holds " + el.value);
    }
  }
}, function (e) { say("T2/T5 ans1 ERROR " + e); });

var JSONV = '{"v":2,"answer":"H_{2}O","quote":"say \\"hi\\"","he":"מים"}';
stack_js.request_access_to_input("ans2", true, true).then(function (id) {
  var el = document.getElementById(id);
  say("T2 ans2 copy: disabled=" + el.disabled + " readOnly=" + el.readOnly);
  if (el.value) {
    var same = false;
    try { same = JSON.stringify(JSON.parse(el.value)) === JSON.stringify(JSON.parse(JSONV)); } catch (x) { same = "not JSON: " + x.message; }
    say("T4 ans2 read back: " + el.value);
    say("T4 identical to what was written: " + same);
  }
  document.getElementById("json").onclick = function () {
    el.value = JSONV;
    el.dispatchEvent(new Event("change"));
    say("T4 written. Now press Check (or save), then reload the page.");
  };
}, function (e) { say("T2/T4 ans2 ERROR " + e); });

Promise.resolve(stack_js.get_input_metadata("ans2")).then(function (m) {
  say("metadata ans2: " + JSON.stringify(m));
}, function (e) { say("metadata ERROR " + e); });

document.getElementById("grow").onclick = function () { stack_js.resize_containing_frame("100%", "700px"); say("T6 resize to 700px requested"); };
document.getElementById("shrink").onclick = function () { stack_js.resize_containing_frame("100%", "420px"); say("T6 resize to 420px requested"); };

if (lib) {
  try {
    ChemicalKeyboard.runQuestion(document.getElementById("kbd"), { correctAnswer: "2H_{2}+O_{2}→2H_{2}O", language: "he" });
    say("T6 keyboard created - click the box below, type with the keys and with the physical keyboard");
  } catch (x) { say("T6 keyboard ERROR " + x.message); }
}
[[/script]]
[[/iframe]]

[[feedback:prt1]]
```

(If the default "Specific feedback" field already contains `[[feedback:prt1]]`, leave it there and delete the last
line above.)

**Input ans1:** type **String**, model answer `"probe"`, *Show the validation*: **No**.
**Input ans2:** type **String**, model answer `"probe"`, *Show the validation*: **No**.

**Potential response tree prt1** - one node:
- SAns: `ans1` - TAns: `ans1` - Answer test: **String** (always true: the probe only needs a submission).
- True branch: score 1. **Node true feedback** - paste (T7):

```
[[iframe width="100%" height="120px" title="probe feedback"]]
<div id="log" style="font:13px monospace;white-space:pre-wrap;direction:ltr"></div>
[[script type="module"]]
import {stack_js} from '[[cors src="stackjsiframe.js"/]]';
var log = document.getElementById("log");
log.textContent = "T7 frame in the PRT feedback: running\n";
stack_js.request_access_to_input("ans2", false, true).then(function (id) {
  var el = document.getElementById(id);
  log.textContent += "T7 ans2 seen from the feedback: " + el.value + "\nT7 disabled=" + el.disabled + " readOnly=" + el.readOnly;
}, function (e) { log.textContent += "T7 ERROR " + e; });
[[/script]]
[[/iframe]]
```

Save.

## Step 3 - preview (T3, T4, T6)

1. Preview the question. The log should show T3, T6 (library version) and the T2 lines (answering: both `false`).
2. T6: click the box under the buttons; type with the keyboard keys and with the physical keyboard; open the full
   element list; press "grow frame" / "shrink frame". Note anything cut off by the frame.
3. T4: press "write JSON to ans2" - the visible ans2 box on the page should show the JSON. Press **Check**, then
   reload the page: the log line "T4 identical to what was written" should say `true`.
4. After Check: does the PRT feedback show the T7 frame and the JSON?

## Step 4 - quiz (T2, T5, T7)

1. A quiz with **two copies of the probe on the same page** (add it twice; random questions are not needed).
   Question behaviour: deferred feedback. Review options: everything on, "after the attempt" and "later".
2. Start an attempt. Each frame should write a **different** `frame-xxxxx` into **its own** ans1 box (T5).
3. In one copy press "write JSON to ans2". Finish and submit the attempt.
4. Open the review page:
   - T2: the log lines "T2 ans1 copy: disabled=… readOnly=…" - are they `true` now?
   - T7: does the feedback frame show ans2?

## Step 5 - report

Copy the text of the logs (preview, quiz page, review page) and the STACK version, and send them. Screenshots of
anything cut off or broken help too.
