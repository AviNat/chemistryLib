(function (global) {
  "use strict";

  var SYMBOLS = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og".split(" ");

  var SET = {};
  var uid = 1;

  var T = {
    en: {
      elements: "Elements",
      all: "All elements",
      normal: "Normal",
      sub: "Subscript",
      sup: "Superscript",
      state: "State",
      close: "Close"
    },
    he: {
      elements: "יסודות",
      all: "כל היסודות",
      normal: "רגיל",
      sub: "כתב תחתי",
      sup: "כתב עילי",
      state: "מצב צבירה",
      close: "סגירה"
    },
    ar: {
      elements: "العناصر",
      all: "كل العناصر",
      normal: "عادي",
      sub: "نص سفلي",
      sup: "نص علوي",
      state: "حالة المادة",
      close: "إغلاق"
    }
  };

  var NAMES={
  H:["Hydrogen","מימן","هيدروجين"],He:["Helium","הליום","هيليوم"],Li:["Lithium","ליתיום","ليثيوم"],Be:["Beryllium","בריליום","بيريليوم"],B:["Boron","בור","بورون"],C:["Carbon","פחמן","كربون"],N:["Nitrogen","חנקן","نيتروجين"],O:["Oxygen","חמצן","أكسجين"],F:["Fluorine","פלואור","فلور"],Ne:["Neon","ניאון","نيون"],
  Na:["Sodium","נתרן","صوديوم"],Mg:["Magnesium","מגנזיום","مغنيسيوم"],Al:["Aluminium","אלומיניום","ألومنيوم"],Si:["Silicon","צורן","سيليكون"],P:["Phosphorus","זרחן","فوسفور"],S:["Sulfur","גופרית","كبريت"],Cl:["Chlorine","כלור","كلور"],Ar:["Argon","ארגון","أرجون"],K:["Potassium","אשלגן","بوتاسيوم"],Ca:["Calcium","סידן","كالسيوم"],
  Sc:["Scandium","סקנדיום","سكانديوم"],Ti:["Titanium","טיטניום","تيتانيوم"],V:["Vanadium","ונדיום","فاناديوم"],Cr:["Chromium","כרום","كروم"],Mn:["Manganese","מנגן","منغنيز"],Fe:["Iron","ברזל","حديد"],Co:["Cobalt","קובלט","كوبالت"],Ni:["Nickel","ניקל","نيكل"],Cu:["Copper","נחושת","نحاس"],Zn:["Zinc","אבץ","زنك"],
  Ga:["Gallium","גליום","غاليوم"],Ge:["Germanium","גרמניום","جرمانيوم"],As:["Arsenic","ארסן","زرنيخ"],Se:["Selenium","סלניום","سيلينيوم"],Br:["Bromine","ברום","بروم"],Kr:["Krypton","קריפטון","كريبتون"],Rb:["Rubidium","רובידיום","روبيديوم"],Sr:["Strontium","סטרונציום","سترونشيوم"],Y:["Yttrium","איטריום","إيتريوم"],Zr:["Zirconium","זירקוניום","زركونيوم"],
  Nb:["Niobium","ניאוביום","نيوبيوم"],Mo:["Molybdenum","מוליבדן","موليبدينوم"],Tc:["Technetium","טכנציום","تكنيتيوم"],Ru:["Ruthenium","רותניום","روثينيوم"],Rh:["Rhodium","רודיום","روديوم"],Pd:["Palladium","פלדיום","بلاديوم"],Ag:["Silver","כסף","فضة"],Cd:["Cadmium","קדמיום","كادميوم"],In:["Indium","אינדיום","إنديوم"],Sn:["Tin","בדיל","قصدير"],
  Sb:["Antimony","אנטימון","إثمد"],Te:["Tellurium","טלור","تيلوريوم"],I:["Iodine","יוד","يود"],Xe:["Xenon","קסנון","زينون"],Cs:["Caesium","צזיום","سيزيوم"],Ba:["Barium","בריום","باريوم"],La:["Lanthanum","לנתן","لانثانوم"],Ce:["Cerium","צריום","سيريوم"],Pr:["Praseodymium","פרסאודימיום","براسيوديميوم"],Nd:["Neodymium","נאודימיום","نيوديميوم"],
  Pm:["Promethium","פרומתיום","بروميثيوم"],Sm:["Samarium","סמריום","ساماريوم"],Eu:["Europium","אירופיום","يوروبيوم"],Gd:["Gadolinium","גדוליניום","غادولينيوم"],Tb:["Terbium","טרביום","تيربيوم"],Dy:["Dysprosium","דיספרוסיום","ديسبروسيوم"],Ho:["Holmium","הולמיום","هولميوم"],Er:["Erbium","ארביום","إربيوم"],Tm:["Thulium","תוליום","ثوليوم"],Yb:["Ytterbium","איטרביום","إيتربيوم"],
  Lu:["Lutetium","לוטציום","لوتيتيوم"],Hf:["Hafnium","הפניום","هافنيوم"],Ta:["Tantalum","טנטלום","تانتالوم"],W:["Tungsten","טונגסטן","تنغستن"],Re:["Rhenium","רניום","رينيوم"],Os:["Osmium","אוסמיום","أوزميوم"],Ir:["Iridium","אירידיום","إيريديوم"],Pt:["Platinum","פלטינה","بلاتين"],Au:["Gold","זהב","ذهب"],Hg:["Mercury","כספית","زئبق"],
  Tl:["Thallium","תליום","ثاليوم"],Pb:["Lead","עופרת","رصاص"],Bi:["Bismuth","ביסמוט","بزموت"],Po:["Polonium","פולוניום","بولونيوم"],At:["Astatine","אסטטין","أستاتين"],Rn:["Radon","רדון","رادون"],Fr:["Francium","פרנציום","فرانسيوم"],Ra:["Radium","רדיום","راديوم"],Ac:["Actinium","אקטיניום","أكتينيوم"],Th:["Thorium","תוריום","ثوريوم"],
  Pa:["Protactinium","פרוטקטיניום","بروتكتينيوم"],U:["Uranium","אורניום","يورانيوم"],Np:["Neptunium","נפטוניום","نبتونيوم"],Pu:["Plutonium","פלוטוניום","بلوتونيوم"],Am:["Americium","אמריציום","أمريسيوم"],Cm:["Curium","קוריום","كوريوم"],Bk:["Berkelium","ברקליום","بركيليوم"],Cf:["Californium","קליפורניום","كاليفورنيوم"],Es:["Einsteinium","איינשטייניום","أينشتينيوم"],Fm:["Fermium","פרמיום","فيرميوم"],
  Md:["Mendelevium","מנדלביום","مندليفيوم"],No:["Nobelium","נובליום","نوبليوم"],Lr:["Lawrencium","לורנציום","لورنسيوم"],Rf:["Rutherfordium","רתרפורדיום","رذرفورديوم"],Db:["Dubnium","דובניום","دوبنيوم"],Sg:["Seaborgium","סיבורגיום","سيبورغيوم"],Bh:["Bohrium","בוהריום","بوهريوم"],Hs:["Hassium","הסיום","هاسيوم"],Mt:["Meitnerium","מייטנריום","مايتنريوم"],Ds:["Darmstadtium","דרמשטטיום","دارمشتاتيوم"],
  Rg:["Roentgenium","רנטגניום","رونتجينيوم"],Cn:["Copernicium","קופרניקיום","كوبرنيسيوم"],Nh:["Nihonium","ניהוניום","نيهونيوم"],Fl:["Flerovium","פלרוביום","فليروفيوم"],Mc:["Moscovium","מוסקוביום","موسكوفيوم"],Lv:["Livermorium","ליברמוריום","ليفرموريوم"],Ts:["Tennessine","טנסין","تينيسين"],Og:["Oganesson","אוגנסון","أوغانيسون"]
};

var ERROR_TEXT={
  en:{
    correct:"Correct answer",
    equivalent:"The student's answer is chemically equivalent to the reference answer.",
    issues:"{count} issue(s) found",
    "unknown-element":"{atom} is not a recognized chemical element.",
    "unexpected-atom":"The student's answer contains {atom}, which does not appear in the reference answer.",
    "missing-atom":"The reference answer contains {atom}, but it is missing from the student's answer.",
    "unbalanced-atom":"The equation is not balanced for {atom}: the left side contains {left} and the right side contains {right}.",
    "wrong-atom-count":"{species} contains {actual} atoms of {atom}, but the reference substance contains {expected}.",
    "missing-state":"The state of {species} is missing. The reference answer specifies {expectedState}.",
    "unexpected-state":"{species} has state {actualState}, but the reference answer does not specify a state.",
    "wrong-state":"The state of {species} is {actualState}, but the reference answer specifies {expectedState}.",
    "missing-charge":"The charge of {species} is missing. The reference answer specifies {expectedCharge}.",
    "unexpected-charge":"{species} has an unexpected charge of {actualCharge}.",
    "wrong-charge":"The charge of {species} is {actualCharge}, but the reference answer specifies {expectedCharge}.",
    "missing-species":"{species} is required on the {side} side but is missing.",
    "unexpected-species":"{species} appears on the {side} side but is not present there in the reference answer.",
    "wrong-coefficient":"The coefficient of {species} is {actual}, but the reference coefficient is {expected}.",
    "wrong-arrow":"The equation uses the wrong reaction arrow.",
    "wrong-answer-type":"The expected answer is a chemical {expected}, but the student's answer is a chemical {actual}.",
    "syntax-error":"The answer contains a syntax error: {parserCode}.",
    "missing-reference-answer":"No reference answer was supplied."
  },
  he:{
    correct:"תשובה נכונה",
    equivalent:"תשובת התלמיד שקולה מבחינה כימית לתשובת הייחוס.",
    issues:"נמצאו {count} שגיאות",
    "unknown-element":"{atom} אינו סמל מוכר של יסוד כימי.",
    "unexpected-atom":"תשובת התלמיד מכילה את היסוד {atom}, שאינו מופיע בתשובת הייחוס.",
    "missing-atom":"תשובת הייחוס מכילה את היסוד {atom}, אך הוא חסר בתשובת התלמיד.",
    "unbalanced-atom":"המשוואה אינה מאוזנת עבור {atom}: בצד שמאל יש {left} אטומים ובצד ימין יש {right}.",
    "wrong-atom-count":"ב־{species} יש {actual} אטומים של {atom}, אך בחומר המתאים בתשובת הייחוס יש {expected}.",
    "missing-state":"מצב הצבירה של {species} חסר. בתשובת הייחוס מופיע {expectedState}.",
    "unexpected-state":"ל־{species} הוגדר מצב הצבירה {actualState}, אך בתשובת הייחוס לא הוגדר מצב צבירה.",
    "wrong-state":"מצב הצבירה של {species} הוא {actualState}, אך בתשובת הייחוס מופיע {expectedState}.",
    "missing-charge":"המטען של {species} חסר. בתשובת הייחוס מופיע המטען {expectedCharge}.",
    "unexpected-charge":"ל־{species} הוגדר מטען לא צפוי: {actualCharge}.",
    "wrong-charge":"המטען של {species} הוא {actualCharge}, אך בתשובת הייחוס מופיע המטען {expectedCharge}.",
    "missing-species":"החומר {species} צריך להופיע בצד {side}, אך הוא חסר.",
    "unexpected-species":"החומר {species} מופיע בצד {side}, אך אינו מופיע בצד זה בתשובת הייחוס.",
    "wrong-coefficient":"המקדם של {species} הוא {actual}, אך המקדם בתשובת הייחוס הוא {expected}.",
    "wrong-arrow":"במשוואה נעשה שימוש בחץ תגובה שגוי.",
    "wrong-answer-type":"נדרשת תשובה מסוג {expected}, אך תשובת התלמיד היא מסוג {actual}.",
    "syntax-error":"התשובה מכילה שגיאת תחביר: {parserCode}.",
    "missing-reference-answer":"לא הוגדרה תשובת ייחוס."
  },
  ar:{
    correct:"إجابة صحيحة",
    equivalent:"إجابة الطالب مكافئة كيميائيًا للإجابة المرجعية.",
    issues:"تم العثور على {count} أخطاء",
    "unknown-element":"{atom} ليس رمزًا معروفًا لعنصر كيميائي.",
    "unexpected-atom":"تحتوي إجابة الطالب على العنصر {atom}، لكنه لا يظهر في الإجابة المرجعية.",
    "missing-atom":"تحتوي الإجابة المرجعية على العنصر {atom}، لكنه مفقود من إجابة الطالب.",
    "unbalanced-atom":"المعادلة غير موزونة بالنسبة إلى {atom}: يحتوي الطرف الأيسر على {left} ذرات والطرف الأيمن على {right}.",
    "wrong-atom-count":"تحتوي {species} على {actual} ذرات من {atom}، بينما تحتوي المادة المرجعية على {expected}.",
    "missing-state":"حالة {species} مفقودة. تحدد الإجابة المرجعية الحالة {expectedState}.",
    "unexpected-state":"للمادة {species} حالة غير متوقعة هي {actualState}.",
    "wrong-state":"حالة {species} هي {actualState}، لكن الإجابة المرجعية تحدد {expectedState}.",
    "missing-charge":"شحنة {species} مفقودة. تحدد الإجابة المرجعية الشحنة {expectedCharge}.",
    "unexpected-charge":"للمادة {species} شحنة غير متوقعة هي {actualCharge}.",
    "wrong-charge":"شحنة {species} هي {actualCharge}، لكن الإجابة المرجعية تحدد {expectedCharge}.",
    "missing-species":"يجب أن تظهر المادة {species} في الطرف {side}، لكنها مفقودة.",
    "unexpected-species":"تظهر المادة {species} في الطرف {side}، لكنها غير موجودة هناك في الإجابة المرجعية.",
    "wrong-coefficient":"معامل {species} هو {actual}، لكن المعامل المرجعي هو {expected}.",
    "wrong-arrow":"تم استخدام سهم تفاعل غير صحيح.",
    "wrong-answer-type":"نوع الإجابة المطلوب هو {expected}، لكن إجابة الطالب من النوع {actual}.",
    "syntax-error":"تحتوي الإجابة على خطأ في الصياغة: {parserCode}.",
    "missing-reference-answer":"لم يتم تحديد إجابة مرجعية."
  }
};

function localizedState(state,language){
  var states={
    en:{s:"solid (s)",l:"liquid (l)",g:"gas (g)",aq:"aqueous (aq)"},
    he:{s:"מוצק (s)",l:"נוזל (l)",g:"גז (g)",aq:"תמיסה מימית (aq)"},
    ar:{s:"صلب (s)",l:"سائل (l)",g:"غاز (g)",aq:"محلول مائي (aq)"}
  };

  return state?(states[language]||states.en)[state]||state:"";
}

function localizedSide(side,language){
  var sides={
    en:{left:"left",right:"right",expression:"expression"},
    he:{left:"שמאל",right:"ימין",expression:"הביטוי"},
    ar:{left:"الأيسر",right:"الأيمن",expression:"التعبير"}
  };

  return (sides[language]||sides.en)[side]||side;
}
function formulaTextToLatex(text){
  var out="",i=0,symbol,digits,ch;

  text=String(text||"");

  while(i<text.length){
    ch=text.charAt(i);

    if(isUpper(ch)){
      symbol=ch;
      i++;

      if(i<text.length&&isLower(text.charAt(i))){
        symbol+=text.charAt(i);
        i++;
      }

      out+="\\mathrm{"+symbol+"}";
      digits="";

      while(i<text.length&&isDigit(text.charAt(i))){
        digits+=text.charAt(i);
        i++;
      }

      if(digits)out+="_{"+digits+"}";
      continue;
    }

    out+=ch;
    i++;
  }

  return out;
}

function replaceTextToken(text,token,value){
  var marker="{"+token+"}",position;

  while((position=text.indexOf(marker))>=0){
    text=text.substring(0,position)+value+text.substring(position+marker.length);
  }

  return text;
}

function localizedErrorTemplate(error,language){
  var messages=ERROR_TEXT[language]||ERROR_TEXT.en;
  var text=messages[error.code]||error.description||error.code;

  text=replaceTextToken(text,"count",error.count);
  text=replaceTextToken(text,"left",error.reactantCount);
  text=replaceTextToken(text,"right",error.productCount);
  text=replaceTextToken(text,"actual",error.actual);
  text=replaceTextToken(text,"expected",error.expected);
  text=replaceTextToken(text,"parserCode",error.parserCode);
  text=replaceTextToken(text,"side",localizedSide(error.side,language));
  text=replaceTextToken(text,"actualState",localizedState(error.actual,language));
  text=replaceTextToken(text,"expectedState",localizedState(error.expected,language));
  text=replaceTextToken(text,"actualCharge",chargeLabel(error.actual));
  text=replaceTextToken(text,"expectedCharge",chargeLabel(error.expected));

  return text;
}

function appendErrorMessage(parent,error,language,index){
  var text=localizedErrorTemplate(error,language);
  var row=node("div");
  var tokens=["{species}","{atom}"];
  var position,selectedToken,selectedPosition,i,before,value,formula;

  row.dir=language==="en"?"ltr":"rtl";

  apply(row,{
    marginBottom:"8px",
    textAlign:language==="en"?"left":"right",
    lineHeight:"1.7"
  });

  row.appendChild(document.createTextNode(index+". "));

  while(text){
    selectedToken=null;
    selectedPosition=-1;

    for(i=0;i<tokens.length;i++){
      position=text.indexOf(tokens[i]);

      if(position>=0&&(selectedPosition<0||position<selectedPosition)){
        selectedToken=tokens[i];
        selectedPosition=position;
      }
    }

    if(!selectedToken){
      row.appendChild(document.createTextNode(text));
      break;
    }

    before=text.substring(0,selectedPosition);
    if(before)row.appendChild(document.createTextNode(before));

    value=selectedToken==="{species}"?error.species:error.atom;
    formula=node("span","\\("+formulaTextToLatex(value)+"\\)");

    apply(formula,{
      display:"inline-block",
      direction:"ltr",
      unicodeBidi:"isolate",
      margin:"0 3px"
    });

    formula.dir="ltr";
    row.appendChild(formula);
    text=text.substring(selectedPosition+selectedToken.length);
  }

  parent.appendChild(row);
}


  var COMMON = [
    "H", "C", "N", "O", "Na", "Mg", "Al",
    "Cl", "K", "Ca", "Fe", "Cu", "Zn", "Ag"
  ];

  for (var z = 0; z < SYMBOLS.length; z++) {
    SET[SYMBOLS[z]] = true;
  }

  function copy(o) {
    var r = {};
    var k;

    for (k in o) {
      if (Object.prototype.hasOwnProperty.call(o, k)) {
        r[k] = o[k];
      }
    }

    return r;
  }

  function apply(el, o) {
    var k;

    for (k in o) {
      el.style[k] = o[k];
    }
  }

  function node(tag, text, style) {
    var e = document.createElement(tag);

    if (text !== null && text !== undefined) {
      e.textContent = text;
    }

    if (style) {
      apply(e, style);
    }

    return e;
  }

  function makeDraggable(el,handle){
  var startX,startY,startLeft,startTop,moving=false;
  handle.style.touchAction="none";

  handle.addEventListener("pointerdown",function(e){
    if(e.button!==undefined&&e.button!==0)return;
    moving=true;
    startX=e.clientX;startY=e.clientY;
    startLeft=el.offsetLeft;startTop=el.offsetTop;
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  handle.addEventListener("pointermove",function(e){
    var left,top,maxLeft,maxTop;
    if(!moving)return;

    maxLeft=Math.max(0,window.innerWidth-el.offsetWidth);
    maxTop=Math.max(0,window.innerHeight-el.offsetHeight);
    left=Math.max(0,Math.min(maxLeft,startLeft+e.clientX-startX));
    top=Math.max(0,Math.min(maxTop,startTop+e.clientY-startY));

    el.style.left=left+"px";
    el.style.top=top+"px";
  });

  handle.addEventListener("pointerup",function(e){
    moving=false;
    if(handle.hasPointerCapture(e.pointerId))handle.releasePointerCapture(e.pointerId);
  });

  handle.addEventListener("pointercancel",function(){moving=false;});
}

  function esc(s) {
    var input = String(s);
    var out = "";
    var special = "{}_%&#";
    var i;
    var c;

    for (i = 0; i < input.length; i++) {
      c = input.charAt(i);

      if (c === "\\") {
        out += "\\textbackslash{}";
      } else if (special.indexOf(c) >= 0) {
        out += "\\" + c;
      } else {
        out += c;
      }
    }

    return out;
  }

  function isDigit(c) {
    return c >= "0" && c <= "9";
  }

  function isUpper(c) {
    return c >= "A" && c <= "Z";
  }

  function isLower(c) {
    return c >= "a" && c <= "z";
  }

  function isDigits(s) {
    var i;

    if (!s) {
      return false;
    }

    for (i = 0; i < s.length; i++) {
      if (!isDigit(s.charAt(i))) {
        return false;
      }
    }

    return true;
  }

function makeChar(ch, script, pair, kind) {
  return {
    id: uid++,
    ch: ch,
    script: script || "normal",
    pair: pair || null,
    kind: kind || null
  };
}

  function tokenize(chars) {
    var out = [];
    var i = 0;
    var start;
    var s;
    var script;

    while (i < chars.length) {
      start = i;
      s = chars[i].ch;
      script = chars[i].script;

      if (
        isUpper(s) &&
        i + 1 < chars.length &&
        isLower(chars[i + 1].ch) &&
        chars[i + 1].script === script
      ) {
        s += chars[i + 1].ch;
        i++;
      } else if (isDigit(s)) {
        while (
          i + 1 < chars.length &&
          isDigit(chars[i + 1].ch) &&
          chars[i + 1].script === script
        ) {
          s += chars[++i].ch;
        }
      } else if (isLower(s)) {
        while (
          i + 1 < chars.length &&
          isLower(chars[i + 1].ch) &&
          chars[i + 1].script === script
        ) {
          s += chars[++i].ch;
        }
      }

      out.push({
        text: s,
        script: script,
        start: start,
        end: i + 1
      });

      i++;
    }

    return out;
  }

  function charsLength(tokens) {
    if (!tokens.length) {
      return 0;
    }

    return tokens[tokens.length - 1].end;
  }

  function parseFormulaTokens(tokens, from, to) {
    var i = from;
    var items = [];
    var errors = [];

    function group(stop) {
      var arr = [];

      while (i < to) {
        var x = tokens[i];

        if (x.text === stop && x.script === "normal") {
          i++;
          return arr;
        }

        if (x.text === "(" && x.script === "normal") {
          var st = x.start;
          var children;
          var count = 1;

          i++;
          children = group(")");

          if (
            i < to &&
            tokens[i].script === "sub" &&
            isDigits(tokens[i].text)
          ) {
            count = Number(tokens[i].text);
            i++;
          }

          arr.push({
            type: "group",
            children: children,
            count: count,
            range: [
              st,
              i ? tokens[i - 1].end : x.end
            ]
          });

          continue;
        }

        if (
          isUpper(x.text.charAt(0)) &&
          x.script === "normal"
        ) {
          var count2 = 1;
          var el = x.text;
          var st2 = x.start;

          i++;

          if (!SET[el]) {
            errors.push({
              code: "unknown-element",
              range: [x.start, x.end],
              value: el
            });
          }

          if (
            i < to &&
            tokens[i].script === "sub" &&
            isDigits(tokens[i].text)
          ) {
            count2 = Number(tokens[i].text);

            if (count2 === 1) {
              errors.push({
                code: "subscript-one",
                range: [
                  tokens[i].start,
                  tokens[i].end
                ]
              });
            }

            i++;
          }

          arr.push({
            type: "element",
            symbol: el,
            count: count2,
            range: [
              st2,
              i ? tokens[i - 1].end : x.end
            ]
          });

          continue;
        }

        errors.push({
          code: "unexpected-token",
          range: [x.start, x.end],
          value: x.text
        });

        i++;
      }

      if (stop) {
        errors.push({
          code: "missing-close-parenthesis",
          range: [
            charsLength(tokens),
            charsLength(tokens)
          ]
        });
      }

      return arr;
    }

    items = group(null);

    return {
      items: items,
      errors: errors,
      next: i
    };
  }

  function composition(items, map, mult) {
    var i;
    var it;

    map = map || {};
    mult = mult || 1;

    for (i = 0; i < items.length; i++) {
      it = items[i];

      if (it.type === "element") {
        map[it.symbol] =
          (map[it.symbol] || 0) +
          it.count * mult;
      } else {
        composition(
          it.children,
          map,
          mult * it.count
        );
      }
    }

    return map;
  }

  function parseSpecies(tokens, from, to) {
    var i = from;
    var coefficient = 1;
    var state = null;
    var charge = 0;
    var errors = [];
    var formulaEnd = to;

    if (
      i < to &&
      tokens[i].script === "normal" &&
      isDigits(tokens[i].text)
    ) {
      coefficient = Number(tokens[i].text);
      i++;
    }

    if (
      to - i >= 3 &&
      tokens[to - 3].text === "(" &&
      tokens[to - 3].script === "sub" &&
      tokens[to - 2].script === "sub" &&
      (
        tokens[to - 2].text === "s" ||
        tokens[to - 2].text === "l" ||
        tokens[to - 2].text === "g" ||
        tokens[to - 2].text === "aq"
      ) &&
      tokens[to - 1].text === ")" &&
      tokens[to - 1].script === "sub"
    ) {
      state = tokens[to - 2].text;
      formulaEnd = to - 3;
    }

    var chargeStart = formulaEnd;
    var j = formulaEnd - 1;
    var chargeText = "";

    while (
      j >= i &&
      tokens[j].script === "sup"
    ) {
      chargeStart = j;
      chargeText =
        tokens[j].text + chargeText;
      j--;
    }

    if (chargeText) {
      var sign =
        chargeText.charAt(
          chargeText.length - 1
        );

      var mag =
        chargeText.substring(
          0,
          chargeText.length - 1
        );

      if (
        (
          sign === "+" ||
          sign === "−" ||
          sign === "-"
        ) &&
        (
          !mag ||
          isDigits(mag)
        )
      ) {
        charge =
          (mag ? Number(mag) : 1) *
          (sign === "+" ? 1 : -1);
      } else {
        errors.push({
          code: "invalid-charge",
          range: [
            tokens[chargeStart].start,
            tokens[formulaEnd - 1].end
          ]
        });
      }

      formulaEnd = chargeStart;
    }

    var p =
      parseFormulaTokens(
        tokens,
        i,
        formulaEnd
      );

    errors = errors.concat(p.errors);

    return {
      type: "species",
      coefficient: coefficient,
      formula: p.items,
      composition: composition(p.items),
      charge: charge,
      state: state,
      range: [
        tokens[from].start,
        tokens[to - 1].end
      ],
      errors: errors
    };
  }

  function analyze(chars) {
    var tokens = tokenize(chars);
    var arrow = -1;
    var arrowType = null;
    var i;
    var left = [];
    var right = [];
    var errors = [];

    for (i = 0; i < tokens.length; i++) {
      if (
        tokens[i].script === "normal" &&
        (
          tokens[i].text === "→" ||
          tokens[i].text === "⇌"
        )
      ) {
        if (arrow >= 0) {
          errors.push({
            code: "multiple-arrows",
            range: [
              tokens[i].start,
              tokens[i].end
            ]
          });
        } else {
          arrow = i;

          if (tokens[i].text === "→") {
            arrowType = "forward";
          } else {
            arrowType = "equilibrium";
          }
        }
      }
    }

    function parseSide(a, b, target) {
      var j;
      var last = a;
      var depth = 0;

      for (j = a; j <= b; j++) {
        if (
          j < b &&
          tokens[j].text === "("
        ) {
          depth++;
        }

        if (
          j < b &&
          tokens[j].text === ")"
        ) {
          depth--;
        }

        if (
          j === b ||
          (
            depth === 0 &&
            tokens[j].text === "+" &&
            tokens[j].script === "normal"
          )
        ) {
          if (j === last) {
            errors.push({
              code: "missing-species",
              range: [
                j < b
                  ? tokens[j].start
                  : chars.length,
                j < b
                  ? tokens[j].end
                  : chars.length
              ]
            });
          } else {
            var sp =
              parseSpecies(
                tokens,
                last,
                j
              );

            target.push(sp);
            errors =
              errors.concat(sp.errors);
          }

          last = j + 1;
        }
      }
    }

    if (arrow < 0) {
      parseSide(
        0,
        tokens.length,
        left
      );
    } else {
      parseSide(
        0,
        arrow,
        left
      );

      parseSide(
        arrow + 1,
        tokens.length,
        right
      );
    }

    return {
      type:
        arrow < 0
          ? "formula"
          : "equation",

      reactants: left,
      products: right,

      arrow:
        arrow < 0
          ? null
          : {
              type: arrowType,
              conditionsAbove: null
            },

      errors: errors,
      valid: errors.length === 0
    };
  }
// ANALYZER
  function modelFromValue(value){
  var chars=[],s=String(value||""),script="normal",explicit=s.indexOf("_{")>=0||s.indexOf("^{")>=0;
  var i,ch,prev,stateId=1,j,len,insideMathRoman=0;

  for(i=0;i<s.length;i++){
    if(s.substring(i,i+18)==="\\rightleftharpoons"){
      chars.push(makeChar("⇌","normal"));
      i+=17;
      continue;
    }

    if(s.substring(i,i+17)==="\\longrightarrow"){
      chars.push(makeChar("→","normal"));
      i+=16;
      continue;
    }

    if(s.substring(i,i+8)==="\\mathrm{"){
      i+=7;
      insideMathRoman=1;
      continue;
    }

    if(s.substring(i,i+5)==="\\cdot"){
      chars.push(makeChar("·","normal"));
      i+=4;
      continue;
    }

    if(s.substring(i,i+3)==="<->"){
      chars.push(makeChar("⇌","normal"));
      i+=2;
      continue;
    }

    if(s.substring(i,i+2)==="->"){
      chars.push(makeChar("→","normal"));
      i++;
      continue;
    }

    ch=s.charAt(i);

    if(ch==="_"&&s.charAt(i+1)==="{"){
      script="sub";
      i++;
      continue;
    }

    if(ch==="^"&&s.charAt(i+1)==="{"){
      script="sup";
      i++;
      continue;
    }

    if(ch==="}"){
      if(insideMathRoman)insideMathRoman=0;
      else script="normal";
      continue;
    }

    if(!explicit&&isDigit(ch)&&script==="normal"&&chars.length){
      prev=chars[chars.length-1];

      if(isUpper(prev.ch)||isLower(prev.ch)||prev.ch===")"){
        script="sub";
      }
    }

    if(!explicit&&script==="sub"&&!isDigit(ch)){
      script="normal";
    }

    chars.push(makeChar(ch,script));
  }

  for(i=0;i<chars.length;i++){
    len=0;

    if(
      i+3<chars.length&&
      chars[i].ch==="("&&
      chars[i+1].ch==="a"&&
      chars[i+2].ch==="q"&&
      chars[i+3].ch===")"
    ){
      len=4;
    }else if(
      i+2<chars.length&&
      chars[i].ch==="("&&
      "slg".indexOf(chars[i+1].ch)>=0&&
      chars[i+2].ch===")"
    ){
      len=3;
    }

    if(len){
      for(j=i;j<i+len;j++){
        chars[j].script="sub";
        chars[j].pair=stateId;
        chars[j].kind="state";
      }

      stateId++;
      i+=len-1;
    }
  }

  return chars;
}

function analyzeValue(value){
  if(Array.isArray(value))return analyze(value);
  return analyze(modelFromValue(value));
}
function sortedKeys(obj){
  var keys=[],k;
  for(k in obj)if(Object.prototype.hasOwnProperty.call(obj,k))keys.push(k);
  keys.sort();
  return keys;
}

function atomSetKey(composition){
  return sortedKeys(composition).join(",");
}

function compositionKey(composition){
  var keys=sortedKeys(composition),parts=[],i;

  for(i=0;i<keys.length;i++){
    parts.push(keys[i]+":"+composition[keys[i]]);
  }

  return parts.join(",");
}

function chargeKey(charge){
  return charge?"^"+charge:"";
}

function stateKey(state){
  return state?"("+state+")":"";
}

function speciesFormulaKey(species){
  return compositionKey(species.composition)+chargeKey(species.charge);
}

function speciesKey(species,coefficient){
  return coefficient+"*"+speciesFormulaKey(species)+stateKey(species.state);
}

function gcd(a,b){
  a=Math.abs(a);
  b=Math.abs(b);

  while(b){
    var t=b;
    b=a%b;
    a=t;
  }

  return a||1;
}

function equationCoefficientDivisor(ast){
  var values=[],i,d=0;

  if(ast.type!=="equation")return 1;

  for(i=0;i<ast.reactants.length;i++)values.push(ast.reactants[i].coefficient);
  for(i=0;i<ast.products.length;i++)values.push(ast.products[i].coefficient);
  for(i=0;i<values.length;i++)d=gcd(d,values[i]);

  return d||1;
}

function canonicalSide(speciesList,divisor){
  var items=[],i,s,coefficient;

  for(i=0;i<speciesList.length;i++){
    s=speciesList[i];
    coefficient=s.coefficient/divisor;

    items.push({
      coefficient:coefficient,
      composition:copy(s.composition),
      charge:s.charge,
      state:s.state,
      formulaKey:speciesFormulaKey(s),
      atomSetKey:atomSetKey(s.composition),
      key:speciesKey(s,coefficient)
    });
  }

  items.sort(function(a,b){
    return a.key<b.key?-1:a.key>b.key?1:0;
  });

  return items;
}

function sideKey(side){
  var parts=[],i;
  for(i=0;i<side.length;i++)parts.push(side[i].key);
  return parts.join("+");
}

function canonicalizeAst(ast){
  var divisor=equationCoefficientDivisor(ast);
  var left=canonicalSide(ast.reactants,divisor);
  var right=canonicalSide(ast.products,divisor);
  var leftKey=sideKey(left);
  var rightKey=sideKey(right);
  var directKey,reverseKey,key,arrowSymbol;

  if(ast.type!=="equation"){
    return {
      type:ast.type,
      arrow:null,
      divisor:divisor,
      left:left,
      right:right,
      leftKey:leftKey,
      rightKey:rightKey,
      key:leftKey
    };
  }

  arrowSymbol=ast.arrow.type==="equilibrium"?"⇌":"→";
  directKey=leftKey+arrowSymbol+rightKey;
  reverseKey=rightKey+arrowSymbol+leftKey;

  if(ast.arrow.type==="equilibrium"){
    key=directKey<reverseKey?directKey:reverseKey;
  }else{
    key=directKey;
  }

  return {
    type:ast.type,
    arrow:ast.arrow.type,
    divisor:divisor,
    left:left,
    right:right,
    leftKey:leftKey,
    rightKey:rightKey,
    directKey:directKey,
    reverseKey:reverseKey,
    key:key
  };
}

function canonicalizeValue(value){
  var ast=value&&value.type?value:analyzeValue(value);

  return {
    ast:ast,
    canonical:canonicalizeAst(ast)
  };
}
function addError(errors,code,data,description){
  var error={code:code,description:description},k;

  for(k in data){
    if(Object.prototype.hasOwnProperty.call(data,k))error[k]=data[k];
  }

  errors.push(error);
}

function stateName(state){
  if(state==="s")return "solid (s)";
  if(state==="l")return "liquid (l)";
  if(state==="g")return "gas (g)";
  if(state==="aq")return "aqueous (aq)";
  return state||"unspecified";
}

function collectAtoms(ast){
  var atoms={},sides=[ast.reactants,ast.products],a,i,j,k,species;

  for(a=0;a<sides.length;a++){
    for(i=0;i<sides[a].length;i++){
      species=sides[a][i];

      for(k in species.composition){
        if(Object.prototype.hasOwnProperty.call(species.composition,k)){
          atoms[k]=(atoms[k]||0)+species.composition[k]*species.coefficient;
        }
      }
    }
  }

  return atoms;
}

function sideTotals(side){
  var totals={},i,k,species;

  for(i=0;i<side.length;i++){
    species=side[i];

    for(k in species.composition){
      if(Object.prototype.hasOwnProperty.call(species.composition,k)){
        totals[k]=(totals[k]||0)+species.composition[k]*species.coefficient;
      }
    }
  }

  return totals;
}

function formulaLabel(species){
  var keys=sortedKeys(species.composition),text="",i,count;

  for(i=0;i<keys.length;i++){
    count=species.composition[keys[i]];
    text+=keys[i]+(count===1?"":count);
  }

  return text;
}

function syntaxErrors(ast,errors,answerName){
  var i,error,seen={};

  for(i=0;i<ast.errors.length;i++){
    error=ast.errors[i];

    if(error.code==="unknown-element"&&!seen[error.value]){
      seen[error.value]=true;

      addError(
        errors,
        "unknown-element",
        {
          answer:answerName,
          atom:error.value,
          range:error.range
        },
        "The symbol "+error.value+" in the "+answerName+
        " answer is not a recognized chemical element."
      );
    }else if(error.code!=="unknown-element"){
      addError(
        errors,
        "syntax-error",
        {
          answer:answerName,
          parserCode:error.code,
          range:error.range,
          value:error.value
        },
        "The "+answerName+" answer contains a syntax error: "+error.code+"."
      );
    }
  }
}

function chooseOrientation(student,reference){
  var direct=0,reverse=0;

  if(student.leftKey!==reference.leftKey)direct++;
  if(student.rightKey!==reference.rightKey)direct++;

  if(student.leftKey!==reference.rightKey)reverse++;
  if(student.rightKey!==reference.leftKey)reverse++;

  /*
    Only the reference answer determines whether reversed sides
    are chemically acceptable.
  */
  if(reference.arrow==="equilibrium"&&reverse<direct){
    return {
      left:student.right,
      right:student.left,
      reversed:true
    };
  }

  return {
    left:student.left,
    right:student.right,
    reversed:false
  };
}

function compareStates(student,reference,side,errors){
  if(student.state===reference.state)return;

  if(!student.state){
    addError(
      errors,
      "missing-state",
      {
        side:side,
        species:formulaLabel(reference),
        expected:reference.state,
        actual:null
      },
      "The state of "+formulaLabel(reference)+" on the "+side+
      " side is missing. The reference answer specifies "+
      stateName(reference.state)+"."
    );

    return;
  }

  if(!reference.state){
    addError(
      errors,
      "unexpected-state",
      {
        side:side,
        species:formulaLabel(reference),
        expected:null,
        actual:student.state
      },
      formulaLabel(reference)+" on the "+side+
      " side is marked as "+stateName(student.state)+
      ", but the reference answer does not specify a state."
    );

    return;
  }

  addError(
    errors,
    "wrong-state",
    {
      side:side,
      species:formulaLabel(reference),
      expected:reference.state,
      actual:student.state
    },
    formulaLabel(reference)+" on the "+side+
    " side is marked as "+stateName(student.state)+
    ", but the reference answer specifies "+stateName(reference.state)+"."
  );
}

function compareAtomCounts(student,reference,side,errors){
  var atoms={},keys,i,atom,actual,expected;

  for(atom in student.composition){
    if(Object.prototype.hasOwnProperty.call(student.composition,atom))atoms[atom]=true;
  }

  for(atom in reference.composition){
    if(Object.prototype.hasOwnProperty.call(reference.composition,atom))atoms[atom]=true;
  }

  keys=sortedKeys(atoms);

  for(i=0;i<keys.length;i++){
    atom=keys[i];
    actual=student.composition[atom]||0;
    expected=reference.composition[atom]||0;

    if(actual!==expected){
      addError(
        errors,
        "wrong-atom-count",
        {
          side:side,
          species:formulaLabel(reference),
          atom:atom,
          expected:expected,
          actual:actual
        },
        "The corresponding substance on the "+side+
        " side contains "+actual+" atom"+(actual===1?"":"s")+
        " of "+atom+", but the reference substance contains "+
        expected+"."
      );
    }
  }
}

function findSpeciesMatch(studentSide,referenceSpecies,used){
  var i;

  /* First preference: same composition and same charge. */
  for(i=0;i<studentSide.length;i++){
    if(
      !used[i]&&
      studentSide[i].formulaKey===referenceSpecies.formulaKey
    ){
      return i;
    }
  }

  /* Second preference: same composition, even if the charge is different. */
  for(i=0;i<studentSide.length;i++){
    if(
      !used[i]&&
      compositionKey(studentSide[i].composition)===
      compositionKey(referenceSpecies.composition)
    ){
      return i;
    }
  }

  /* Third preference: same collection of atoms, but possibly wrong counts. */
  for(i=0;i<studentSide.length;i++){
    if(
      !used[i]&&
      studentSide[i].atomSetKey===referenceSpecies.atomSetKey
    ){
      return i;
    }
  }

  return -1;
}
function chargeLabel(charge){
  var magnitude;

  if(!charge)return "no charge";

  magnitude=Math.abs(charge);

  if(charge>0)return magnitude===1?"+":magnitude+"+";
  return magnitude===1?"−":magnitude+"−";
}
function compareCharges(student,reference,side,errors){
  var species=formulaLabel(reference);

  if(student.charge===reference.charge)return;

  if(!student.charge&&reference.charge){
    addError(
      errors,
      "missing-charge",
      {
        side:side,
        species:species,
        expected:reference.charge,
        actual:student.charge
      },
      "The charge of "+species+" on the "+side+
      " side is missing. The reference answer specifies a charge of "+
      chargeLabel(reference.charge)+"."
    );

    return;
  }

  if(student.charge&&!reference.charge){
    addError(
      errors,
      "unexpected-charge",
      {
        side:side,
        species:species,
        expected:reference.charge,
        actual:student.charge
      },
      species+" on the "+side+" side has an unexpected charge of "+
      chargeLabel(student.charge)+
      ". The reference substance has no charge."
    );

    return;
  }

  addError(
    errors,
    "wrong-charge",
    {
      side:side,
      species:species,
      expected:reference.charge,
      actual:student.charge
    },
    "The charge of "+species+" on the "+side+" side is "+
    chargeLabel(student.charge)+", but the reference answer specifies "+
    chargeLabel(reference.charge)+"."
  );
}


function compareSide(studentSide,referenceSide,side,errors){
  var used=[],i,index,student,reference;

  for(i=0;i<referenceSide.length;i++){
    reference=referenceSide[i];
    index=findSpeciesMatch(studentSide,reference,used);

    if(index<0){
      addError(
        errors,
        "missing-species",
        {
          side:side,
          species:formulaLabel(reference),
          expectedCoefficient:reference.coefficient
        },
        "The substance "+formulaLabel(reference)+" is required on the "+
        side+" side but is missing from the student's answer."
      );

      continue;
    }

    used[index]=true;
    student=studentSide[index];

    compareAtomCounts(student,reference,side,errors);
    compareCharges(student,reference,side,errors);
    compareStates(student,reference,side,errors);

    if(student.coefficient!==reference.coefficient){
      addError(
        errors,
        "wrong-coefficient",
        {
          side:side,
          species:formulaLabel(reference),
          expected:reference.coefficient,
          actual:student.coefficient
        },
        "The coefficient of "+formulaLabel(reference)+" on the "+side+
        " side is "+student.coefficient+", but the normalized reference "+
        "coefficient is "+reference.coefficient+"."
      );
    }
  }

  for(i=0;i<studentSide.length;i++){
    if(!used[i]){
      addError(
        errors,
        "unexpected-species",
        {
          side:side,
          species:formulaLabel(studentSide[i]),
          actualCoefficient:studentSide[i].coefficient
        },
        "The substance "+formulaLabel(studentSide[i])+" appears on the "+
        side+" side of the student's answer but not in the reference answer."
      );
    }
  }
}
function localizedErrorDescription(error,language){
  var text=localizedErrorTemplate(error,language);
  var atom=error.atom||error.symbol||"";

  text=replaceTextToken(text,"species",error.species||"");
  text=replaceTextToken(text,"atom",atom);

  return text;
}

function compareChemicalAnswers(studentValue,referenceValue,language){
  var studentAst=studentValue&&studentValue.type?studentValue:analyzeValue(studentValue);
  var referenceAst=referenceValue&&referenceValue.type?referenceValue:analyzeValue(referenceValue);
  var studentCanonical=canonicalizeAst(studentAst);
  var referenceCanonical=canonicalizeAst(referenceAst);
  var studentAtoms=collectAtoms(studentAst);
  var referenceAtoms=collectAtoms(referenceAst);
  var orientation,studentLeftTotals,studentRightTotals,atoms,keys,i,atom;
  var errors=[];

  syntaxErrors(studentAst,errors,"student");
  syntaxErrors(referenceAst,errors,"reference");

  if(studentAst.type!==referenceAst.type){
    addError(
      errors,
      "wrong-answer-type",
      {
        expected:referenceAst.type,
        actual:studentAst.type
      },
      "The reference answer is a chemical "+referenceAst.type+
      ", but the student's answer is a chemical "+studentAst.type+"."
    );
  }

  if(
    studentAst.type==="equation"&&
    referenceAst.type==="equation"&&
    studentCanonical.arrow!==referenceCanonical.arrow
  ){
    addError(
      errors,
      "wrong-arrow",
      {
        expected:referenceCanonical.arrow,
        actual:studentCanonical.arrow
      },
      "The equation uses the wrong arrow. The reference answer uses a "+
      (referenceCanonical.arrow==="equilibrium"
        ?"bidirectional equilibrium arrow"
        :"one-direction reaction arrow")+"."
    );
  }

  keys=sortedKeys(studentAtoms);

  for(i=0;i<keys.length;i++){
    atom=keys[i];

    if(!referenceAtoms[atom]){
      addError(
        errors,
        "unexpected-atom",
        {
          atom:atom,
          expected:0,
          actual:studentAtoms[atom]
        },
        "The student's answer contains "+atom+
        ", but this element does not appear anywhere in the reference answer."
      );
    }
  }

  keys=sortedKeys(referenceAtoms);

  for(i=0;i<keys.length;i++){
    atom=keys[i];

    if(!studentAtoms[atom]){
      addError(
        errors,
        "missing-atom",
        {
          atom:atom,
          expected:referenceAtoms[atom],
          actual:0
        },
        "The reference answer contains "+atom+
        ", but this element is completely missing from the student's answer."
      );
    }
  }

  if(studentAst.type==="equation"){
    studentLeftTotals=sideTotals(studentAst.reactants);
    studentRightTotals=sideTotals(studentAst.products);
    atoms={};

    for(atom in studentLeftTotals){
      if(Object.prototype.hasOwnProperty.call(studentLeftTotals,atom))atoms[atom]=true;
    }

    for(atom in studentRightTotals){
      if(Object.prototype.hasOwnProperty.call(studentRightTotals,atom))atoms[atom]=true;
    }

    keys=sortedKeys(atoms);

    for(i=0;i<keys.length;i++){
      atom=keys[i];

      if((studentLeftTotals[atom]||0)!==(studentRightTotals[atom]||0)){
        addError(
          errors,
          "unbalanced-atom",
          {
            atom:atom,
            reactantCount:studentLeftTotals[atom]||0,
            productCount:studentRightTotals[atom]||0,
            difference:(studentLeftTotals[atom]||0)-(studentRightTotals[atom]||0)
          },
          "The equation is not balanced for "+atom+
          ": the left side contains "+(studentLeftTotals[atom]||0)+
          " atom"+((studentLeftTotals[atom]||0)===1?"":"s")+
          " and the right side contains "+(studentRightTotals[atom]||0)+"."
        );
      }
    }
  }

  orientation=chooseOrientation(studentCanonical,referenceCanonical);

  compareSide(
    orientation.left,
    referenceCanonical.left,
    studentAst.type==="equation"?"left":"expression",
    errors
  );

  if(referenceAst.type==="equation"){
    compareSide(
      orientation.right,
      referenceCanonical.right,
      "right",
      errors
    );
  }
  for(i=0;i<errors.length;i++){
    errors[i].description=localizedErrorDescription(errors[i],language);
  }
  return {
    correct:errors.length===0,
    studentCanonical:studentCanonical,
    referenceCanonical:referenceCanonical,
    reversed:orientation.reversed,
    errors:errors
  };
}
ChemicalKeyboard.prototype.canonicalize=function(){
  return canonicalizeAst(this.getAST());
};

ChemicalKeyboard.prototype.compare=function(referenceAnswer){
  var reference=referenceAnswer!==undefined
    ?referenceAnswer
    :this.correctAnswer;

  if(reference===null||reference===undefined){
    return {
      correct:false,
      studentCanonical:this.canonicalize(),
      referenceCanonical:null,
      reversed:false,
      errors:[{
        code:"missing-reference-answer",
        description:"No correct reference answer was supplied to the keyboard."
      }]
    };
  }

  return compareChemicalAnswers(this.getAST(),reference,this.language);
};

ChemicalKeyboard.prototype.setCorrectAnswer=function(value){
  this.correctAnswer=value;
};

//  CONSTRUCTOR

  function ChemicalKeyboard(config) {
    this.config = copy(config || {});
    this.correctAnswer=this.config.correctAnswer!==undefined?this.config.correctAnswer:null;
    this.language =
    this.config.language || "en";
    this.mode =
    this.config.mode || "edit";

    this.chars = [];
    this.cursor = 0;
    this.script = "normal";

    this.highlights =
    this.config.highlights || [];
    this.navigationScript=false;
    this.groupId = 1;

    this.host =
      this.config.divId
        ? document.getElementById(
            this.config.divId
          )
        : null;

    if (!this.host) {
      this.host = node("div");
      document.body.appendChild(this.host);
    }

    this.build();

    this.setValue(
      this.config.value || ""
    );

    if (this.mode === "edit") {
      this.display.tabIndex = 0;
    }
  }

ChemicalKeyboard.prototype.build=function(){
  var self=this,t=T[this.language]||T.en,root=node("div"),
  windowHeader,windowTitle, windowClose,
  operatorsRow,statesRow,lowerRow,digitsPanel,digitsGrid,navigationRow,atomsPanel,
  atomsGrid,common,digits,i;

  apply(root,{
    fontFamily:"Arial,sans-serif",
    direction:"ltr",
    boxSizing:"border-box"
  });

  windowHeader=node("div");

  apply(windowHeader,{
    position:"absolute",
    left:"0",
    top:"0",
    right:"0",
    height:"34px",
    padding:"7px 38px 6px 10px",
    borderBottom:"1px solid #c3ced8",
    borderRadius:"9px 9px 0 0",
    background:"#dce7f0",
    boxSizing:"border-box",
    cursor:"move",
    userSelect:"none",
    fontWeight:"bold"
  });

  windowTitle=node("span",this.config.title||"Chemical keyboard");
  windowHeader.appendChild(windowTitle);

  windowClose=node("button","×");
  windowClose.type="button";
  windowClose.title=t.close;

  apply(windowClose,{
    position:"absolute",
    right:"5px",
    top:"3px",
    width:"28px",
    height:"28px",
    padding:"0",
    border:"0",
    borderRadius:"4px",
    background:"transparent",
    fontSize:"24px",
    lineHeight:"24px",
    cursor:"pointer"
  });

  windowClose.addEventListener("pointerdown",function(e){e.stopPropagation();});

  windowClose.addEventListener("click",function(){
    self.closeElementWindows();
    root.style.display="none";
  });

windowHeader.appendChild(windowClose);
root.appendChild(windowHeader);
makeDraggable(root,windowHeader);

  apply(root,{
    fontFamily:"Arial,sans-serif",
    direction:"ltr",
    maxWidth:"820px",
    boxSizing:"border-box"
  });

  this.display=node("div");

 apply(this.display,{
    minHeight:"56px",
    border:"1px solid #789",
    borderRadius:"8px",
    padding:"12px",
    fontSize:"28px",
    background:"#fff",
    boxSizing:"border-box",
    outline:"none",
    cursor:this.mode==="edit"?"text":"default"
  });

 this.display.addEventListener("click",function(e){
    if(self.mode!=="edit")return;

    if(self.collapsed)self.show();

    self.setCursorFromClick(e);
  });

  this.display.style.setProperty("border","1px solid #789","important");
  this.display.style.setProperty("border-radius","8px","important");
  this.display.style.setProperty("background","#fff","important");

  root.appendChild(this.display);

  this.panel=node("div");

  apply(this.panel,{
    display:this.mode==="edit"?"block":"none",
    marginTop:"8px",
    padding:"8px",
    background:"#eef3f8",
    borderRadius:"8px"
  });

  root.appendChild(this.panel);

  function btn(parent,label,fn,title,extra){
    var b=node("button",label);

    b.type="button";
    b.title=title||label;

    apply(b,{
      minWidth:"44px",
      height:"38px",
      fontSize:"18px",
      border:"1px solid #8aa",
      borderRadius:"5px",
      background:"#fff",
      cursor:"pointer"
    });

    if(extra){
      apply(b,extra);
    }

    b.addEventListener("click",fn);
    parent.appendChild(b);

    return b;
  }

  /*
   * Operators
   */
  operatorsRow=node("div");

  apply(operatorsRow,{
    display:"flex",
    flexWrap:"wrap",
    gap:"6px",
    marginBottom:"8px"
  });

  this.panel.appendChild(operatorsRow);

  btn(operatorsRow,"()",function(){
    self.insertPair();
  });

  btn(operatorsRow,"x",function(){
    self.setScript("normal");
  },t.normal);

  btn(operatorsRow,"x₂",function(){
    self.setScript("sub");
  },t.sub);

  btn(operatorsRow,"x²",function(){
    self.setScript("sup");
  },t.sup);

  btn(operatorsRow,"+",function(){
    self.insertSign("+");
  });

  btn(operatorsRow,"−",function(){
    self.insertSign("−");
  });

  btn(operatorsRow,"→",function(){
    self.insertText("→","normal");
  });

  btn(operatorsRow,"⇌",function(){
    self.insertText("⇌","normal");
  });

  btn(operatorsRow,"·",function(){
    self.insertText("·","normal");
  });

  /*
   * States
   */
  statesRow=node("div");

  apply(statesRow,{
    display:"grid",
    gridTemplateColumns:"repeat(4, minmax(52px, 72px))",
    gap:"6px",
    marginBottom:"10px"
  });

  this.panel.appendChild(statesRow);

  btn(statesRow,"(s)",function(){
    self.insertState("s");
  });

  btn(statesRow,"(l)",function(){
    self.insertState("l");
  });

  btn(statesRow,"(g)",function(){
    self.insertState("g");
  });

  btn(statesRow,"(aq)",function(){
    self.insertState("aq");
  });

  /*
   * Lower area: digits on the left,
   * atoms on the right.
   */
  lowerRow=node("div");

  apply(lowerRow,{
    display:"flex",
    flexWrap:"wrap",
    alignItems:"flex-start",
    gap:"12px"
  });

  this.panel.appendChild(lowerRow);

  /*
   * Digits panel
   */
  digitsPanel=node("div");

  apply(digitsPanel,{
    width:"190px",
    padding:"8px",
    border:"1px solid #c3ced8",
    borderRadius:"7px",
    background:"#f8fbfd",
    boxSizing:"border-box"
  });

  lowerRow.appendChild(digitsPanel);

  digitsGrid=node("div");

  apply(digitsGrid,{
    display:"grid",
    gridTemplateColumns:"repeat(3, 1fr)",
    gap:"6px"
  });

  digitsPanel.appendChild(digitsGrid);

  digits=["7","8","9","4","5","6","1","2","3"];

  for(i=0;i<digits.length;i++){
    (function(d){
      btn(digitsGrid,d,function(){
        self.insertDigit(d);
      },d,{
        width:"100%"
      });
    })(digits[i]);
  }

  btn(digitsGrid,"0",function(){
    self.insertDigit("0");
  },"0",{
    width:"100%",
    gridColumn:"1 / span 3"
  });

  /*
   * Navigation under the digits.
   */
  navigationRow=node("div");

  apply(navigationRow,{
    display:"grid",
    gridTemplateColumns:"repeat(4, 1fr)",
    gap:"6px",
    marginTop:"8px"
  });

  digitsPanel.appendChild(navigationRow);

  btn(navigationRow,"←",function(){
    self.move(-1);
  },null,{
    minWidth:"0",
    width:"100%"
  });

  btn(navigationRow,"→|",function(){
    self.move(1);
  },null,{
    minWidth:"0",
    width:"100%"
  });

  btn(navigationRow,"DEL",function(){
    self.del();
  },null,{
    minWidth:"0",
    width:"100%",
    fontSize:"14px"
  });

  btn(navigationRow,"AC",function(){
    self.chars=[];
    self.cursor=0;
    self.script="normal";
    self.changed();
  },null,{
    minWidth:"0",
    width:"100%",
    fontSize:"14px"
  });

  /*
   * Atom symbols panel
   */
  atomsPanel=node("div");

  apply(atomsPanel,{
    width:"190px",
    padding:"8px",
    border:"1px solid #c3ced8",
    borderRadius:"7px",
    background:"#f8fbfd",
    boxSizing:"border-box"
  });

  lowerRow.appendChild(atomsPanel);

  atomsGrid=node("div");

  apply(atomsGrid,{
    display:"grid",
    gridTemplateColumns:"repeat(2, 1fr)",
    gap:"6px"
  });

  atomsPanel.appendChild(atomsGrid);

  common=this.config.elements||COMMON;

  for(i=0;i<common.length;i++){
    (function(sym){
      btn(atomsGrid,sym,function(){
        self.insertText(sym,"normal");
      },sym,{
        width:"100%"
      });
    })(common[i]);
  }

  btn(atomsGrid,t.all,function(){
    self.openElements();
  },t.all,{
    width:"100%",
    gridColumn:"1 / span 2",
    fontSize:"15px"
  });

  /*
   * Initial-letter window
   */
  this.elementPanel=node("div");

  apply(this.elementPanel,{
    display:"none",
    position:"fixed",
    left:"20px",
    top:"20px",
    width:"310px",
    maxWidth:"calc(100vw - 16px)",
    padding:"38px 10px 10px",
    border:"1px solid #8193a3",
    borderRadius:"7px",
    background:"#fff",
    boxShadow:"0 5px 20px rgba(0,0,0,.22)",
    boxSizing:"border-box",
    zIndex:"10001"
  });

  /*
   * Elements for the selected initial
   */
  this.atomPanel=node("div");

  apply(this.atomPanel,{
    display:"none",
    position:"fixed",
    left:"20px",
    top:"20px",
    width:"310px",
    maxWidth:"calc(100vw - 16px)",
    maxHeight:"270px",
    padding:"38px 10px 10px",
    border:"1px solid #8193a3",
    borderRadius:"7px",
    background:"#fff",
    boxShadow:"0 5px 20px rgba(0,0,0,.22)",
    overflow:"auto",
    boxSizing:"border-box",
    zIndex:"10002"
  });

  if(this.mode==="edit"){
    document.body.appendChild(this.elementPanel);
    document.body.appendChild(this.atomPanel);
  }

  this.host.textContent="";
  this.root=root;

  if(this.mode==="edit"){
    this.buildRenderedElement();

    document.body.appendChild(this.elementPanel);
    document.body.appendChild(this.atomPanel);

    this.buildPopupWindow(root,t);
    this.hide();
  }else{
    this.buildEmbeddedWindow(root);
  }

  root.tabIndex=this.mode==="edit"?0:-1;

  root.addEventListener("keydown",function(e){
    self.key(e);
  });
};

ChemicalKeyboard.prototype.buildRenderedElement=function(){
  var self=this;

  this.renderedDisplay=node("div");

  apply(this.renderedDisplay,{
    direction:"ltr",
    minHeight:"56px",
    width:"100%",
    padding:"12px",
    border:"1px solid #789",
    borderRadius:"8px",
    background:"#fff",
    boxSizing:"border-box",
    fontSize:"28px",
    lineHeight:"1.35",
    overflow:"visible",
    cursor:"pointer"
  });

  this.renderedDisplay.title="Click to edit";

  this.renderedDisplay.addEventListener("click",function(){
    self.show();
  });

  this.host.appendChild(this.renderedDisplay);
};
ChemicalKeyboard.prototype.buildEmbeddedWindow=function(root){
  apply(root,{
    position:"relative",
    width:"auto",
    maxWidth:"none",
    overflow:"visible"
  });

  apply(this.display,{
    minHeight:"68px",
    padding:"18px 12px 12px",
    lineHeight:"2.5",
    overflow:"visible"
  });

  this.host.appendChild(root);
};
ChemicalKeyboard.prototype.buildPopupWindow=function(root,t){
  var self=this,header,title,close;

  apply(root,{
    position:"fixed",
    left:(this.config.left!==undefined?this.config.left:Math.max(8,(window.innerWidth-430)/2))+"px",
    top:(this.config.top!==undefined?this.config.top:20)+"px",
    width:"430px",
    maxWidth:"calc(100vw - 16px)",
    maxHeight:"calc(100vh - 16px)",
    padding:"38px 10px 10px",
    border:"1px solid #8193a3",
    borderRadius:"9px",
    background:"#fff",
    boxShadow:"0 6px 24px rgba(0,0,0,.25)",
    overflow:"auto",
    zIndex:"10000"
  });

  header=node("div");
  this.popupHeader=header;

  apply(header,{
    position:"absolute",
    left:"0",
    top:"0",
    right:"0",
    height:"34px",
    padding:"7px 38px 6px 10px",
    borderBottom:"1px solid #c3ced8",
    borderRadius:"9px 9px 0 0",
    background:"#dce7f0",
    boxSizing:"border-box",
    cursor:"move",
    userSelect:"none",
    fontWeight:"bold"
  });

  title=node("span",this.config.title||t.keyboard||"Chemical keyboard");
  header.appendChild(title);

  close=node("button","×");
  close.type="button";
  close.title=t.close;

  apply(close,{
    position:"absolute",
    right:"5px",
    top:"3px",
    width:"28px",
    height:"28px",
    padding:"0",
    border:"0",
    borderRadius:"4px",
    background:"transparent",
    fontSize:"24px",
    lineHeight:"24px",
    cursor:"pointer"
  });

  close.addEventListener("pointerdown",function(e){
    e.stopPropagation();
  });

  close.addEventListener("click",function(){
    self.hide();
  });

  header.appendChild(close);
  root.appendChild(header);
  makeDraggable(root,header);
  document.body.appendChild(root);
};

  ChemicalKeyboard.prototype.setScript =
    function (s) {
      this.script = s;
      this.render();
    };

  ChemicalKeyboard.prototype.inSpeciesStart =
    function () {
      var i = this.cursor - 1;

      if (i < 0) {
        return true;
      }

      var c = this.chars[i].ch;

      return (
        c === "+" ||
        c === "→" ||
        c === "⇌"
      );
    };

ChemicalKeyboard.prototype.insertDigit=function(d){
  var s=this.script,p;

  if(s==="normal"&&!this.inSpeciesStart()&&this.cursor>0){
    p=this.chars[this.cursor-1];

    if(
      isUpper(p.ch)||
      isLower(p.ch)||
      p.ch===")"||
      p.script==="sub"&&isDigit(p.ch)
    ){
      s="sub";
      this.script="sub";
    }
  }

  this.insertText(d,s);
};

ChemicalKeyboard.prototype.insertText=function(s,script){
  var i,a=[];

  this.navigationScript=false;

  if(
    this.script==="sub"&&
    s.length&&
    isUpper(s.charAt(0))
  ){
    this.script="normal";
    script="normal";
  }

  script=script||this.script;

  for(i=0;i<s.length;i++){
    a.push(makeChar(s.charAt(i),script));
  }

  this.chars.splice.apply(
    this.chars,
    [this.cursor,0].concat(a)
  );

  this.cursor+=a.length;
  this.changed();
};
ChemicalKeyboard.prototype.insertSign =
  function (sign) {
    var mode =
      this.script === "sup"
        ? "sup"
        : "normal";

    this.insertText(sign, mode);

    if (mode === "sup") {
      this.script = "normal";
      this.render();
    }
  };

ChemicalKeyboard.prototype.insertState =
  function (state) {
    var text = "(" + state + ")";
    var stateId = this.groupId++;
    var chars = [];
    var i;

    for (i = 0; i < text.length; i++) {
      chars.push(
        makeChar(
          text.charAt(i),
          "sub",
          stateId,
          "state"
        )
      );
    }

    this.chars.splice.apply(
      this.chars,
      [this.cursor, 0].concat(chars)
    );

    this.cursor += chars.length;
    this.script = "normal";

    this.changed();
  };

  ChemicalKeyboard.prototype.insertPair =
    function () {
      var p = this.groupId++;

      this.chars.splice(
        this.cursor,
        0,
        makeChar("(", "normal", p),
        makeChar(")", "normal", p)
      );

      this.cursor++;
      this.changed();
    };

ChemicalKeyboard.prototype.move=function(d){
  var pair,kind,near;

  if(
    d<0&&
    this.cursor>0&&
    (
      this.chars[this.cursor-1].kind==="state"||
      this.chars[this.cursor-1].kind==="element"
    )
  ){
    pair=this.chars[this.cursor-1].pair;
    kind=this.chars[this.cursor-1].kind;

    while(
      this.cursor>0&&
      this.chars[this.cursor-1].kind===kind&&
      this.chars[this.cursor-1].pair===pair
    ){
      this.cursor--;
    }
  }else if(
    d>0&&
    this.cursor<this.chars.length&&
    (
      this.chars[this.cursor].kind==="state"||
      this.chars[this.cursor].kind==="element"
    )
  ){
    pair=this.chars[this.cursor].pair;
    kind=this.chars[this.cursor].kind;

    while(
      this.cursor<this.chars.length&&
      this.chars[this.cursor].kind===kind&&
      this.chars[this.cursor].pair===pair
    ){
      this.cursor++;
    }
  }else{
    this.cursor=Math.max(
      0,
      Math.min(this.chars.length,this.cursor+d)
    );
  }

  near=d<0 ? this.cursor>0?this.chars[this.cursor-1]:null
    :this.cursor<this.chars.length?this.chars[this.cursor]:null;

  if( near&& near.kind!=="state"&& (near.script==="sub"||near.script==="sup") ){
    this.script=near.script;
    this.navigationScript=true;
  }else{
    this.script="normal";
    this.navigationScript=false;
  }

  this.render();
};

ChemicalKeyboard.prototype.del=function(){
  var previous,pair,kind,start,end,removedScript,leftScript,rightScript,keepNavigationScript;

  if(this.cursor<=0){
    return;
  }

  previous=this.chars[this.cursor-1];
  removedScript=previous.script;
  keepNavigationScript= this.navigationScript&& this.script===removedScript;
  this.navigationScript=false;

  if(previous.kind==="state"||previous.kind==="element"){
    pair=previous.pair;
    kind=previous.kind;
    start=this.cursor-1;
    end=this.cursor;

    while(start>0&&this.chars[start-1].kind===kind&&this.chars[start-1].pair===pair){
      start--;
    }

    while(end<this.chars.length&&this.chars[end].kind===kind&&this.chars[end].pair===pair){
      end++;
    }

    this.chars.splice(start,end-start);
    this.cursor=start;
  }else{
    this.chars.splice(--this.cursor,1);
  }

  /*
   * Leave subscript or superscript mode when
   * its final character has been deleted.
   */
  if(removedScript==="sub"||removedScript==="sup"){
    leftScript=this.cursor>0?this.chars[this.cursor-1].script:null;
    rightScript=this.cursor<this.chars.length?this.chars[this.cursor].script:null;

    if(keepNavigationScript){
      this.script=removedScript;
    }else if(leftScript===removedScript||rightScript===removedScript){
      this.script=removedScript;
    }else{
      this.script="normal";
    }
  }

  this.changed();
};

ChemicalKeyboard.prototype.key =
  function (e) {
    var k = e.key;

    if (k === "Escape") {
      e.preventDefault();
      this.closeElementWindows();
      return;
    }

    if (
      this.mode !== "edit" ||
      e.ctrlKey ||
      e.metaKey ||
      e.altKey
    ) {
      return;
    }

    if (k === "ArrowLeft") {
      e.preventDefault();
      this.move(-1);
      return;
    }

    if (k === "ArrowRight") {
      e.preventDefault();
      this.move(1);
      return;
    }

    if (
      k === "Backspace" ||
      k === "Delete"
    ) {
      e.preventDefault();
      this.del();
      return;
    }

    if (k.length !== 1) {
      return;
    }

    if (isDigit(k)) {
      e.preventDefault();
      this.insertDigit(k);
      return;
    }

    if (k === "+" || k === "-") {
      e.preventDefault();
      this.insertSign(k);
      return;
    }

    if (
      isUpper(k) ||
      isLower(k)
    ) {
      e.preventDefault();

      this.insertText(
        k,
        this.script
      );
    }
  };

  ChemicalKeyboard.prototype.changed=function(){
  this.markElements();
  this.render();

  var r=this.result();

  if(typeof this.config.onChange==="function"){
    this.config.onChange(r);
  }
};

  ChemicalKeyboard.prototype.isHighlighted =
    function (i) {
      var j;
      var h;

      for ( j = 0; j < this.highlights.length; j++ ) {
        h = this.highlights[j];

        if ( i >= h.start && i < h.end ) {
          return ( h.color || "#ffd2d2" );
        }
      }

      return null;
    };
ChemicalKeyboard.prototype.syncRenderedDisplay=function(){
  var copy,carets,i;

  if(!this.renderedDisplay)return;

  copy=this.display.cloneNode(true);
  carets=copy.querySelectorAll("[data-chemical-caret='1']");

  for(i=0;i<carets.length;i++)carets[i].parentNode.removeChild(carets[i]);

  this.renderedDisplay.textContent="";

  while(copy.firstChild)this.renderedDisplay.appendChild(copy.firstChild);
};
ChemicalKeyboard.prototype.setCursorFromClick=function(e){
  var target=e.target,start,end,rect,after,script;

  while(target&&target!==this.display&&!target.hasAttribute("data-cursor-start")){
    target=target.parentNode;
  }

  if(!target||target===this.display){
    rect=this.display.getBoundingClientRect();
    this.cursor=e.clientX<rect.left+rect.width/2?0:this.chars.length;
    this.script="normal";
    this.render();
    this.root.focus();
    return;
  }

  start=Number(target.getAttribute("data-cursor-start"));
  end=Number(target.getAttribute("data-cursor-end"));
  script=target.getAttribute("data-script")||"normal";
  rect=target.getBoundingClientRect();
  after=e.clientX>=rect.left+rect.width/2;

  this.cursor=after?end:start;

  if(script==="sub"||script==="sup")this.script=script;
  else this.script="normal";

  this.render();
  this.root.focus();
};

ChemicalKeyboard.prototype.render=function(){
  var self=this,i=0,j,k,c,sp,color,pair,wrapper,subLine,supLine,lower,upper,states,width,cursorDrawn=false;
  function makeClickable(element,index){
    var item=self.chars[index],start=index,end=index+1,pair,kind;

    if(item.kind==="element"||item.kind==="state"){
      pair=item.pair;
      kind=item.kind;

      while(
        start>0&&
        self.chars[start-1].kind===kind&&
        self.chars[start-1].pair===pair
      ){
        start--;
      }

      while(
        end<self.chars.length&&
        self.chars[end].kind===kind&&
        self.chars[end].pair===pair
      ){
        end++;
      }
    }

    element.setAttribute("data-cursor-start",start);
    element.setAttribute("data-cursor-end",end);
    element.setAttribute("data-script",item.script||"normal");
    element.style.cursor="text";
  }
  function addCaret(parent,mode){
    var caret=node("span","");
    caret.setAttribute("data-chemical-caret","1");

    if(parent===self.display){
      apply(caret,{
        display:"inline-block",
        width:"2px",
        height:mode==="normal"?"1.15em":".65em",
        background:mode==="normal"?"#111":"#1769aa",
        verticalAlign:mode==="sub"?"-.42em":mode==="sup"?".62em":"-.18em"
      });
    }else{
      apply(caret,{
        display:"inline-block",
        width:"2px",
        height:"1em",
        background:"#1769aa",
        verticalAlign:"-.12em"
      });
    }
    parent.appendChild(caret);
    cursorDrawn=true;
  }

function appendCharacter(parent,index,mode){
  if(
    self.mode==="edit"&&
    self.cursor===index&&
    !cursorDrawn&&
    self.script===mode
  ){
    addCaret(parent,mode);
  }

  sp=node("span",self.chars[index].ch);
  makeClickable(sp,index);
  color=self.isHighlighted(index);

  if(color)sp.style.backgroundColor=color;

  parent.appendChild(sp);
}

  this.display.textContent="";

  while(i<this.chars.length){
    c=this.chars[i];

    /*
     * Collect an entire script cluster,
     * regardless of its entry order.
     */
    if(c.kind==="state"||c.script==="sub"||c.script==="sup"){
      lower=[];
      upper=[];
      states=[];
      j=i;
      if(
        self.mode==="edit"&&
        self.cursor===i&&
        !cursorDrawn&&
        self.script==="normal"
      ){
        addCaret(self.display,"normal");
      }
      while(j<this.chars.length){
        if(this.chars[j].kind==="state"){
          pair=this.chars[j].pair;

          while(j<this.chars.length&&this.chars[j].kind==="state"&&this.chars[j].pair===pair){
            states.push(j);
            j++;
          }

          continue;
        }

        if(this.chars[j].script==="sub"){
          lower.push(j);
          j++;
          continue;
        }

        if(this.chars[j].script==="sup"){
          upper.push(j);
          j++;
          continue;
        }

        break;
      }

      /*
       * The state is always appended after
       * the numeric index on the lower line.
       */
      for(k=0;k<states.length;k++){
        lower.push(states[k]);
      }

      width=Math.max(1,lower.length,upper.length)*.42;

      wrapper=node("span","");

      apply(wrapper,{
        display:"inline-block",
        position:"relative",
        width:width+"em",
        height:"1em",
        verticalAlign:"-.18em"
      });

      subLine=node("span","");
      supLine=node("span","");

      apply(subLine,{
        position:"absolute",
        left:"0",
        top:".62em",
        fontSize:"65%",
        lineHeight:"1",
        whiteSpace:"nowrap"
      });

      apply(supLine,{
        position:"absolute",
        left:"0",
        top:"-.25em",
        fontSize:"65%",
        lineHeight:"1",
        whiteSpace:"nowrap"
      });

      for(k=0;k<lower.length;k++){
        appendCharacter(subLine,lower[k],"sub");
      }

      for(k=0;k<upper.length;k++){
        appendCharacter(supLine,upper[k],"sup");
      }
      if(
        !cursorDrawn&&
        self.mode==="edit"&&
        self.script==="sub"&&
        lower.length&&
        self.cursor===lower[lower.length-1]+1
      ){
        addCaret(subLine,"sub");
      }

      if(
        !cursorDrawn&&
        self.mode==="edit"&&
        self.script==="sup"&&
        upper.length&&
        self.cursor===upper[upper.length-1]+1
      ){
        addCaret(supLine,"sup");
      }
      if(this.mode==="edit"&&this.cursor===j&&!cursorDrawn&&(this.script==="sub"||this.script==="sup")){
        addCaret(this.script==="sub"?subLine:supLine,this.script);
      }

      wrapper.appendChild(subLine);
      wrapper.appendChild(supLine);
      this.display.appendChild(wrapper);

      if(this.mode==="edit"&&this.cursor===j&&!cursorDrawn){
        addCaret(this.display,this.script);
      }

      i=j;
      continue;
    }

    if(this.mode==="edit"&&this.cursor===i&&!cursorDrawn){
      addCaret(this.display,this.script);
    }

    sp=node("span",c.ch);
    makeClickable(sp,i);
    color=this.isHighlighted(i);
    if(color){
      sp.style.backgroundColor=color;
    }

    this.display.appendChild(sp);
    i++;
  }

  if(this.mode==="edit"&&this.cursor===this.chars.length&&!cursorDrawn){
    addCaret(this.display,this.script);
  }
  this.syncRenderedDisplay();
};

ChemicalKeyboard.prototype.toLatex=function(){
  var out="",i,c,pair,stateText,subText,supText,j;

  for(i=0;i<this.chars.length;i++){
    c=this.chars[i];

    /*
     * Treat every consecutive combination of
     * index, state and charge as one cluster.
     */
    if(c.kind==="state"||c.script==="sub"||c.script==="sup"){
      subText="";
      supText="";
      stateText="";
      j=i;

      while(j<this.chars.length){
        if(this.chars[j].kind==="state"){
          pair=this.chars[j].pair;

          while(j<this.chars.length&&this.chars[j].kind==="state"&&this.chars[j].pair===pair){
            stateText+=this.chars[j].ch;
            j++;
          }

          continue;
        }

        if(this.chars[j].script==="sub"){
          subText+=this.chars[j].ch;
          j++;
          continue;
        }

        if(this.chars[j].script==="sup"){
          supText+=this.chars[j].ch;
          j++;
          continue;
        }

        break;
      }

      /*
       * Add a shared anchor whenever both a
       * lower and an upper component exist.
       */
      if((subText||stateText)&&supText){
        out+="{}";
      }

      if(subText||stateText){
        out+="_{\\scriptscriptstyle "+esc(subText);

        if(stateText){
          out+="\\mathrm{"+esc(stateText)+"}";
        }

        out+="}";
      }

      if(supText){
        out+="^{\\scriptscriptstyle "+esc(supText)+"}";
      }

      i=j-1;
      continue;
    }

    if(c.ch==="→"){
      out+="\\longrightarrow ";
    }else if(c.ch==="⇌"){
      out+="\\rightleftharpoons ";
    }else if(c.ch==="·"){
      out+="\\cdot ";
    }else{
      out+=esc(c.ch);
    }
  }

  return out;
};

  ChemicalKeyboard.prototype.getValue =
    function () {
      var s = "";
      var i;

      for (
        i = 0;
        i < this.chars.length;
        i++
      ) {
        s += this.chars[i].ch;
      }

      return s;
    };

  ChemicalKeyboard.prototype.getModel =
    function () {
      return JSON.parse(
        JSON.stringify(this.chars)
      );
    };

  ChemicalKeyboard.prototype.getAST =
    function () {
      return analyze(this.chars);
    };

  ChemicalKeyboard.prototype.result =
    function () {
      return {
        value: this.getValue(),
        latex: this.toLatex(),
        model: this.getModel(),
        ast: this.getAST()
      };
    };
ChemicalKeyboard.prototype.markStates =
    function () {
      var i;
      var len;
      var stateId;
      var j;

      for ( i = 0; i < this.chars.length; i++ ) {
        len = 0;

        if (
          i + 3 < this.chars.length &&
          this.chars[i].ch === "(" &&
          this.chars[i + 1].ch === "a" &&
          this.chars[i + 2].ch === "q" &&
          this.chars[i + 3].ch === ")"
        ) {
          len = 4;
        } else if ( i + 2 < this.chars.length && this.chars[i].ch === "(" &&
          (
            this.chars[i + 1].ch === "s" ||
            this.chars[i + 1].ch === "l" ||
            this.chars[i + 1].ch === "g"
          ) &&
          this.chars[i + 2].ch === ")"
        ) {
          len = 3;
        }

        if (len) {
          stateId = this.groupId++;

          for ( j = i; j < i + len; j++ ) {
            this.chars[j].script = "sub";
            this.chars[j].pair = stateId;
            this.chars[j].kind = "state";
          }

          i += len - 1;
        }
      }
    };
    ChemicalKeyboard.prototype.markElements=function(){
      var i,pair,symbol;

      for(i=0;i<this.chars.length;i++){
        if(this.chars[i].kind==="element"){
          this.chars[i].kind=null;
          this.chars[i].pair=null;
        }
      }

      for(i=0;i<this.chars.length-1;i++){
        symbol=this.chars[i].ch+this.chars[i+1].ch;

        if(this.chars[i].kind!=="state"&&this.chars[i+1].kind!=="state"&&this.chars[i].script==="normal"&&this.chars[i+1].script==="normal"&&isUpper(this.chars[i].ch)&&isLower(this.chars[i+1].ch)&&SET[symbol]){
          pair=this.groupId++;

          this.chars[i].kind="element";
          this.chars[i].pair=pair;

          this.chars[i+1].kind="element";
          this.chars[i+1].pair=pair;

          i++;
        }
      }
    };
  ChemicalKeyboard.prototype.setValue =
    function (v) {
      var i;
      var script = "normal";
      var ch;
      var s = String(v);
      var explicit = false;
      var prev;

      this.chars = [];

      if (Array.isArray(v)) {
        this.chars =
          JSON.parse(
            JSON.stringify(v)
          );
      } else {
        explicit = s.indexOf("_{") >= 0 || s.indexOf("^{") >= 0;

        for ( i = 0; i < s.length; i++ ) {
          ch = s.charAt(i);

          if ( ch === "_" && s.charAt(i + 1) === "{" ) {
            script = "sub";
            i++;
            continue;
          }

          if ( ch === "^" && s.charAt(i + 1) === "{" ) {
            script = "sup";
            i++;
            continue;
          }

          if (ch === "}") {
            script = "normal";
            continue;
          }

          if ( !explicit && isDigit(ch) && script === "normal" && this.chars.length ) {
            prev = this.chars[ this.chars.length - 1 ];

            if ( isUpper(prev.ch) || isLower(prev.ch) || prev.ch === ")" ) {
              script = "sub";
            }
          }

          if ( !explicit && script === "sub" && !isDigit(ch) ) {
            script = "normal";
          }

          this.chars.push(
            makeChar(ch, script)
          );
        }
      }

      this.markStates();
      this.markElements();
      this.cursor=this.chars.length;
      this.render();
      if ( typeof this.config.onChange === "function" ) {
        this.config.onChange( this.result() );
      }
    };

ChemicalKeyboard.prototype.setMode =
  function (m) {
    this.mode = m;

    this.panel.style.display = m === "edit" ? "block" : "none";

    this.display.tabIndex = m === "edit" ? 0 : -1;

    this.root.tabIndex = m === "edit" ? 0 : -1;

    this.render();
  };

  ChemicalKeyboard.prototype.setHighlights =
    function (h) {
      this.highlights = h || [];
      this.render();
    };

ChemicalKeyboard.prototype.makeCloseButton =
  function (panel) {
    var self = this;
    var b = node("button", "×");

    b.type = "button";

    b.title =
      (T[this.language] || T.en).close;

    apply(b, {
      position: "absolute",
      top: "5px",
      right: "6px",
      width: "26px",
      height: "26px",
      padding: "0",
      border: "0",
      borderRadius: "4px",
      background: "transparent",
      fontSize: "24px",
      lineHeight: "24px",
      cursor: "pointer"
    });

    b.addEventListener(
      "click",
      function () {
        panel.style.display = "none";
        self.display.focus();
      }
    );

    return b;
  };

ChemicalKeyboard.prototype.closeElementWindows =
  function () {
    this.elementPanel.style.display =
      "none";

    this.atomPanel.style.display =
      "none";
  };

  ChemicalKeyboard.prototype.makePopupHeader=function(panel,title){
  var h=node("div");

  apply(h,{
    position:"absolute",
    left:"0",
    top:"0",
    right:"0",
    height:"34px",
    padding:"8px 38px 6px 10px",
    borderBottom:"1px solid #c3ced8",
    borderRadius:"7px 7px 0 0",
    background:"#e8eff5",
    boxSizing:"border-box",
    cursor:"move",
    userSelect:"none",
    fontWeight:"bold",
    fontSize:"14px"
  });

  h.appendChild(node("span",title));
  h.appendChild(this.makeCloseButton(panel));
  panel.appendChild(h);
  makeDraggable(panel,h);
};

ChemicalKeyboard.prototype.openElements=function(){
  var self=this,t=T[this.language]||T.en,seen={},letters=[],grid,i,letter,b,columns;
   
    this.closeElementWindows();

    this.elementPanel.textContent="";
    this.makePopupHeader(this.elementPanel,t.elements);

    for (
      i = 0;
      i < SYMBOLS.length;
      i++
    ) {
      letter =
        SYMBOLS[i].charAt(0);

      if (!seen[letter]) {
        seen[letter] = true;
        letters.push(letter);
      }
    }

    letters.sort();

    columns = Math.ceil(letters.length / 4);

    grid = node("div");

    apply(grid, {
      display: "grid",
      gridTemplateColumns:
        "repeat(" +
        columns +
        ", minmax(34px, 1fr))",
      gridTemplateRows:
        "repeat(4, 38px)",
      gap: "5px"
    });

    for ( i = 0; i < letters.length; i++ ) {
      (function (initial) {
        b = node(
          "button",
          initial
        );

        b.type = "button";

        apply(b, {
          minWidth: "34px",
          height: "36px",
          padding: "0",
          border: "1px solid #8aa",
          borderRadius: "5px",
          background: "#fff",
          fontSize: "17px",
          cursor: "pointer"
        });

        b.addEventListener(
          "click",
          function () {
            self.showElementLetter(
              initial
            );
          }
        );

        grid.appendChild(b);
      })(letters[i]);
    }

    this.elementPanel.appendChild(grid);

    this.elementPanel.style.display =  "block";
    if(!this.elementPanel._positioned){
      this.elementPanel.style.left=Math.max(8,this.root.offsetLeft+24)+"px";
      this.elementPanel.style.top=Math.max(8,this.root.offsetTop+40)+"px";
      this.elementPanel._positioned=true;
    }
};
ChemicalKeyboard.prototype.show=function(){
  if(this.mode!=="edit")return;

  this.root.style.display="block";
  this.root.focus();
};
ChemicalKeyboard.prototype.hide=function(){
  this.closeElementWindows();
  this.root.style.display="none";
};

ChemicalKeyboard.prototype.showElementLetter =
  function (letter) {
    var self = this;

    var idx =
      this.language === "he"
        ? 1
        : this.language === "ar"
          ? 2
          : 0;

    var i;
    var s;
    var n;
    var b;

    this.atomPanel.style.display="block";

    if(!this.atomPanel._positioned){
      this.atomPanel.style.left=this.elementPanel.style.left;
      this.atomPanel.style.top=this.elementPanel.style.top;
      this.atomPanel._positioned=true;
    }

    this.elementPanel.style.display = "none";

    this.atomPanel.textContent="";
    this.makePopupHeader(this.atomPanel,letter);

    for (
      i = 0;
      i < SYMBOLS.length;
      i++
    ) {
      s = SYMBOLS[i];

      if (
        s.charAt(0) !== letter
      ) {
        continue;
      }

      if (NAMES[s]) {
        n = NAMES[s][idx];
      } else {
        n = s;
      }

      b = node(
        "button",
        s + " — " + n
      );

      b.type = "button";

      apply(b, {
        display: "block",
        width: "100%",
        textAlign: "left",
        margin: "2px 0",
        padding: "7px",
        border: "1px solid #ccd",
        borderRadius: "4px",
        background: "#fff",
        cursor: "pointer"
      });

      (function (sym, button) {
        button.addEventListener(
          "click",
          function () {
            self.insertText(
              sym,
              "normal"
            );

            self.atomPanel.style.display =
              "none";

            self.display.focus();
          }
        );
      })(s, b);

      this.atomPanel.appendChild(b);
       }

    this.atomPanel.style.display = "block";
  };
function renderComparisonResult(result,language,summary,details){
  var messages=ERROR_TEXT[language]||ERROR_TEXT.en;
  var i;

  summary.dir=language==="en"?"ltr":"rtl";
  details.dir=language==="en"?"ltr":"rtl";

  summary.style.textAlign=language==="en"?"left":"right";
  details.style.textAlign=language==="en"?"left":"right";

  summary.textContent="";
  details.textContent="";

  if(result.correct){
    summary.textContent=messages.correct;
    summary.style.color="#18742a";
    details.textContent=messages.equivalent;
    return;
  }

  summary.textContent=replaceTextToken(
    messages.issues,
    "count",
    result.errors.length
  );

  summary.style.color="#a12622";

  for(i=0;i<result.errors.length;i++){
    appendErrorMessage(
      details,
      result.errors[i],
      language,
      i+1
    );
  }

  if(window.MathJax&&MathJax.startup&&MathJax.startup.promise){
    MathJax.startup.promise.then(function(){
      if(MathJax.typesetClear) MathJax.typesetClear([details]);
      return MathJax.typesetPromise([details]);
    });
  }
}
  global.ChemicalKeyboard = ChemicalKeyboard;

  global.ChemicalGrammar={
  analyzeModel:analyze,
  analyzeValue:analyzeValue,
  canonicalize:canonicalizeValue,
  compare:compareChemicalAnswers,
  renderComparison:renderComparisonResult,
  elements:SYMBOLS.slice(),
  version:"1.1.0"
};
})(window);
