(function (global) {
  "use strict";

  var SYMBOLS = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og".split(" ");

  var SET = {};
  var uid = 1;

  var T={
  en:{
    studentAnswer:"Student answer",
    referenceAnswer:"Reference answer",
    keyboard:"Chemical keyboard",
    openKeyboard:"Open chemical keyboard",
    elements:"Elements",
    all:"All elements",
    normal:"Normal",
    sub:"Subscript",
    sup:"Superscript",
    state:"State",
    close:"Close",

    tipParentheses:"Insert a pair of parentheses",
    tipNormal:"Continue typing at the normal level",
    tipSub:"Enter an atom count as a subscript",
    tipSup:"Enter an ionic charge as a superscript",
    tipPlus:"Separates substances or indicates a positive charge",
    tipMinus:"Negative charge (active at the superscript level)",
    tipForward:"Insert a one-direction reaction arrow",
    tipEquilibrium:"Insert a reversible equilibrium arrow",
    tipDot:"Insert a centered dot, for example in a hydrate",
    tipInfo:"Add reaction conditions above the arrow",
    tipHeat:"Heating (Δ) above the arrow",
    tipLight:"Light (hν) above the arrow",
    tipComma:"Comma: separates conditions above the arrow, e.g. Fe, 450°C",
    tipCelsius:"Degrees Celsius (°C) above the arrow",
    tipKelvin:"Kelvin (K) above the arrow",
    tipSolid:"Solid state (s)",
    tipLiquid:"Liquid state (l)",
    tipGas:"Gas state (g)",
    tipAqueous:"Aqueous state (aq)",
    tipLeft:"Move the cursor one chemical unit to the left",
    tipRight:"Move the cursor one chemical unit to the right",
    tipDelete:"Delete the chemical unit to the left of the cursor",
    tipClear:"Clear the complete formula or equation",
    tipAllElements:"Open the complete list of chemical elements"
  },

  he:{
    studentAnswer:"תשובת התלמיד",
    referenceAnswer:"תשובת הייחוס",
    keyboard:"מקלדת כימית",
    openKeyboard:"פתיחת המקלדת הכימית",
    elements:"יסודות",
    all:"כל היסודות",
    normal:"רגיל",
    sub:"כתב תחתי",
    sup:"כתב עילי",
    state:"מצב צבירה",
    close:"סגירה",

    tipParentheses:"הוספת זוג סוגריים",
    tipNormal:"המשך הקלדה בגובה רגיל",
    tipSub:"הקלדת מספר האטומים ככתב תחתי",
    tipSup:"הקלדת מטען היון ככתב עילי",
    tipPlus:"הפרדה בין חומרים או מטען חיובי",
    tipMinus:"מטען שלילי (פעיל בכתב עילי)",
    tipForward:"הוספת חץ תגובה חד־כיווני",
    tipEquilibrium:"הוספת חץ של תגובה הפיכה או שיווי משקל",
    tipDot:"הוספת נקודה אמצעית, למשל בנוסחה של הידרט",
    tipInfo:"הוספת תנאי תגובה מעל החץ",
    tipHeat:"חימום (Δ) מעל החץ",
    tipLight:"אור (hν) מעל החץ",
    tipComma:"פסיק: מפריד בין תנאים מעל החץ, למשל Fe, 450°C",
    tipCelsius:"מעלות צלזיוס (°C) מעל החץ",
    tipKelvin:"קלווין (K) מעל החץ",
    tipSolid:" מצב צבירה מוצק (s)",
    tipLiquid:" מצב צבירה נוזל (l)",
    tipGas:" מצב צבירה גז (g)",
    tipAqueous:" מצב של תמיסה מימית (aq)",
    tipLeft:"הזזת הסמן יחידה כימית אחת שמאלה",
    tipRight:"הזזת הסמן יחידה כימית אחת ימינה",
    tipDelete:"מחיקת היחידה הכימית שמשמאל לסמן",
    tipClear:"מחיקת הנוסחה או המשוואה כולה",
    tipAllElements:"פתיחת הרשימה המלאה של היסודות הכימיים"
  },

  ar:{
    studentAnswer:"إجابة الطالب",
    referenceAnswer:"الإجابة المرجعية",
    keyboard:"لوحة مفاتيح كيميائية",
    openKeyboard:"فتح لوحة المفاتيح الكيميائية",
    elements:"العناصر",
    all:"كل العناصر",
    normal:"عادي",
    sub:"نص سفلي",
    sup:"نص علوي",
    state:"حالة المادة",
    close:"إغلاق",

    tipParentheses:"إضافة زوج من الأقواس",
    tipNormal:"متابعة الكتابة في المستوى العادي",
    tipSub:"إدخال عدد الذرات كنص سفلي",
    tipSup:"إدخال شحنة الأيون كنص علوي",
    tipPlus:"فصل بين المواد أو شحنة موجبة",
    tipMinus:"شحنة سالبة (فعّالة في النص العلوي)",
    tipForward:"إضافة سهم تفاعل أحادي الاتجاه",
    tipEquilibrium:"إضافة سهم تفاعل عكوس أو اتزان",
    tipDot:"إضافة نقطة وسطية، مثلًا في صيغة الهيدرات",
    tipInfo:"إضافة شروط التفاعل فوق السهم",
    tipHeat:"تسخين (Δ) فوق السهم",
    tipLight:"ضوء (hν) فوق السهم",
    tipComma:"فاصلة: تفصل بين الشروط فوق السهم، مثل Fe, 450°C",
    tipCelsius:"درجة مئوية (°C) فوق السهم",
    tipKelvin:"كلفن (K) فوق السهم",
    tipSolid:"إضافة الحالة الصلبة (s)",
    tipLiquid:"إضافة الحالة السائلة (l)",
    tipGas:"إضافة الحالة الغازية (g)",
    tipAqueous:"إضافة حالة المحلول المائي (aq)",
    tipLeft:"تحريك المؤشر وحدة كيميائية واحدة إلى اليسار",
    tipRight:"تحريك المؤشر وحدة كيميائية واحدة إلى اليمين",
    tipDelete:"حذف الوحدة الكيميائية الموجودة إلى يسار المؤشر",
    tipClear:"مسح الصيغة أو المعادلة كاملة",
    tipAllElements:"فتح القائمة الكاملة للعناصر الكيميائية"
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
    studentAnswer:"Student answer",
    referenceAnswer:"Reference answer",
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
    "missing-species":"{species} is required{onSide} but is missing.",
    "unexpected-species":"The reference answer does not contain {species}{onSide}.",
    "wrong-coefficient":"The coefficient of {species} is {actual}, but the reference coefficient is {expected}.",
    "scaled-coefficients":"The equation is balanced, but all the coefficients are {factor} times the reference coefficients.",
    "wrong-arrow":"The equation uses the wrong reaction arrow.",
    "wrong-structure":"{species} has the same atoms as {referenceSpecies} but a different structure; they are different substances (isomers).",
    "missing-condition":"The reaction conditions above the arrow are missing; the reference answer specifies {expectedCondition}.",
    "wrong-condition":"The reaction conditions above the arrow are {condition}, but the reference answer specifies {expectedCondition}.",
    "missing-structure":"The formula {species} does not show the structure of the substance; the reference answer writes it as {referenceSpecies}.",
    "wrong-dot-parts":"{species} has the same total atoms as {referenceSpecies}, but the parts joined by the dot are different. The number after the dot counts whole molecules: 5H₂O is five H₂O molecules.",
    "wrong-answer-type":"The expected answer is a chemical {expectedType}, but the student's answer is a chemical {actualType}.",
    "syntax-error":"The answer contains a syntax error: {parserCode}.",
    "missing-reference-answer":"No reference answer was supplied."
  },
  he:{
    studentAnswer:"תשובת התלמיד",
    referenceAnswer:"תשובת הייחוס",
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
    "missing-species":"החומר {species} צריך להופיע{onSide}, אך הוא חסר.",
    "unexpected-species":"תשובת הייחוס אינה מכילה את {species}{onSide}.",
    "wrong-coefficient":"המקדם של {species} הוא {actual}, אך המקדם בתשובת הייחוס הוא {expected}.",
    "scaled-coefficients":"המשוואה מאוזנת, אך כל המקדמים גדולים פי {factor} מהמקדמים בתשובת הייחוס.",
    "wrong-arrow":"במשוואה נעשה שימוש בחץ תגובה שגוי.",
    "wrong-structure":"ל־{species} יש אותם אטומים כמו ל־{referenceSpecies}, אך מבנה שונה; אלה חומרים שונים (איזומרים).",
    "missing-condition":"חסרים תנאי התגובה מעל החץ; בתשובת הייחוס מופיע: {expectedCondition}.",
    "wrong-condition":"תנאי התגובה מעל החץ הם {condition}, אך בתשובת הייחוס מופיע: {expectedCondition}.",
    "missing-structure":"הנוסחה {species} אינה מראה את מבנה החומר; בתשובת הייחוס הוא כתוב כך: {referenceSpecies}.",
    "wrong-dot-parts":"ל־{species} יש אותו מספר אטומים כולל כמו ל־{referenceSpecies}, אך החלקים המחוברים בנקודה שונים. המספר אחרי הנקודה סופר מולקולות שלמות: ⁦5H₂O⁩ הן חמש מולקולות ⁦H₂O⁩.",
    "wrong-answer-type":"נדרשת תשובה מסוג {expectedType}, אך תשובת התלמיד היא מסוג {actualType}.",
    "syntax-error":"התשובה מכילה שגיאת תחביר: {parserCode}.",
    "missing-reference-answer":"לא הוגדרה תשובת ייחוס."
  },
  ar:{
    studentAnswer:"إجابة الطالب",
    referenceAnswer:"الإجابة المرجعية",
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
    "missing-species":"يجب أن تظهر المادة {species}{onSide}، لكنها مفقودة.",
    "unexpected-species":"لا تحتوي الإجابة المرجعية على {species}{onSide}.",
    "wrong-coefficient":"معامل {species} هو {actual}، لكن المعامل المرجعي هو {expected}.",
    "scaled-coefficients":"المعادلة موزونة، لكن جميع المعاملات أكبر بـ {factor} مرات من معاملات الإجابة المرجعية.",
    "wrong-arrow":"تم استخدام سهم تفاعل غير صحيح.",
    "wrong-structure":"تحتوي {species} على نفس ذرات {referenceSpecies} لكن ببنية مختلفة؛ إنهما مادتان مختلفتان (متصاوغات).",
    "missing-condition":"شروط التفاعل فوق السهم مفقودة؛ تحدد الإجابة المرجعية: {expectedCondition}.",
    "wrong-condition":"شروط التفاعل فوق السهم هي {condition}، لكن الإجابة المرجعية تحدد: {expectedCondition}.",
    "missing-structure":"الصيغة {species} لا تُظهر بنية المادة؛ الإجابة المرجعية تكتبها هكذا: {referenceSpecies}.",
    "wrong-dot-parts":"تحتوي {species} على نفس العدد الكلي من الذرات مثل {referenceSpecies}، لكن الأجزاء المرتبطة بالنقطة مختلفة. الرقم بعد النقطة يعدّ جزيئات كاملة: ⁦5H₂O⁩ هي خمسة جزيئات ⁦H₂O⁩.",
    "wrong-answer-type":"نوع الإجابة المطلوب هو {expectedType}، لكن إجابة الطالب من النوع {actualType}.",
    "syntax-error":"تحتوي الإجابة على خطأ في الصياغة: {parserCode}.",
    "missing-reference-answer":"لم يتم تحديد إجابة مرجعية."
  }
};

/*
  Parser (syntax) codes caused by student input, shown inside
  the "syntax-error" message as {parserCode}.
  Codes that could only come from a bug stay untranslated (English code).
*/
var SYNTAX_TEXT={
  "unexpected-token":{
    en:"a symbol is in an unexpected place",
    he:"סימן מופיע במקום לא צפוי",
    ar:"يوجد رمز في مكان غير متوقع"
  },
  "missing-close-parenthesis":{
    en:"a closing parenthesis is missing",
    he:"חסרים סוגריים סוגרים",
    ar:"قوس الإغلاق مفقود"
  },
  "missing-species":{
    en:"a substance is missing before or after a + sign or the arrow",
    he:"חסר חומר לפני או אחרי סימן + או החץ",
    ar:"توجد مادة مفقودة قبل أو بعد علامة + أو السهم"
  },
  "multiple-arrows":{
    en:"the equation contains more than one reaction arrow",
    he:"במשוואה יש יותר מחץ תגובה אחד",
    ar:"تحتوي المعادلة على أكثر من سهم تفاعل واحد"
  },
  "invalid-charge":{
    en:"the ionic charge is not written correctly: write the number first and then the sign (+ or −)",
    he:"מטען היון אינו כתוב נכון: יש לכתוב קודם את המספר ואחריו את הסימן (+ או −)",
    ar:"شحنة الأيون غير مكتوبة بشكل صحيح: اكتب الرقم أولاً ثم الإشارة (+ أو −)"
  },
  "subscript-zero":{
    en:"a subscript cannot be 0",
    he:"המספר 0 אינו יכול להופיע ככתב תחתי",
    ar:"لا يمكن كتابة الرقم 0 كنص سفلي"
  },
};

/*
  Notes: remarks about notation that are NOT errors and do not
  affect "correct". {species} is rendered as a formula.
*/
var NOTE_TEXT={
  "notes-heading":{
    en:"Notes (not errors)",
    he:"הערות (אינן שגיאות)",
    ar:"ملاحظات (ليست أخطاء)"
  },
  "redundant-subscript-one":{
    en:"In {species}, the subscript 1 is redundant and should be omitted.",
    he:"ב־{species} הכתב התחתי 1 מיותר ויש להשמיט אותו.",
    ar:"في {species}، الرقم 1 في النص السفلي زائد ويجب حذفه."
  },
  "repeated-species":{
    en:"{species} appears more than once{onSide}; write it once with a combined coefficient.",
    he:"החומר {species} מופיע יותר מפעם אחת{onSide}; יש לכתוב אותו פעם אחת עם מקדם משותף.",
    ar:"تظهر المادة {species} أكثر من مرة{onSide}؛ اكتبها مرة واحدة بمعامل مجمّع."
  },
  "different-form":{
    en:"{species} has the correct atoms, but the reference answer writes it as {referenceSpecies}.",
    he:"ל־{species} יש את האטומים הנכונים, אך בתשובת הייחוס הוא כתוב כך: {referenceSpecies}.",
    ar:"تحتوي {species} على الذرات الصحيحة، لكن الإجابة المرجعية تكتبها هكذا: {referenceSpecies}."
  },
  "missing-dot":{
    en:"{species} has the correct atoms, but the reference answer writes it with a dot (·): {referenceSpecies}.",
    he:"ל־{species} יש את האטומים הנכונים, אך בתשובת הייחוס הוא כתוב עם נקודה (·): {referenceSpecies}.",
    ar:"تحتوي {species} على الذرات الصحيحة، لكن الإجابة المرجعية تكتبها مع نقطة (·): {referenceSpecies}."
  },
  "condition-not-required":{
    en:"The reaction conditions above the arrow ({condition}) are not required in this answer.",
    he:"תנאי התגובה מעל החץ ({condition}) אינם נדרשים בתשובה זו.",
    ar:"شروط التفاعل فوق السهم ({condition}) غير مطلوبة في هذه الإجابة."
  },
  "redundant-charge-one":{
    en:"In {species}, the number 1 in the charge is redundant and should be omitted.",
    he:"ב־{species} המספר 1 במטען מיותר ויש להשמיט אותו.",
    ar:"في {species}، الرقم 1 في الشحنة زائد ويجب حذفه."
  }
};

/* Grading feedback (rubric): score, penalty lines and their categories. */
var GRADE_TEXT={
  score:{en:"Score: {score}%",he:"ציון: {score}%",ar:"الدرجة: {score}%"},
  noPenalty:{en:"No penalty",he:"ללא הורדת נקודות",ar:"بدون خصم"},
  notCounted:{en:"Not counted (caused by the error above)",he:"לא נספר (נובע מהשגיאה שמעליה)",ar:"لا يُحتسب (ناتج عن الخطأ أعلاه)"},
  capped:{en:"maximum",he:"מקסימום",ar:"الحد الأقصى"},
  allMissing:{en:"no states at all",he:"אין מצבי צבירה כלל",ar:"لا توجد حالات للمادة إطلاقًا"},
  syntax:{en:"Syntax error",he:"שגיאת תחביר",ar:"خطأ في الصياغة"},
  answerType:{en:"Answer type",he:"סוג התשובה",ar:"نوع الإجابة"},
  unknownElement:{en:"Unknown element",he:"יסוד לא מוכר",ar:"عنصر غير معروف"},
  substances:{en:"Substances",he:"חומרים",ar:"المواد"},
  coefficients:{en:"Coefficients",he:"מקדמים",ar:"المعاملات"},
  scaledCoefficients:{en:"Multiplied coefficients",he:"מקדמים מוכפלים",ar:"معاملات مضاعفة"},
  balance:{en:"Balance",he:"איזון",ar:"الموازنة"},
  states:{en:"States",he:"מצבי צבירה",ar:"حالات المادة"},
  charges:{en:"Charges",he:"מטענים",ar:"الشحنات"},
  arrow:{en:"Reaction arrow",he:"חץ התגובה",ar:"سهم التفاعل"},
  conditions:{en:"Reaction conditions",he:"תנאי התגובה",ar:"شروط التفاعل"},
  notation:{en:"Notation",he:"כתיב",ar:"طريقة الكتابة"}
};

/* Answer types, used by "wrong-answer-type" as {expectedType} / {actualType}. */
var ANSWER_TYPE_TEXT={
  formula:{
    en:"formula",
    he:"נוסחה כימית",
    ar:"صيغة كيميائية"
  },
  equation:{
    en:"equation",
    he:"משוואה כימית",
    ar:"معادلة كيميائية"
  }
};

function localizedFromTable(table,key,language){
  var entry=table[key];

  if(!entry)return key;

  return entry[language]||entry.en||key;
}

function localizedState(state,language){
  var states={
    en:{s:"solid (s)",l:"liquid (l)",g:"gas (g)",aq:"aqueous (aq)"},
    he:{s:"מוצק (s)",l:"נוזל (l)",g:"גז (g)",aq:"תמיסה מימית (aq)"},
    ar:{s:"صلب (s)",l:"سائل (l)",g:"غاز (g)",aq:"محلول مائي (aq)"}
  };

  return state?(states[language]||states.en)[state]||state:"";
}

/*
  {onSide} in message templates: the complete "on the ... side" phrase,
  including its leading space. A formula has no sides, so "expression"
  becomes an empty string and the same template reads correctly
  for both formulas and equations.
*/
var SIDE_TEXT={
  left:{
    en:" on the left side",
    he:" בצד שמאל",
    ar:" في الطرف الأيسر"
  },
  right:{
    en:" on the right side",
    he:" בצד ימין",
    ar:" في الطرف الأيمن"
  },
  expression:{
    en:"",
    he:"",
    ar:""
  }
};

function localizedOnSide(side,language){
  var entry=SIDE_TEXT[side];

  if(!entry)return "";

  return entry[language]!==undefined?entry[language]:entry.en;
}
function formulaTextToLatex(text){
  var out="",i=0,symbol,digits,ch;

  text=String(text||"");

  while(i<text.length){
    ch=text.charAt(i);

    if(ch==="·"){
      out+="\\cdot ";
      i++;
      continue;
    }

    /* "^" starts the charge: everything after it is a superscript. */
    if(ch==="^"){
      out+="^{\\scriptscriptstyle "+text.substring(i+1)+"}";
      break;
    }

    /* Count after a closing parenthesis: (OH)2 */
    if(ch===")"){
      out+=")";
      i++;
      digits="";

      while(i<text.length&&isDigit(text.charAt(i))){
        digits+=text.charAt(i);
        i++;
      }

      if(digits)out+="_{\\scriptscriptstyle "+digits+"}";
      continue;
    }

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

      if(digits)out+="_{\\scriptscriptstyle "+digits+"}";
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
  var text=messages[error.code]||localizedFromTable(NOTE_TEXT,error.code,language);

  text=replaceTextToken(text,"count",error.count);
  text=replaceTextToken(text,"left",error.left);
  text=replaceTextToken(text,"right",error.right);
  text=replaceTextToken(text,"parserCode",localizedFromTable(SYNTAX_TEXT,error.parserCode,language));

  /*
   * Conditions are free English text; the Unicode isolate marks
   * (LRI ... PDI) keep "Fe, 450°C" in order inside Hebrew / Arabic.
   */
  if(error.condition!==undefined)text=replaceTextToken(text,"condition","⁦"+error.condition+"⁩");
  if(error.expectedCondition!==undefined)text=replaceTextToken(text,"expectedCondition","⁦"+error.expectedCondition+"⁩");
  text=replaceTextToken(text,"expectedType",localizedFromTable(ANSWER_TYPE_TEXT,error.expected,language));
  text=replaceTextToken(text,"actualType",localizedFromTable(ANSWER_TYPE_TEXT,error.actual,language));
  text=replaceTextToken(text,"onSide",localizedOnSide(error.side,language));
  text=replaceTextToken(text,"actualState",localizedState(error.actual,language));
  text=replaceTextToken(text,"expectedState",localizedState(error.expected,language));
  text=replaceTextToken(text,"actualCharge",chargeLabel(error.actual));
  text=replaceTextToken(text,"expectedCharge",chargeLabel(error.expected));
  text=replaceTextToken(text,"actual",error.actual);
  text=replaceTextToken(text,"expected",error.expected);
  text=replaceTextToken(text,"factor",error.factor);

  return text;
}

function appendErrorMessage(parent,error,language,index){
  var text=localizedErrorTemplate(error,language);
  var row=node("div");
  var tokens=["{species}","{referenceSpecies}","{atom}"];
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

    value=selectedToken==="{species}"?error.species:
      selectedToken==="{referenceSpecies}"?error.referenceSpecies:
      error.atom;
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


  var COMMON = ["H", "C", "N", "O", "Na", "Mg", "Al", "Cl", "K", "Ca", "Fe", "Cu", "Zn", "Ag"];

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
    function scriptIcon(mode){
      var icon=node("span");
      var normal=node("span");
      var sup=node("span");
      var sub=node("span");

      apply(icon,{
        display:"inline-block",
        position:"relative",
        width:"30px",
        height:"24px",
        verticalAlign:"middle",
        pointerEvents:"none"
      });

      function stylePart(part,left,top,width,height,active){
        apply(part,{
          position:"absolute",
          left:left+"px",
          top:top+"px",
          width:width+"px",
          height:height+"px",
          boxSizing:"border-box",
          border:"1px "+(active?"solid":"dashed")+" "+(active?"#8f9397":"#c7cbd0"),
          background:active?"#9da1a5":"transparent"
        });
      }

      stylePart(normal,1,4,13,17,mode==="normal");
      stylePart(sup,18,1,10,9,mode==="sup");
      stylePart(sub,18,14,10,9,mode==="sub");

      icon.appendChild(normal);
      icon.appendChild(sup);
      icon.appendChild(sub);

      return icon;
    }
    /* Icon for the conditions button: a dashed box above an arrow. */
    function conditionIcon(){
      var icon=node("span"),box=node("span"),arrow=node("span","→");

      apply(icon,{
        display:"inline-flex",
        flexDirection:"column",
        alignItems:"center",
        verticalAlign:"middle",
        lineHeight:"1",
        pointerEvents:"none"
      });

      apply(box,{
        display:"block",
        width:"16px",
        height:"9px",
        border:"1px dashed #555",
        boxSizing:"border-box"
      });

      apply(arrow,{
        display:"block",
        fontSize:"16px"
      });

      icon.appendChild(box);
      icon.appendChild(arrow);

      return icon;
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

      if (isUpper(s) && i + 1 < chars.length && isLower(chars[i + 1].ch) && chars[i + 1].script === script) {
        s += chars[i + 1].ch;
        i++;
      } else if (isDigit(s)) {
        while (i + 1 < chars.length && isDigit(chars[i + 1].ch) && chars[i + 1].script === script) {
          s += chars[++i].ch;
        }
      } else if (isLower(s)) {
        while (i + 1 < chars.length && isLower(chars[i + 1].ch) && chars[i + 1].script === script) {
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
    var notes = [];

    /*
     * stop: null  - the whole formula
     *       ")"   - inside parentheses (the ")" is consumed)
     *       "·"   - one part after a dot; ends before the next dot
     */
    function group(stop) {
      var arr = [];

      while (i < to) {
        var x = tokens[i];

        if (stop === "·" && x.text === "·" && x.script === "normal") {
          return arr;
        }

        if (x.text === stop && x.script === "normal") {
          i++;
          return arr;
        }

        /*
         * Dot of a hydrate / addition compound: CuSO4·5H2O.
         * The optional number after the dot multiplies only the next part,
         * which is stored as a group: CuSO4 + (H2O)5.
         */
        if (x.text === "·" && x.script === "normal" && stop !== ")") {
          var dotStart = x.start;
          var multiplier = 1;
          var multiplierRange = null;
          var part;

          i++;

          if (i < to && tokens[i].script === "normal" && isDigits(tokens[i].text)) {
            multiplier = Number(tokens[i].text);
            multiplierRange = [tokens[i].start, tokens[i].end];
            i++;
          }

          part = group("·");

          if (!part.length) {
            errors.push({ code: "missing-species", range: [x.start, x.end] });
          }

          arr.push({
            type: "group",
            hydrate: true,
            children: part,
            count: multiplier,
            countRange: multiplierRange,
            range: [dotStart, i ? tokens[i - 1].end : x.end]
          });

          continue;
        }

        if (x.text === "(" && x.script === "normal") {
          var st = x.start;
          var children;
          var count = 1;
          var groupCountRange = null;

          i++;
          children = group(")");

          if (i < to && tokens[i].script === "sub" && isDigits(tokens[i].text)) {
            count = Number(tokens[i].text);
            groupCountRange = [tokens[i].start,tokens[i].end];

            if (count === 0) {
              errors.push({
                code: "subscript-zero",
                range: groupCountRange.slice()
              });
            }

            if (count === 1) {
              notes.push({
                code: "redundant-subscript-one",
                range: groupCountRange.slice()
              });
            }

            i++;
          }

          arr.push({
            type: "group",
            children: children,
            count: count,
            countRange: groupCountRange,
            range: [st, i ? tokens[i - 1].end : x.end]
          });

          continue;
        }

        if (isUpper(x.text.charAt(0)) && x.script === "normal") {
          var count2 = 1;
          var el = x.text;
          var st2 = x.start;
          var countRange2 = null;

          i++;

          if (!SET[el]) {
            errors.push({
              code: "unknown-element",
              range: [x.start, x.end],
              value: el
            });
          }

          if (i < to && tokens[i].script === "sub" && isDigits(tokens[i].text)) {
            count2 = Number(tokens[i].text);
            countRange2 = [tokens[i].start,tokens[i].end];

            if (count2 === 0) {
              errors.push({
                code: "subscript-zero",
                range: countRange2.slice()
              });
            }

            /*
             * Subscript 1 is accepted: it is redundant (IUPAC omits it)
             * but not chemically wrong, and it is also the first digit
             * while typing 10-19. It is reported as a note, not an error.
             */
            if (count2 === 1) {
              notes.push({
                code: "redundant-subscript-one",
                range: countRange2.slice()
              });
            }

            i++;
          }

          arr.push({
            type: "element",
            symbol: el,
            count: count2,
            symbolRange:[x.start,x.end],
            countRange:countRange2,
            range: [st2, i ? tokens[i - 1].end : x.end]
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

      if (stop === ")") {
        errors.push({
          code: "missing-close-parenthesis",
          range: [charsLength(tokens), charsLength(tokens)]
        });
      }

      return arr;
    }

    items = group(null);

    return {
      items: items,
      errors: errors,
      notes: notes,
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
        map[it.symbol] = (map[it.symbol] || 0) + it.count * mult;
      } else {
        composition(it.children, map, mult * it.count);
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
    var notes = [];
    var formulaEnd = to;
    var coefficientRange = null;
    var stateRange = null;
    var chargeRange = null;

    if (i < to && tokens[i].script === "normal" && isDigits(tokens[i].text)) {
      coefficient = Number(tokens[i].text);
      coefficientRange = [tokens[i].start,tokens[i].end];
      i++;
    }

    if (
      to - i >= 3 &&
      tokens[to - 3].text === "(" &&
      tokens[to - 3].script === "sub" &&
      tokens[to - 2].script === "sub" &&
      (
        tokens[to - 2].text === "s" ||
        tokens[to - 2].text === "l" || tokens[to - 2].text === "g" || tokens[to - 2].text === "aq"
      ) &&
      tokens[to - 1].text === ")" && tokens[to - 1].script === "sub"
    ) {
      state = tokens[to - 2].text;
      stateRange = [tokens[to-3].start,tokens[to-1].end];
      formulaEnd = to - 3;
    }

    var chargeStart = formulaEnd;
    var j = formulaEnd - 1;
    var chargeText = "";

    while (j >= i && tokens[j].script === "sup") {
      chargeStart = j;
      chargeText = tokens[j].text + chargeText;
      j--;
    }

    if (chargeText) {
      var sign = chargeText.charAt(chargeText.length - 1);

      var mag = chargeText.substring(0, chargeText.length - 1);

      if ((sign === "+" || sign === "−" || sign === "-") && (!mag || isDigits(mag))) {
        charge = (mag ? Number(mag) : 1) *
          (sign === "+" ? 1 : -1);

        /* "1+" / "1−": correct but redundant, reported as a note. */
        if (Number(mag) === 1) {
          notes.push({
            code: "redundant-charge-one",
            range: [tokens[chargeStart].start, tokens[formulaEnd - 1].end]
          });
        }
      } else {
        errors.push({
          code: "invalid-charge",
          range: [tokens[chargeStart].start, tokens[formulaEnd - 1].end]
        });
      }

      chargeRange = [tokens[chargeStart].start,tokens[formulaEnd-1].end];

      formulaEnd = chargeStart;
    }

    var p = parseFormulaTokens(tokens, i, formulaEnd);

    var speciesComposition = composition(p.items);
    var k;

    /*
     * Parts joined by a dot (CuSO4·5H2O): each part's atoms and multiplier,
     * sorted. "1*Cu:1,O:4,S:1|5*H:2,O:1". Null when there is no dot.
     * 5H2O (five molecules) and H10O5 (one molecule) give different keys.
     */
    /* hydrateParts: [{key, range}] - range covers the part only (not the dot), for highlighting. */
    var hydrateKey = null;
    var hydrateParts = null;
    var firstPart = [];
    var parts = [];
    var item, partStart;

    for (k = 0; k < p.items.length; k++) {
      item = p.items[k];

      if (item.hydrate) {
        partStart = item.countRange ? item.countRange[0] : item.children.length ? item.children[0].range[0] : item.range[0];
        parts.push({ key: item.count + "*" + compositionKey(composition(item.children)), range: [partStart, item.range[1]] });
      } else {
        firstPart.push(item);
      }
    }

    if (parts.length) {
      if (firstPart.length) {
        parts.push({
          key: "1*" + compositionKey(composition(firstPart)),
          range: [firstPart[0].range[0], firstPart[firstPart.length - 1].range[1]]
        });
      }

      hydrateParts = parts;
      hydrateKey = parts.map(function (x) { return x.key; }).sort().join("|");
    }

    /*
     * label:          the formula exactly as written (with charge), shown
     *                 in messages so the student can find it in the answer.
     * writtenFormula: the written order and brackets without charge and
     *                 without redundant subscript 1; used to compare the
     *                 written form (isomers / non-standard order).
     */
    var writtenLabel = "";
    var writtenFormula = "";

    for (k = i; k < formulaEnd; k++) {
      writtenLabel += tokens[k].text;

      if (!(tokens[k].script === "sub" && tokens[k].text === "1")) {
        writtenFormula += tokens[k].text;
      }
    }

    if (chargeText) {
      writtenLabel += "^" + chargeText;
    }

    errors = errors.concat(p.errors);
    notes = notes.concat(p.notes);

    for (k = 0; k < notes.length; k++) {
      notes[k].species = writtenLabel;
    }

    return {
      type: "species",
      coefficient: coefficient,
      formula: p.items,
      composition: speciesComposition,
      label: writtenLabel,
      writtenFormula: writtenFormula,
      hydrateKey: hydrateKey,
      hydrateParts: hydrateParts,
      charge: charge,
      state: state,
      coefficientRange:coefficientRange,
      formulaRange:i<formulaEnd?[tokens[i].start,tokens[formulaEnd-1].end]:null,
      chargeRange:chargeRange,
      stateRange:stateRange,
      range: [tokens[from].start, tokens[to - 1].end], errors: errors, notes: notes
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
    var notes = [];

    for (i = 0; i < tokens.length; i++) {
      if (tokens[i].script === "normal" && (tokens[i].text === "→" || tokens[i].text === "⇌")) {
        if (arrow >= 0) {
          errors.push({
            code: "multiple-arrows",
            range: [tokens[i].start, tokens[i].end]
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
        if (j < b && tokens[j].text === "(") {
          depth++;
        }

        if (j < b && tokens[j].text === ")") {
          depth--;
        }

        if (j === b || (depth === 0 && tokens[j].text === "+" && tokens[j].script === "normal")) {
          if (j === last) {
            errors.push({
              code: "missing-species",
              range: [j < b ? tokens[j].start : chars.length, j < b ? tokens[j].end : chars.length]
            });
          } else {
            var sp = parseSpecies(tokens, last, j);

            target.push(sp);
            errors = errors.concat(sp.errors);
            notes = notes.concat(sp.notes);
          }

          last = j + 1;
        }
      }
    }

    if (arrow < 0) {
      parseSide(0, tokens.length, left);
    } else {
      parseSide(0, arrow, left);

      parseSide(arrow + 1, tokens.length, right);
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
              range:[tokens[arrow].start,tokens[arrow].end],
              condition: conditionInfo(chars[tokens[arrow].start].condition)
            },

      range:[0,chars.length],
      errors: errors,
      notes: notes,          // style remarks, never affect validity
      valid: errors.length === 0
    };
  }
// ANALYZER
var VALUE_TOKENS=[
  {text:"\\rightleftharpoons",ch:"⇌"},
  {text:"\\longrightarrow",ch:"→"},
  {text:"\\mathrm{",ch:null},
  {text:"\\cdot",ch:"·"},
  {text:"<->",ch:"⇌"},
  {text:"->",ch:"→"},
  {text:"\\Delta",ch:"Δ"},
  {text:"\\nu",ch:"ν"}
];

function isArrowChar(ch){
  return ch==="→"||ch==="⇌";
}

/*
  Reaction conditions above an arrow, written after the arrow in brackets:
  "→[MnO_{2}]", "->[Δ]", "⇌[Fe, 450°C]". The content is free text
  (English only) with optional _{ } / ^{ }; "hν" is kept as one symbol.
*/
function conditionFromValue(text){
  var chars=modelFromValue(text),out=[],i,c;

  for(i=0;i<chars.length;i++){
    c=chars[i];

    if(c.ch==="h"&&i+1<chars.length&&chars[i+1].ch==="ν"){
      out.push(makeChar("hν","normal",null,"symbol"));
      i++;
      continue;
    }

    out.push(makeChar(c.ch,c.script==="sup"?"sup":c.script==="sub"&&c.kind!=="state"?"sub":"normal"));
  }

  return out;
}

/*
  Condition of an arrow for analysis, or null when there is none
  (or the placeholder is open but empty).
  key: comparison key - spaces removed, comma-separated parts sorted,
  so "Fe, 450°C" equals "450°C,Fe". Case is kept (Co vs CO).
*/
function conditionInfo(condition){
  var text=conditionText(condition),parts,i;

  if(!text.replace(/\s+/g,""))return null;

  parts=text.split(",");

  for(i=0;i<parts.length;i++)parts[i]=parts[i].replace(/\s+/g,"");

  parts=parts.filter(function(p){return p!=="";}).sort();

  return {
    text:text.replace(/^\s+|\s+$/g,""),
    key:parts.join(",")
  };
}

/* Plain text of a condition, e.g. "MnO2" or "Fe, 450°C". */
function conditionText(condition){
  var s="",i;

  for(i=0;i<(condition||[]).length;i++)s+=condition[i].ch;

  return s;
}

function matchValueToken(s,i){
  var k;

  for(k=0;k<VALUE_TOKENS.length;k++){
    if(s.substring(i,i+VALUE_TOKENS[k].text.length)===VALUE_TOKENS[k].text){
      return VALUE_TOKENS[k];
    }
  }

  return null;
}

  function modelFromValue(value){
  var chars=[],s=String(value||""),script="normal",explicit=s.indexOf("_{")>=0||s.indexOf("^{")>=0;
  var i,ch,prev,stateId=1,j,len,insideMathRoman=0,token;

  /*
   * If the arrow just added (its last character is at position k)
   * is followed by "[...]", attach the condition to it.
   * Returns the position of the last character consumed.
   */
  function readCondition(k){
    var close,last=chars[chars.length-1];

    if(!last||!isArrowChar(last.ch)||s.charAt(k+1)!=="[")return k;

    close=s.indexOf("]",k+2);
    if(close<0)return k;

    last.condition=conditionFromValue(s.substring(k+2,close));
    return close;
  }

  for(i=0;i<s.length;i++){
    /*
     * Multi-character tokens. Longer tokens must come before
     * their prefixes ("<->" before "->").
     */
    token=matchValueToken(s,i);

    if(token){
      if(token.text==="\\mathrm{")insideMathRoman=1;
      else chars.push(makeChar(token.ch,"normal"));
      i+=token.text.length-1;
      i=readCondition(i);
      continue;
    }

    ch=s.charAt(i);

    if(isArrowChar(ch)){
      chars.push(makeChar(ch,"normal"));
      i=readCondition(i);
      continue;
    }

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

    if(i+3<chars.length&&chars[i].ch==="("&&chars[i+1].ch==="a"&&chars[i+2].ch==="q"&&chars[i+3].ch===")"){
      len=4;
    }else if(
      i+2<chars.length&&chars[i].ch==="("&&"slg".indexOf(chars[i+1].ch)>=0&&chars[i+2].ch===")"
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

/*
  A written formula shows structure (it is a condensed structural formula)
  when it has brackets or repeats an element: C2H5OH, CH3OCH3, Ca(OH)2.
  A plain molecular formula lists each element once (CO2, O2C, C2H6O)
  and only gives atom counts, so its written order means nothing.
*/
function isStructuralFormula(writtenFormula){
  var symbols,seen={},i;

  if(!writtenFormula)return false;
  if(writtenFormula.indexOf("(")>=0)return true;

  symbols=writtenFormula.match(/[A-Z][a-z]?/g)||[];

  for(i=0;i<symbols.length;i++){
    if(seen[symbols[i]])return true;
    seen[symbols[i]]=true;
  }

  return false;
}

/*
  Identity of a substance.
  Default: atom counts + charge, so H2O = OH2.
  options.distinguishIsomers: a structural formula is identified by its
  written form (order and brackets), so C2H5OH and CH3OCH3 differ.
  Plain molecular formulas are still compared by atom counts (CO2 = O2C).
*/
function speciesFormulaKey(species,options){
  if(options&&options.distinguishIsomers&&isStructuralFormula(species.writtenFormula)){
    return "W:"+species.writtenFormula+chargeKey(species.charge);
  }

  return compositionKey(species.composition)+chargeKey(species.charge);
}

function speciesKey(species,coefficient,options){
  return coefficient+"*"+speciesFormulaKey(species,options)+stateKey(species.state);
}

/* Name used in messages: the formula as written, or a composition-based fallback. */
function speciesLabel(species){
  return species.label||formulaLabel(species);
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

/* GCD of all (merged) coefficients of an equation; 1 for a formula. */
function equationCoefficientDivisor(type,left,right){
  var values=[],i,d=0;

  if(type!=="equation")return 1;

  for(i=0;i<left.length;i++)values.push(left[i].coefficient);
  for(i=0;i<right.length;i++)values.push(right[i].coefficient);
  for(i=0;i<values.length;i++)d=gcd(d,values[i]);

  return d||1;
}

/*
  Merge identical substances on one side: H2O+H2O -> 2H2O.
  Identical = same composition, charge and state, so H2O(l)+H2O(g)
  stay separate. Substances are never merged across the arrow.
  "occurrences" keeps the range of every copy for highlighting.
*/
function mergeSide(speciesList,options){
  var merged=[],byKey={},i,s,key,m;

  for(i=0;i<speciesList.length;i++){
    s=speciesList[i];
    key=speciesFormulaKey(s,options)+stateKey(s.state);

    if(Object.prototype.hasOwnProperty.call(byKey,key)){
      m=byKey[key];
      m.coefficient+=s.coefficient;
      m.atoms=m.atoms.concat(atomOccurrences(s.formula));
      if(s.range)m.occurrences.push(s.range.slice());
      continue;
    }

    m={
      coefficient:s.coefficient,
      composition:s.composition,
      label:s.label,
      writtenFormula:s.writtenFormula,
      hydrateKey:s.hydrateKey,
      hydrateParts:s.hydrateParts,
      charge:s.charge,
      state:s.state,
      range:s.range,
      coefficientRange:s.coefficientRange,
      formulaRange:s.formulaRange,
      chargeRange:s.chargeRange,
      stateRange:s.stateRange,
      atoms:atomOccurrences(s.formula),
      occurrences:s.range?[s.range.slice()]:[]
    };

    byKey[key]=m;
    merged.push(m);
  }

  return merged;
}

function atomOccurrences(items,mult,out){
  var i,item;
  mult=mult||1;out=out||[];
  for(i=0;i<items.length;i++){
    item=items[i];
    if(item.type==="element")out.push({symbol:item.symbol,count:item.count*mult,range:item.range?item.range.slice():null,symbolRange:item.symbolRange?item.symbolRange.slice():null,countRange:item.countRange?item.countRange.slice():null});
    else atomOccurrences(item.children,mult*item.count,out);
  }
  return out;
}

function canonicalSide(speciesList,divisor,options){
  var items=[],i,s,coefficient;

  for(i=0;i<speciesList.length;i++){
    s=speciesList[i];
    coefficient=s.coefficient/divisor;

    items.push({
    coefficient:coefficient,
    originalCoefficient:s.coefficient,
    composition:copy(s.composition),
    label:s.label,
    writtenFormula:s.writtenFormula,
    hydrateKey:s.hydrateKey,
    hydrateParts:s.hydrateParts,
    charge:s.charge,
    state:s.state,
    range:s.range?s.range.slice():null,
    coefficientRange:s.coefficientRange?s.coefficientRange.slice():null,
    formulaRange:s.formulaRange?s.formulaRange.slice():null,
    chargeRange:s.chargeRange?s.chargeRange.slice():null,
    stateRange:s.stateRange?s.stateRange.slice():null,
    atoms:s.atoms,
    occurrences:s.occurrences,
    formulaKey:speciesFormulaKey(s,options),
    atomSetKey:atomSetKey(s.composition),
    key:speciesKey(s,coefficient,options)
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

function canonicalizeAst(ast,options){
  var mergedLeft=mergeSide(ast.reactants,options);
  var mergedRight=mergeSide(ast.products,options);
  var divisor=equationCoefficientDivisor(ast.type,mergedLeft,mergedRight);
  var left=canonicalSide(mergedLeft,divisor,options);
  var right=canonicalSide(mergedRight,divisor,options);
  var leftKey=sideKey(left);
  var rightKey=sideKey(right);
  var directKey,reverseKey,key,arrowSymbol;

  if(ast.type!=="equation"){
    return {
      type:ast.type,
      arrow:null,
      arrowRange:null,
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
    arrowRange:ast.arrow.range?ast.arrow.range.slice():null,
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

function canonicalizeValue(value,options){
  var ast=value&&value.type?value:analyzeValue(value);

  return {
    ast:ast,
    canonical:canonicalizeAst(ast,options)
  };
}
function addError(errors,code,data){
  var error={code:code},k;

  data=data||{};

  for(k in data){
    if(Object.prototype.hasOwnProperty.call(data,k)){
      error[k]=data[k];
    }
  }

  errors.push(error);
}

/*
  Tags list[from..] with the substance they are about, for grading (see
  gradeComparison): speciesKey identifies the substance on its side,
  speciesAtoms lists its atoms (a wrong coefficient unbalances exactly these).
*/
function stampSpecies(list,from,species,side){
  var i;

  for(i=from;i<list.length;i++){
    list[i].speciesKey=side+":"+speciesLabel(species);
    list[i].speciesAtoms=sortedKeys(species.composition);
  }
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

function feedbackTarget(range,part){return range?{start:range[0],end:range[1],part:part}:null;}
function oneTarget(range,part){var target=feedbackTarget(range,part);return target?[target]:[];}
function atomTargets(species,atom,preferCount){
  var targets=[],i,item,range;
  for(i=0;i<species.atoms.length;i++)if(species.atoms[i].symbol===atom){item=species.atoms[i];range=preferCount&&item.countRange?item.countRange:item.symbolRange||item.range;if(range)targets.push(feedbackTarget(range,preferCount&&item.countRange?"count":"atom"));}
  return targets;
}
function astAtomTargets(ast,atom){
  var targets=[],sides=[ast.reactants,ast.products],a,i,j,items,item;
  for(a=0;a<sides.length;a++)for(i=0;i<sides[a].length;i++){items=atomOccurrences(sides[a][i].formula);for(j=0;j<items.length;j++){item=items[j];if(item.symbol===atom&&item.symbolRange)targets.push(feedbackTarget(item.symbolRange,"atom"));}}
  return targets;
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
          studentRanges:answerName==="student"?oneTarget(error.range,"atom"):[],
          referenceRanges:answerName==="reference"?oneTarget(error.range,"atom"):[]
        }
      );
    }else if(error.code!=="unknown-element"){
      addError(
        errors,
        "syntax-error",
        {
          answer:answerName,
          parserCode:error.code,
          value:error.value,
          studentRanges:answerName==="student"?oneTarget(error.range,"syntax"):[],
          referenceRanges:answerName==="reference"?oneTarget(error.range,"syntax"):[]
        }
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
        species:speciesLabel(student),
        expected:reference.state,
        actual:null,
        studentRanges:oneTarget(student.formulaRange||student.range,"species"),
        referenceRanges:oneTarget(reference.stateRange,"state")
      }
    );

    return;
  }

  if(!reference.state){
    addError(
      errors,
      "unexpected-state",
      {
        side:side,
        species:speciesLabel(student),
        expected:null,
        actual:student.state,
        studentRanges:oneTarget(student.stateRange||student.range,"state"),
        referenceRanges:[]
      }
    );

    return;
  }

  addError(
    errors,
    "wrong-state",
    {
      side:side,
      species:speciesLabel(student),
      expected:reference.state,
      actual:student.state,
      studentRanges:oneTarget(student.stateRange||student.range,"state"),
      referenceRanges:oneTarget(reference.stateRange||reference.range,"state")
    }
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
          species:speciesLabel(student),
          atom:atom,
          expected:expected,
          actual:actual,
          studentRanges:atomTargets(student,atom,true),
          referenceRanges:atomTargets(reference,atom,true)
        }
      );
    }
  }
}

function findSpeciesMatch(studentSide,referenceSpecies,used){
  var i;

  /* First preference: same composition and same charge. */
  for(i=0;i<studentSide.length;i++){
    if(!used[i]&&studentSide[i].formulaKey===referenceSpecies.formulaKey){
      return i;
    }
  }

  /* Second preference: same composition, even if the charge is different. */
  for(i=0;i<studentSide.length;i++){
    if(!used[i]&&compositionKey(studentSide[i].composition)===compositionKey(referenceSpecies.composition)){
      return i;
    }
  }

  /* Third preference: same collection of atoms, but possibly wrong counts. */
  for(i=0;i<studentSide.length;i++){
    if(!used[i]&&studentSide[i].atomSetKey===referenceSpecies.atomSetKey){
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
  var species=speciesLabel(student);

  if(student.charge===reference.charge)return;

  if(!student.charge&&reference.charge){
    addError(
      errors,
      "missing-charge",
      {
        side:side,
        species:species,
        expected:reference.charge,
        actual:student.charge,
        studentRanges:oneTarget(student.formulaRange||student.range,"species"),
        referenceRanges:oneTarget(reference.chargeRange,"charge")
      }
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
        actual:student.charge,
        studentRanges:oneTarget(student.chargeRange||student.range,"charge"),
        referenceRanges:[]
      }
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
      actual:student.charge,
      studentRanges:oneTarget(student.chargeRange||student.range,"charge"),
      referenceRanges:oneTarget(reference.chargeRange||reference.range,"charge")
    }
  );
}


function compareSide(studentSide,referenceSide,side,errors,pairs){
  var used=[],i,index,student,reference,from;

  for(i=0;i<referenceSide.length;i++){
    reference=referenceSide[i];
    index=findSpeciesMatch(studentSide,reference,used);
    from=errors.length;

    if(index<0){
      addError(
        errors,
        "missing-species",
        {
          side:side,
          species:speciesLabel(reference),
          expected:reference.coefficient,
          actual:0,
          studentRanges:[],
          referenceRanges:oneTarget(reference.range,"species")
        }
      );
      stampSpecies(errors,from,reference,side);

      continue;
    }

    used[index]=true;
    student=studentSide[index];

    compareAtomCounts(student,reference,side,errors);
    compareCharges(student,reference,side,errors);
    compareStates(student,reference,side,errors);
    stampSpecies(errors,from,student,side);

    pairs.push({student:student,reference:reference,side:side});
  }

  for(i=0;i<studentSide.length;i++){
    if(!used[i]){
      from=errors.length;
      addError(
        errors,
        "unexpected-species",
        {
          side:side,
          species:speciesLabel(studentSide[i]),
          expected:0,
          actual:studentSide[i].coefficient,
          studentRanges:oneTarget(studentSide[i].range,"species"),
          referenceRanges:[]
        }
      );
      stampSpecies(errors,from,studentSide[i],side);
    }
  }
}
/*
  Coefficients are judged for the whole equation:
  if every matched species has the same reduced coefficient
  (e.g. 4H2+2O2→4H2O vs 2H2+O2→2H2O), the answer is proportional.
  When all typed coefficients are the same whole-number multiple of the
  reference, that is one error, "scaled-coefficients" (balanced, but not
  the reference amounts). Otherwise the coefficients the student actually
  typed are compared, so the message shows the student's numbers
  and points at the species that really differs.
*/
function compareCoefficients(pairs,errors){
  var i,pair,proportional=true,factor=null,ratio,from;

  for(i=0;i<pairs.length;i++){
    if(pairs[i].student.coefficient!==pairs[i].reference.coefficient){
      proportional=false;
      break;
    }
  }

  if(proportional){
    for(i=0;i<pairs.length;i++){
      ratio=pairs[i].student.originalCoefficient/pairs[i].reference.originalCoefficient;

      if(factor===null)factor=ratio;
      else if(ratio!==factor){
        factor=null;
        break;
      }
    }

    if(factor===null||factor===1)return;

    /* a fraction of the reference amounts is judged as wrong coefficients (below) */
    if(Math.floor(factor)===factor){
      addError(errors,"scaled-coefficients",{
        factor:factor,
        studentRanges:pairs.map(function(p){return feedbackTarget(p.student.coefficientRange||p.student.formulaRange||p.student.range,"coefficient");}).filter(Boolean),
        referenceRanges:pairs.map(function(p){return feedbackTarget(p.reference.coefficientRange||p.reference.formulaRange||p.reference.range,"coefficient");}).filter(Boolean)
      });

      return;
    }
  }

  for(i=0;i<pairs.length;i++){
    pair=pairs[i];
    from=errors.length;

    if(pair.student.originalCoefficient!==pair.reference.originalCoefficient){
      addError(
        errors,
        "wrong-coefficient",
        {
          side:pair.side,
          species:speciesLabel(pair.student),
          expected:pair.reference.originalCoefficient,
          actual:pair.student.originalCoefficient,
          studentRanges:oneTarget(pair.student.coefficientRange||pair.student.formulaRange||pair.student.range,"coefficient"),
          referenceRanges:oneTarget(pair.reference.coefficientRange||pair.reference.formulaRange||pair.reference.range,"coefficient")
        }
      );
      stampSpecies(errors,from,pair.student,pair.side);
    }
  }
}
/*
  Matched substances with the same atoms and charge but a different
  written form (order or brackets): H2O / OH2, C2H5OH / CH3OCH3.

  Default: the answer is correct, a note shows the reference's form.

  options.distinguishIsomers, decided by which side shows structure:
    reference structural, student structural  -> error "wrong-structure"
                                                  (different isomer)
    reference structural, student molecular   -> error "missing-structure"
                                                  (C2H6O does not say which isomer)
    reference molecular                       -> note "different-form"
                                                  (the reference does not specify an isomer, CO2 / O2C)
*/
function compareWrittenForms(pairs,errors,notes,options){
  var i,pair,student,reference,code,isError;

  for(i=0;i<pairs.length;i++){
    pair=pairs[i];
    student=pair.student;
    reference=pair.reference;

    if(
      student.writtenFormula===undefined||
      reference.writtenFormula===undefined||
      student.writtenFormula===reference.writtenFormula||
      compositionKey(student.composition)!==compositionKey(reference.composition)||student.charge!==reference.charge
    ){
      continue;
    }

    code="different-form";

    /*
     * The reference writes a hydrate / addition compound with a dot and the
     * student has the same atoms without it: always a note, never an error
     * (also when distinguishIsomers is on).
     */
    if(reference.writtenFormula.indexOf("·")>=0&&student.writtenFormula.indexOf("·")<0){
      code="missing-dot";
    }else if(reference.hydrateKey&&student.hydrateKey&&reference.hydrateKey!==student.hydrateKey){
      /*
       * Both use a dot but the parts differ: CuSO4·H10O5 vs CuSO4·5H2O.
       * Same total atoms, but 5H2O is five water molecules: an error.
       */
      code="wrong-dot-parts";
    }else if(options&&options.distinguishIsomers&&isStructuralFormula(reference.writtenFormula)){
      code=isStructuralFormula(student.writtenFormula)?"wrong-structure":"missing-structure";
    }

    /* A different structure (isomer mode) or different dot parts are errors; other forms are notes. */
    isError=code==="wrong-structure"||code==="missing-structure"||code==="wrong-dot-parts";

    addError(
      isError?errors:notes,
      code,
      {
        side:pair.side,
        species:speciesLabel(student),
        referenceSpecies:speciesLabel(reference),
        studentRanges:code==="wrong-dot-parts"
          ?unmatchedPartTargets(student.hydrateParts,reference.hydrateParts)
          :oneTarget(student.formulaRange||student.range,isError?"species":"note"),
        referenceRanges:code==="wrong-dot-parts"
          ?unmatchedPartTargets(reference.hydrateParts,student.hydrateParts)
          :oneTarget(reference.formulaRange||reference.range,"species")
      }
    );
    if(isError)stampSpecies(errors,errors.length-1,student,pair.side);
  }
}

/*
  Highlight targets for the dot parts of "parts" that have no equal part
  in "other" (each part of "other" matches once): for CuSO4·H10O5 against
  CuSO4·5H2O only H10O5 is highlighted, CuSO4 is correct.
*/
function unmatchedPartTargets(parts,other){
  var used=[],targets=[],i,j,found;

  for(i=0;i<parts.length;i++){
    found=false;

    for(j=0;j<other.length;j++){
      if(!used[j]&&other[j].key===parts[i].key){
        used[j]=true;
        found=true;
        break;
      }
    }

    if(!found)targets.push(feedbackTarget(parts[i].range,"species"));
  }

  return targets;
}
/*
  Reaction conditions above the arrow (equations only).
    reference has none, student has some -> note (not required)
    reference has some, student has none -> error "missing-condition"
    both, different                      -> error "wrong-condition"
*/
function compareConditions(studentAst,referenceAst,errors,notes){
  var student,reference,studentRanges,referenceRanges;

  if(studentAst.type!=="equation"||referenceAst.type!=="equation")return;

  student=studentAst.arrow.condition;
  reference=referenceAst.arrow.condition;
  studentRanges=oneTarget(studentAst.arrow.range,"condition");
  referenceRanges=oneTarget(referenceAst.arrow.range,"condition");

  if(!reference){
    if(student){
      addError(notes,"condition-not-required",{
        condition:student.text,
        studentRanges:studentRanges,
        referenceRanges:[]
      });
    }

    return;
  }

  if(!student){
    addError(errors,"missing-condition",{
      expectedCondition:reference.text,
      studentRanges:studentRanges,
      referenceRanges:referenceRanges
    });

    return;
  }

  if(student.key!==reference.key){
    addError(errors,"wrong-condition",{
      condition:student.text,
      expectedCondition:reference.text,
      studentRanges:studentRanges,
      referenceRanges:referenceRanges
    });
  }
}
function addRepeatedSpeciesNotes(notes,side,sideName,language){
  var i,j,item,note,targets;

  for(i=0;i<side.length;i++){
    item=side[i];

    if(!item.occurrences||item.occurrences.length<2)continue;

    targets=[];

    for(j=0;j<item.occurrences.length;j++){
      targets.push(feedbackTarget(item.occurrences[j],"note"));
    }

    note={
      code:"repeated-species",
      side:sideName,
      species:speciesLabel(item),
      studentRanges:targets,
      referenceRanges:[]
    };

    note.description=localizedErrorDescription(note,language);
    notes.push(note);
  }
}
function localizedErrorDescription(error,language){
  var text=localizedErrorTemplate(error,language);

  text=replaceTextToken(text,"species",error.species||"");
  text=replaceTextToken(text,"referenceSpecies",error.referenceSpecies||"");
  text=replaceTextToken(text,"atom",error.atom||"");

  return text;
}
function comparisonHighlights(result,answer){
  var highlights=[],errors=result&&result.errors?result.errors:[],field=answer==="reference"?"referenceRanges":"studentRanges",i,j,error,target,color;
  for(i=0;i<errors.length;i++){
    error=errors[i];color=answer==="reference"?"#cfe8ff":error.code==="unbalanced-atom"?"#ffe49c":"#ffb9b9";for(j=0;j<(error[field]||[]).length;j++){target=error[field][j];if(target&&target.end>target.start)highlights.push({start:target.start,end:target.end,color:color,code:error.code,part:target.part});}}

  /*
   * Notes: soft grey, in both answers (e.g. missing-dot marks the hydrate
   * in the student's answer and its dotted form in the reference).
   * Errors come first, so they win on overlap.
   */
  if(result&&result.notes){
    for(i=0;i<result.notes.length;i++){
      for(j=0;j<(result.notes[i][field]||[]).length;j++){
        target=result.notes[i][field][j];
        if(target&&target.end>target.start)highlights.push({start:target.start,end:target.end,color:"#e2e6ea",code:result.notes[i].code,part:"note"});
      }
    }
  }

  return highlights;
}
ChemicalKeyboard.prototype.setComparisonFeedback=function(result,answer,value){
  if(value!==undefined)this.setValue(value);
  this.setHighlights(comparisonHighlights(result,answer));
};

/*
  options (optional):
    distinguishIsomers: true  - compare substances by their written form
                                (order and brackets), for questions whose
                                substances have isomers. Default false.
*/
function compareChemicalAnswers(studentValue,referenceValue,language,options){
  language=language==="he"||language==="ar"?language:"en";
  options=options||{};
  var studentAst=studentValue&&studentValue.type?studentValue:analyzeValue(studentValue);
  var referenceAst=referenceValue&&referenceValue.type?referenceValue:analyzeValue(referenceValue);
  var studentCanonical=canonicalizeAst(studentAst,options);
  var referenceCanonical=canonicalizeAst(referenceAst,options);
  var studentAtoms=collectAtoms(studentAst);
  var referenceAtoms=collectAtoms(referenceAst);
  var orientation,studentLeftTotals,studentRightTotals,atoms,keys,i,atom;
  var errors=[],pairs=[],formNotes=[];

  syntaxErrors(studentAst,errors,"student");
  syntaxErrors(referenceAst,errors,"reference");

  if(studentAst.type!==referenceAst.type){
    addError(
      errors,
      "wrong-answer-type",
      {
        expected:referenceAst.type,
        actual:studentAst.type,
        studentRanges:oneTarget(studentAst.range,"answer"),
        referenceRanges:oneTarget(referenceAst.range,"answer")
      }
    );
  }

  if(studentAst.type==="equation"&&referenceAst.type==="equation"&&studentCanonical.arrow!==referenceCanonical.arrow){
    addError(
      errors,
      "wrong-arrow",
      {
        expected:referenceCanonical.arrow,
        actual:studentCanonical.arrow,
        studentRanges:oneTarget(studentCanonical.arrowRange,"arrow"),
        referenceRanges:oneTarget(referenceCanonical.arrowRange,"arrow")
      }
    );
  }

  compareConditions(studentAst,referenceAst,errors,formNotes);

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
          actual:studentAtoms[atom],
          studentRanges:astAtomTargets(studentAst,atom),
          referenceRanges:[]
        }
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
          actual:0,
          studentRanges:[],
          referenceRanges:astAtomTargets(referenceAst,atom)
        }
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
        addError(errors,"unbalanced-atom",{
          atom:atom,
          left:studentLeftTotals[atom]||0,
          right:studentRightTotals[atom]||0,
          difference:(studentLeftTotals[atom]||0)-(studentRightTotals[atom]||0),
          studentRanges:astAtomTargets(studentAst,atom),
          referenceRanges:[]
        });
      }
    }
  }

  orientation=chooseOrientation(studentCanonical,referenceCanonical);

  compareSide(
    orientation.left,
    referenceCanonical.left,
    studentAst.type==="equation"?"left":"expression",
    errors,
    pairs
  );

  if(referenceAst.type==="equation"){
    compareSide(orientation.right, referenceCanonical.right, "right", errors, pairs);
  }

  compareCoefficients(pairs,errors);
  compareWrittenForms(pairs,errors,formNotes,options);
  for(i=0;i<errors.length;i++){
    errors[i].description=localizedErrorDescription(errors[i],language);
  }

  /* Notation notes on the student's answer; they never affect "correct". */
  var notes=[];

  for(i=0;i<(studentAst.notes||[]).length;i++){
    notes.push({
      code:studentAst.notes[i].code,
      species:studentAst.notes[i].species,
      studentRanges:oneTarget(studentAst.notes[i].range,"note"),
      referenceRanges:[]
    });
    notes[i].description=localizedErrorDescription(notes[i],language);
  }

  /* Identical substances written more than once on one side (merged above). */
  addRepeatedSpeciesNotes(notes,studentCanonical.left,studentAst.type==="equation"?"left":"expression",language);
  addRepeatedSpeciesNotes(notes,studentCanonical.right,"right",language);

  for(i=0;i<formNotes.length;i++){
    formNotes[i].description=localizedErrorDescription(formNotes[i],language);
    notes.push(formNotes[i]);
  }

  var result={
    notes:notes,
    correct:errors.length===0,
    language:language,
    studentCanonical:studentCanonical,
    referenceCanonical:referenceCanonical,
    reversed:orientation.reversed,
    errors:errors
  };

  if(options.rubric)gradeComparison(result,options.rubric);

  return result;
}

/* ============================================================
   GRADING WITH A TEACHER RUBRIC (design: RUBRIC-DESIGN.md)

   rubric: { category: rule, ..., codes: { "error-code": rule } }
     rule = 10                                  10% once
          = { each: 5, max: 15 }                5% per error, at most 15%
          = { each: 5, max: 15, allMissing: 20 } (states) 20% when no substance has a state
   A category not in the rubric costs nothing. A syntax error gives 0.

   One mistake = one penalty: an error caused by another counted error is
   not counted (SUPPRESSION_RULES). Errors and notes get an id; each error
   gets category, counted and (when not counted) suppressedBy = the id of
   the error that caused it. result.score = { total, penalties: [{ category,
   penalty, errorIds, capped }] } - a penalty is listed once for all its errors.
   ============================================================ */
var RUBRIC_CATEGORIES=["syntax","answerType","unknownElement","substances","coefficients","scaledCoefficients",
  "balance","states","charges","arrow","conditions","notation"];

var RUBRIC_CATEGORY_OF={
  "syntax-error":"syntax",
  "wrong-answer-type":"answerType",
  "unknown-element":"unknownElement",
  "missing-species":"substances","unexpected-species":"substances","wrong-atom-count":"substances",
  "wrong-structure":"substances","missing-structure":"substances","wrong-dot-parts":"substances",
  "unexpected-atom":"substances","missing-atom":"substances",
  "wrong-coefficient":"coefficients",
  "scaled-coefficients":"scaledCoefficients",
  "unbalanced-atom":"balance",
  "missing-state":"states","wrong-state":"states","unexpected-state":"states",
  "missing-charge":"charges","wrong-charge":"charges","unexpected-charge":"charges",
  "wrong-arrow":"arrow",
  "missing-condition":"conditions","wrong-condition":"conditions",
  "redundant-subscript-one":"notation","redundant-charge-one":"notation","repeated-species":"notation",
  "different-form":"notation","missing-dot":"notation","condition-not-required":"notation"
};

/* errors that say a student substance itself is wrong */
var WRONG_SPECIES_CODES=["wrong-atom-count","wrong-structure","missing-structure","wrong-dot-parts"];

/*
  Applied in order. An error with one of "codes" is not counted when an
  earlier-applied, counted error with one of "by" matches it:
    match "atom":         the error's atom is one of the other error's substance atoms
    match "species":      both are about the same substance on the same side
    match "containsAtom": the error's substance contains the other error's atom
*/
var SUPPRESSION_RULES=[
  /* one wrong substance = one error, even when several of its atom counts differ */
  {codes:["wrong-atom-count"],by:["wrong-atom-count"],match:"species"},
  /* a wrong substance: its coefficient, state and charge are not judged */
  {codes:["wrong-coefficient","missing-state","wrong-state","unexpected-state","missing-charge","wrong-charge","unexpected-charge"],
    by:WRONG_SPECIES_CODES,match:"species"},
  /* atoms missing, extra or unbalanced because of a missing, extra or wrong substance */
  {codes:["missing-atom","unexpected-atom","unbalanced-atom"],
    by:["missing-species","unexpected-species","unknown-element"].concat(WRONG_SPECIES_CODES),match:"atom"},
  /* one wrong coefficient unbalances all the atoms of its substance: one error */
  {codes:["unbalanced-atom"],by:["wrong-coefficient"],match:"atom"},
  /* an extra substance that contains an unknown element (Q2 typed for O2) */
  {codes:["unexpected-species"],by:["unknown-element"],match:"containsAtom"}
];

function suppressionMatches(error,other,match){
  if(match==="species")return !!error.speciesKey&&error.speciesKey===other.speciesKey;
  if(match==="containsAtom")return !!error.speciesAtoms&&error.speciesAtoms.indexOf(other.atom)>=0;

  if(!error.atom)return false;
  if(other.speciesAtoms)return other.speciesAtoms.indexOf(error.atom)>=0;
  return other.atom===error.atom;
}

function normalizeRubricRule(rule){
  if(typeof rule==="number")return {each:rule,max:rule};
  if(!rule||typeof rule!=="object")return null;

  return {
    each:Number(rule.each)||0,
    max:rule.max!==undefined?Number(rule.max):Infinity,
    allMissing:rule.allMissing!==undefined?Number(rule.allMissing):undefined
  };
}

function gradeComparison(result,rubric){
  var items=result.errors.concat(result.notes||[]),graded=[],fatal=null,lines={},order=[],penalties=[];
  var codes=rubric.codes||{},total=100,i,j,r,item,rule,other,key,line,penalty,allStatesMissing;

  for(i=0;i<items.length;i++){
    items[i].id=i+1;
    items[i].category=RUBRIC_CATEGORY_OF[items[i].code]||null;
    items[i].counted=true;
    delete items[i].suppressedBy;

    /* errors in the reference answer are the teacher's, not graded */
    if(items[i].answer==="reference"){
      items[i].counted=false;
      continue;
    }

    graded.push(items[i]);
  }

  /* a syntax error (score 0) or a wrong answer type stops the grading: nothing else counts */
  for(i=0;i<graded.length&&!fatal;i++)if(graded[i].code==="syntax-error")fatal=graded[i];
  for(i=0;i<graded.length&&!fatal;i++)if(graded[i].code==="wrong-answer-type")fatal=graded[i];

  if(fatal){
    for(i=0;i<graded.length;i++){
      if(graded[i]!==fatal&&!(fatal.code==="syntax-error"&&graded[i].code==="syntax-error")){
        graded[i].counted=false;
        graded[i].suppressedBy=fatal.id;
      }
    }
  }else{
    for(r=0;r<SUPPRESSION_RULES.length;r++){
      rule=SUPPRESSION_RULES[r];

      for(i=0;i<graded.length;i++){
        item=graded[i];
        if(!item.counted||rule.codes.indexOf(item.code)<0)continue;

        for(j=0;j<graded.length;j++){
          other=graded[j];

          if(other===item||!other.counted||rule.by.indexOf(other.code)<0)continue;
          /* among errors of the same code, only an earlier one hides a later one */
          if(other.code===item.code&&j>i)continue;

          if(suppressionMatches(item,other,rule.match)){
            item.counted=false;
            item.suppressedBy=other.id;
            break;
          }
        }
      }
    }
  }

  /* penalty lines: one per rubric category (or per code with its own rule) */
  for(i=0;i<graded.length;i++){
    item=graded[i];
    if(!item.counted||!item.category)continue;

    key=codes[item.code]!==undefined?item.code:item.category;

    if(!lines[key]){
      lines[key]={category:key,errorIds:[],count:0};
      order.push(key);
    }

    lines[key].errorIds.push(item.id);
    lines[key].count++;
  }

  allStatesMissing=!studentHasAnyState(result.studentCanonical);

  for(i=0;i<order.length;i++){
    line=lines[order[i]];

    if(line.category==="syntax"){
      penalties.push({category:"syntax",penalty:100,errorIds:line.errorIds,capped:false});
      continue;
    }

    rule=normalizeRubricRule(codes[line.category]!==undefined?codes[line.category]:rubric[line.category]);
    if(!rule)continue;

    if(line.category==="states"&&rule.allMissing!==undefined&&allStatesMissing){
      penalties.push({category:"states",penalty:rule.allMissing,errorIds:line.errorIds,capped:false,allMissing:true});
      continue;
    }

    penalty=rule.each*line.count;
    penalties.push({category:line.category,penalty:Math.min(penalty,rule.max),errorIds:line.errorIds,capped:penalty>rule.max});
  }

  penalties.sort(function(a,b){return rubricCategoryRank(a.category)-rubricCategoryRank(b.category);});

  for(i=0;i<penalties.length;i++)total-=penalties[i].penalty;

  result.score={
    total:Math.max(0,Math.round(total*100)/100),
    penalties:penalties.filter(function(p){return p.penalty>0;})
  };

  return result;
}

function rubricCategoryRank(category){
  var index=RUBRIC_CATEGORIES.indexOf(category);
  return index<0?RUBRIC_CATEGORIES.length:index;
}

/* true when at least one substance in the student's answer has a state */
function studentHasAnyState(canonical){
  var sides,a,i;

  if(!canonical)return false;

  sides=[canonical.left||[],canonical.right||[]];

  for(a=0;a<sides.length;a++){
    for(i=0;i<sides[a].length;i++)if(sides[a][i].state)return true;
  }

  return false;
}

/* Comparison options taken from the keyboard configuration. */
ChemicalKeyboard.prototype.compareOptions=function(){
  return {
    distinguishIsomers:this.config.distinguishIsomers===true,
    rubric:this.config.rubric||null
  };
};

/* The grading rubric (see gradeComparison); null = no grading. */
ChemicalKeyboard.prototype.setRubric=function(rubric){
  this.config.rubric=rubric||null;
};

ChemicalKeyboard.prototype.canonicalize=function(){
  return canonicalizeAst(this.getAST(),this.compareOptions());
};

ChemicalKeyboard.prototype.compare=function(referenceAnswer){
  var reference=referenceAnswer!==undefined
    ?referenceAnswer
    :this.correctAnswer;

  if(reference===null||reference===undefined){
    var missingResult={
      correct:false,
      language:this.language,
      studentCanonical:this.canonicalize(),
      referenceCanonical:null,
      reversed:false,
      errors:[{
        code:"missing-reference-answer",studentRanges:[],referenceRanges:[]
      }]
    };
    missingResult.errors[0].description=localizedErrorDescription(missingResult.errors[0],this.language);
    return missingResult;
  }

  return compareChemicalAnswers(this.getAST(),reference,this.language,this.compareOptions());
};

ChemicalKeyboard.prototype.setCorrectAnswer=function(value){
  this.correctAnswer=value;
};

//  CONSTRUCTOR
/*
 * config.conditions: true (default) shows the reaction-condition (process) keys - the arrow with the
 * condition placeholder, Δ, hν, °C, K; false leaves them out.
 */

  function ChemicalKeyboard(config) {
    this.config = copy(config || {});
    this.correctAnswer=this.config.correctAnswer!==undefined?this.config.correctAnswer:null;
    this.language = this.config.language || "en";
    this.mode = this.config.mode || "edit";

    this.chars = [];
    this.cursor = 0;
    this.script = "normal";

    this.highlights = this.config.highlights || [];
    this.navigationScript=false;
    this.cond = null;          // condition being edited (see REACTION CONDITIONS)
    this.groupId = 1;

    this.host = this.config.divId
        ? document.getElementById(this.config.divId)
        : null;

    if (!this.host) {
      this.host = node("div");
      document.body.appendChild(this.host);
    }

    this.build();

    this.setValue(this.config.value || "");

    if (this.mode === "edit") {
      this.display.tabIndex = 0;
    }
  }

ChemicalKeyboard.prototype.build=function(){
  var self=this,t=T[this.language]||T.en,root=node("div"),
  operatorsRow,statesRow,lowerRow,digitsPanel,digitsGrid,navigationRow,atomsPanel,
  atomsGrid,common,digits,i;

  function removeButtonFocus(button){
    button.tabIndex=-1;
    button.style.outline="none";

    button.addEventListener("pointerdown",function(e){
      e.preventDefault();
    });

    button.addEventListener("mousedown",function(e){
      e.preventDefault();
    });

    button.addEventListener("click",function(){
      button.blur();

      setTimeout(function(){
        self.display.focus();
      },0);
    });
  }
  /*
   * No title bar here: in edit mode buildPopupWindow adds the draggable
   * header with its close button; read-only keyboards are part of the
   * page (feedback), so they have no title bar, close button or dragging.
   */
  /*
   * Formulas are always written left to right, and left-aligned: direction and text-align are set
   * here, because in a right-to-left page (Moodle in Hebrew or Arabic) both are inherited as rtl/right.
   */
  apply(root,{
    fontFamily:"Arial,sans-serif",
    direction:"ltr",
    textAlign:"left",
    maxWidth:"820px",
    boxSizing:"border-box"
  });

  this.display=node("div");

 apply(this.display,{
    direction:"ltr",
    textAlign:"left",
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
  b.setAttribute("aria-label",title||label);
  apply(b,{minWidth:"44px",height:"38px",fontSize:"18px",border:"1px solid #8aa",borderRadius:"5px",background:"#fff",cursor:"pointer"});
  if(extra)apply(b,extra);
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
  },t.tipParentheses);

  var normalButton=btn(operatorsRow,"",function(){
    self.setScript("normal");
  },t.tipNormal);

  var subButton=btn(operatorsRow,"",function(){
    self.setScript("sub");
  },t.tipSub);

  var supButton=btn(operatorsRow,"",function(){
    self.setScript("sup");
  },t.tipSup);

  normalButton.appendChild(scriptIcon("normal"));
  subButton.appendChild(scriptIcon("sub"));
  supButton.appendChild(scriptIcon("sup"));

  normalButton.setAttribute("aria-label",t.normal);
  subButton.setAttribute("aria-label",t.sub);
  supButton.setAttribute("aria-label",t.sup);

  removeButtonFocus(normalButton);
  removeButtonFocus(subButton);
  removeButtonFocus(supButton);

  this.scriptButtons={
    normal:normalButton,
    sub:subButton,
    sup:supButton
  };

  btn(operatorsRow,"+",function(){
    self.insertSign("+");
  },t.tipPlus);

  /* Minus: only a negative charge, so active only at the superscript level. */
  this.minusButton=btn(operatorsRow,"−",function(){
    self.insertSign("−");
  },t.tipMinus);

  btn(operatorsRow,"·",function(){
    self.insertText("·","normal");
  },t.tipDot);

  /* Comma: separates parts of the condition ("Fe, 450°C"); active only there. */
  this.commaButton=btn(operatorsRow,",",function(){
    if(self.cond)self.insertConditionChars([makeChar(",","normal")]);
  },t.tipComma);

  /*
   * Arrows and reaction conditions (the information above the arrow)
   */
  var arrowsRow=node("div");

  apply(arrowsRow,{
    display:"flex",
    flexWrap:"wrap",
    gap:"6px",
    marginBottom:"8px"
  });

  this.panel.appendChild(arrowsRow);

  btn(arrowsRow,"→",function(){
    self.insertText("→","normal");
  },t.tipForward);

  btn(arrowsRow,"⇌",function(){
    self.insertText("⇌","normal");
  },t.tipEquilibrium);

  /*
   * Reaction-condition (process) keys: the arrow with the condition placeholder, Δ, hν, °C, K.
   * config.conditions === false leaves them out (only the plain arrows remain).
   */
  if(this.config.conditions!==false){
    var infoButton=btn(arrowsRow,"",function(){
      self.openCondition();
    },t.tipInfo);

    infoButton.appendChild(conditionIcon());
    removeButtonFocus(infoButton);

    btn(arrowsRow,"Δ",function(){
      self.openCondition("Δ");
    },t.tipHeat);

    btn(arrowsRow,"hν",function(){
      self.openCondition("hν");
    },t.tipLight);

    /* Temperature units. Kelvin has no degree sign (SI): 450 K. */
    btn(arrowsRow,"°C",function(){
      self.openCondition("°C");
    },t.tipCelsius);

    btn(arrowsRow,"K",function(){
      self.openCondition(" K");
    },t.tipKelvin);
  }

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
  },t.tipSolid);

  btn(statesRow,"(l)",function(){
    self.insertState("l");
  },t.tipLiquid);

  btn(statesRow,"(g)",function(){
    self.insertState("g");
  },t.tipGas);

  btn(statesRow,"(aq)",function(){
    self.insertState("aq");
  },t.tipAqueous);

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
  },t.tipLeft,{minWidth:"0",width:"100%"});

  btn(navigationRow,"→|",function(){
    self.move(1);
  },t.tipRight,{minWidth:"0",width:"100%"});

  btn(navigationRow,"DEL",function(){
    self.del();
  },t.tipDelete,{minWidth:"0",width:"100%",fontSize:"14px"});

  btn(navigationRow,"AC",function(){
    self.chars=[];
    self.cursor=0;
    self.cond=null;
    self.script="normal";
    self.changed();
  },t.tipClear,{minWidth:"0",width:"100%",fontSize:"14px"});

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
  var nameIndex=this.language==="he"?1:this.language==="ar"?2:0;
  for(i=0;i<common.length;i++){
    (function(sym){
      var elementName=NAMES[sym]?NAMES[sym][nameIndex]:sym;
      var tooltip=sym+" — "+elementName;

      btn(
        atomsGrid,
        sym,
        function(){self.insertText(sym,"normal");},
        tooltip,
        {width:"100%"}
      );
    })(common[i]);
  }

  btn(
    atomsGrid,
    t.all,
    function(){self.openElements();},
    t.tipAllElements,
    {
      width:"100%",
      gridColumn:"1 / span 2",
      fontSize:"15px"
    }
  );

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
    function closePanelsOnEscape(e){
      if(e.key!=="Escape")return;

      e.preventDefault();
      e.stopPropagation();
      self.closeElementWindows();
      self.root.focus();
    }


  if(this.mode==="edit"){
    document.body.appendChild(this.elementPanel);
    document.body.appendChild(this.atomPanel);
    this.elementPanel.addEventListener("keydown",closePanelsOnEscape);
    this.atomPanel.addEventListener("keydown",closePanelsOnEscape);
    this.elementPanel.tabIndex=-1;
    this.atomPanel.tabIndex=-1;
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
  var self=this,t=T[this.language]||T.en;

  this.displayContainer=node("div");

  /* left to right and left-aligned also in a right-to-left page (see build) */
  apply(this.displayContainer,{
    display:"flex",
    direction:"ltr",
    textAlign:"left",
    alignItems:"stretch",
    gap:"8px",
    width:"100%"
  });

  this.renderedDisplay=node("div");
  /* MathJax processes this field even inside an element it is told to skip (tex2jax_ignore / mathjax_ignore) */
  this.renderedDisplay.className="tex2jax_process mathjax_process";

  apply(this.renderedDisplay,{
    direction:"ltr",
    textAlign:"left",
    minHeight:"56px",
    flex:"1 1 auto",
    minWidth:"0",
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

  this.renderedDisplay.title=t.openKeyboard;

  this.renderedDisplay.addEventListener("click",function(){
    self.show();
  });

  this.keyboardToggleButton=node("button","⌨");
  this.keyboardToggleButton.type="button";
  this.keyboardToggleButton.title=t.openKeyboard;
  this.keyboardToggleButton.setAttribute("aria-label",t.openKeyboard);

  apply(this.keyboardToggleButton,{
    flex:"0 0 42px",
    width:"42px",
    border:"1px solid #888",
    borderRadius:"6px",
    backgroundColor:"#fff",
    cursor:"pointer",
    fontSize:"20px"
  });

  this.keyboardToggleButton.addEventListener("click",function(event){
    event.preventDefault();
    event.stopPropagation();
    self.show();
  });

  this.displayContainer.appendChild(this.renderedDisplay);
  this.displayContainer.appendChild(this.keyboardToggleButton);
  this.host.appendChild(this.displayContainer);
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
  /*
   * Width fits the first panel row on one line:
   * 8 buttons x 44px + 7 gaps x 6px = 394px, plus padding and border.
   */
  var self=this,header,title,close,width=435;

  apply(root,{
    position:"fixed",
    left:(this.config.left!==undefined?this.config.left:Math.max(8,(window.innerWidth-width)/2))+"px",
    top:(this.config.top!==undefined?this.config.top:20)+"px",
    width:width+"px",
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

ChemicalKeyboard.prototype.setScript=function(s){
    this.script=s;
    this.render();
  };

/*
 * Mark the active script button (normal / sub / sup).
 * Called from render(), because the script level also changes
 * automatically (digit after an element, charge sign, arrows, click, DEL).
 * The ring uses box-shadow so the button size does not change.
 */
ChemicalKeyboard.prototype.updateScriptButtons=function(){
    var modes=["normal","sub","sup"],i,button,active;

    if(!this.scriptButtons)return;

    for(i=0;i<modes.length;i++){
      button=this.scriptButtons[modes[i]];
      active=modes[i]===this.script;

      // button.style.background=active?"#cfe3f5":"#fff";
      button.style.borderColor=active?"#1769aa":"#8aa";
      button.style.boxShadow=active?"0 0 0 2px #1769aa":"none";
      button.setAttribute("aria-pressed",active?"true":"false");
    }

    /* The comma only belongs in the condition above the arrow. */
    setButtonEnabled(this.commaButton,!!this.cond);

    /* The minus: a negative charge (superscript) or condition text (−78°C). */
    setButtonEnabled(this.minusButton,this.script==="sup"||!!this.cond);
  };

function setButtonEnabled(button,enabled){
  if(!button)return;

  button.disabled=!enabled;
  button.style.opacity=enabled?"1":".4";
  button.style.cursor=enabled?"pointer":"default";
}

  ChemicalKeyboard.prototype.inSpeciesStart = function () {
      var i = this.cursor - 1;

      if (i < 0) {
        return true;
      }

      var c = this.chars[i].ch;

      /* After "·" a number multiplies the next part (CuSO4·5H2O): normal level. */
      return (c === "+" || c === "→" || c === "⇌" || c === "·");
    };

/* ============================================================
   REACTION CONDITIONS (information above the arrow)

   The condition is stored on the arrow character itself:
   arrow.condition = null (none) or an array of chars (possibly empty
   while the placeholder is open). While editing it, this.cond is
   {arrow: index of the arrow in this.chars, pos: cursor inside it};
   otherwise this.cond is null. Only one arrow is allowed, so the
   condition can be added at any time.
   ============================================================ */

/* The arrow the condition belongs to: next to the cursor, else the first one. */
ChemicalKeyboard.prototype.findArrowIndex=function(){
  var i;

  if(this.cursor>0&&isArrowChar(this.chars[this.cursor-1].ch))return this.cursor-1;
  if(this.cursor<this.chars.length&&isArrowChar(this.chars[this.cursor].ch))return this.cursor;

  for(i=0;i<this.chars.length;i++){
    if(isArrowChar(this.chars[i].ch))return i;
  }

  return -1;
};

/*
 * Open (or continue) the condition above the arrow and put the cursor in it.
 * If the answer has no arrow yet, a "→" is inserted at the cursor first.
 * symbol: optional symbol to insert at once (Δ, hν, °C, K).
 */
ChemicalKeyboard.prototype.openCondition=function(symbol){
  var index,arrow;

  if(this.mode!=="edit")return;

  if(!this.cond){
    index=this.findArrowIndex();

    if(index<0){
      this.script="normal";
      this.insertText("→","normal");
      index=this.cursor-1;
    }

    arrow=this.chars[index];
    if(!arrow.condition)arrow.condition=[];

    this.cond={arrow:index,pos:arrow.condition.length};
    this.script="normal";
  }

  if(symbol){
    this.insertConditionChars([makeChar(symbol,"normal",null,"symbol")]);
    return;
  }

  this.changed();
};

ChemicalKeyboard.prototype.conditionChars=function(){
  return this.chars[this.cond.arrow].condition;
};

ChemicalKeyboard.prototype.insertConditionChars=function(items){
  var c=this.conditionChars();

  c.splice.apply(c,[this.cond.pos,0].concat(items));
  this.cond.pos+=items.length;
  this.changed();
};

/* Leave the condition; the cursor goes before (side<0) or after the arrow. */
ChemicalKeyboard.prototype.closeCondition=function(side){
  if(!this.cond)return;

  this.cursor=side<0?this.cond.arrow:this.cond.arrow+1;
  this.cond=null;
  this.script="normal";
};

ChemicalKeyboard.prototype.insertDigit=function(d){
  var s=this.script,p,c;

  if(this.cond){
    c=this.conditionChars();

    /* V2O5, H2O: a digit after a letter or ")" is a subscript. */
    if(s==="normal"&&this.cond.pos>0){
      p=c[this.cond.pos-1];

      if(isUpper(p.ch)||isLower(p.ch)||p.ch===")"||p.script==="sub"&&isDigit(p.ch)){
        s="sub";
        this.script="sub";
      }
    }

    this.insertText(d,s);
    return;
  }

  if(s==="normal"&&!this.inSpeciesStart()&&this.cursor>0){
    p=this.chars[this.cursor-1];

    if(isUpper(p.ch)||isLower(p.ch)||p.ch===")"||p.script==="sub"&&isDigit(p.ch)){
      s="sub";
      this.script="sub";
    }
  }

  this.insertText(d,s);
};

ChemicalKeyboard.prototype.insertText=function(s,script){
  var i,a=[];

  this.navigationScript=false;

  /*
   * A capital letter starts a new element symbol,
   * so it always returns to the normal level.
   */
  if((this.script==="sub"||this.script==="sup")&&s.length&&isUpper(s.charAt(0))){
    this.script="normal";
    script="normal";
  }

  script=script||this.script;

  /*
   * A dot or an arrow ends any subscript: the number after it is a
   * multiplier (CuSO4·5H2O) or a coefficient (→ 2H2O), at the normal level.
   */
  if(s==="·"||isArrowChar(s)){
    this.script="normal";
    script="normal";
  }

  for(i=0;i<s.length;i++){
    a.push(makeChar(s.charAt(i),script));
  }

  /* Inside the condition: no arrows; everything else goes into the condition. */
  if(this.cond){
    if(isArrowChar(s))return;
    this.insertConditionChars(a);
    return;
  }

  this.chars.splice.apply(this.chars, [this.cursor,0].concat(a));

  this.cursor+=a.length;
  this.changed();
};
ChemicalKeyboard.prototype.insertSign = function (sign) {
    /*
     * A minus is a negative charge (superscript) or part of the condition
     * text (−78°C); anywhere else in the formula it is ignored.
     */
    if ((sign === "−" || sign === "-") && this.script !== "sup" && !this.cond) return;

    var mode = this.script === "sup"
        ? "sup"
        : "normal";

    /*
     * A "+" between substances ends a subscript: in N2+3H2 the 3
     * after "+" is a coefficient, not a subscript.
     */
    if (mode === "normal") {
      this.script = "normal";
    }

    this.insertText(sign, mode);

    if (mode === "sup") {
      this.script = "normal";
      this.render();
    }
  };

ChemicalKeyboard.prototype.insertState = function (state) {
    if (this.cond) return;    // states do not belong in the condition

    var text = "(" + state + ")";
    var stateId = this.groupId++;
    var chars = [];
    var i;

    for (i = 0; i < text.length; i++) {
      chars.push(makeChar(text.charAt(i), "sub", stateId, "state"));
    }

    this.chars.splice.apply(this.chars, [this.cursor, 0].concat(chars));

    this.cursor += chars.length;
    this.script = "normal";

    this.changed();
  };

  ChemicalKeyboard.prototype.insertPair = function () {
      var p = this.groupId++;
      var c;

      if (this.cond) {
        c = this.conditionChars();
        c.splice(this.cond.pos, 0, makeChar("(", "normal"), makeChar(")", "normal"));
        this.cond.pos++;
        this.changed();
        return;
      }

      this.chars.splice(this.cursor, 0, makeChar("(", "normal", p), makeChar(")", "normal", p));

      this.cursor++;
      this.changed();
    };

ChemicalKeyboard.prototype.move=function(d){
  var pair,kind,near,c;

  /*
   * Navigation order around an arrow with a condition:
   * before the arrow -> inside the condition -> after the arrow.
   */
  if(this.cond){
    c=this.conditionChars();

    if(d<0){
      if(this.cond.pos>0)this.cond.pos--;
      else this.closeCondition(-1);
    }else{
      if(this.cond.pos<c.length)this.cond.pos++;
      else this.closeCondition(1);
    }

    if(this.cond){
      near=d<0?(this.cond.pos>0?c[this.cond.pos-1]:null):(this.cond.pos<c.length?c[this.cond.pos]:null);
      this.script=near&&(near.script==="sub"||near.script==="sup")?near.script:"normal";
    }

    this.render();
    return;
  }

  if(d>0&&this.cursor<this.chars.length&&this.chars[this.cursor].condition){
    this.cond={arrow:this.cursor,pos:0};
    this.script="normal";
    this.render();
    return;
  }

  if(d<0&&this.cursor>0&&this.chars[this.cursor-1].condition){
    this.cond={arrow:this.cursor-1,pos:this.chars[this.cursor-1].condition.length};
    this.script="normal";
    this.render();
    return;
  }

  if(d<0&&this.cursor>0&&(this.chars[this.cursor-1].kind==="state"||this.chars[this.cursor-1].kind==="element")){
    pair=this.chars[this.cursor-1].pair;
    kind=this.chars[this.cursor-1].kind;

    while(this.cursor>0&&this.chars[this.cursor-1].kind===kind&&this.chars[this.cursor-1].pair===pair){
      this.cursor--;
    }
  }else if(
    d>0&&
    this.cursor<this.chars.length&&(this.chars[this.cursor].kind==="state"||this.chars[this.cursor].kind==="element")
  ){
    pair=this.chars[this.cursor].pair;
    kind=this.chars[this.cursor].kind;

    while(this.cursor<this.chars.length&&this.chars[this.cursor].kind===kind&&this.chars[this.cursor].pair===pair){
      this.cursor++;
    }
  }else{
    this.cursor=Math.max(0, Math.min(this.chars.length,this.cursor+d));
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
  var previous,pair,kind,start,end,removedScript,leftScript,rightScript,keepNavigationScript,c;

  /*
   * Inside the condition: delete one character. When the condition
   * becomes (or already is) empty, the placeholder is removed and
   * the cursor goes after the arrow.
   */
  if(this.cond){
    c=this.conditionChars();

    if(this.cond.pos>0){
      c.splice(this.cond.pos-1,1);
      this.cond.pos--;
    }

    if(!c.length){
      this.chars[this.cond.arrow].condition=null;
      this.closeCondition(1);
    }

    this.changed();
    return;
  }

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

ChemicalKeyboard.prototype.key = function (e) {
    var k = e.key;

    if(k==="Enter"){
      e.preventDefault();
      e.stopPropagation();

      /* Enter inside the condition: finish it, continue after the arrow. */
      if(this.cond){
        this.closeCondition(1);
        this.render();
      }

      this.display.focus();
      return;
    }
    if (k === "Escape") {
      e.preventDefault();
      this.closeElementWindows();
      return;
    }

    if (this.mode !== "edit" || e.ctrlKey || e.metaKey || e.altKey) {
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

    if (k === "Backspace" || k === "Delete") {
      e.preventDefault();
      this.del();
      return;
    }
    if(k==="_"||k==="^"){
      e.preventDefault();
      this.navigationScript=false;
      this.setScript(k==="_"?"sub":"sup");
      return;
    }
    if (k.length !== 1) {
      return;
    }

    /*
     * Extra characters allowed only in the condition text:
     * "Fe, 450°C", "200 atm", "conc. H2SO4".
     */
    if (this.cond && " ,.°()%".indexOf(k) >= 0) {
      e.preventDefault();

      if (k === "(" || k === ")") this.insertText(k, "normal");
      else this.insertConditionChars([makeChar(k, "normal")]);

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

    if (isUpper(k) || isLower(k)) {
      e.preventDefault();

      /*
       * Lowercase letters only belong to element symbols at the
       * normal level. States (aq), (s)... are inserted by their buttons.
       */
      if (isLower(k) && this.script !== "normal") {
        return;
      }

      /*
       * In the formula a lowercase letter is only the second letter of a
       * symbol (C + a = Ca): it must follow a capital letter at the normal
       * level. "cA" or "Cla" are rejected. Condition text may contain words.
       */
      var prev = this.cursor > 0 ? this.chars[this.cursor - 1] : null;

      if (isLower(k) && !this.cond && !(prev && prev.script === "normal" && isUpper(prev.ch))) {
        return;
      }

      this.insertText(k, this.script);
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

  ChemicalKeyboard.prototype.isHighlighted = function (i) {
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
  var self=this,latex,revision;

  if(!this.renderedDisplay)return;

  latex=this.toLatex();
  this.renderRevision=(this.renderRevision||0)+1;
  revision=this.renderRevision;

  this.renderedDisplay.textContent="\\("+latex+"\\)";

  typesetMath(this.renderedDisplay,function(){
    /* MathJax 3 runs this later: skip an older version of the answer, write the current one */
    if(revision!==self.renderRevision)return false;
    self.renderedDisplay.textContent="\\("+self.toLatex()+"\\)";
    return true;
  });
};

/*
 * Typeset an element with the page's MathJax. The host page may load version 3 (startup.promise,
 * typesetPromise) or version 2 (Hub.Queue) - Moodle up to 4.x loads MathJax 2.7 - and while
 * MathJax is still loading neither exists yet; then MathJax typesets the page when it starts.
 * prepare (optional): runs just before typesetting (MathJax 3 only); false skips it.
 */
function typesetMath(element,prepare){
  var mj=window.MathJax;

  if(mj&&mj.startup&&mj.startup.promise&&mj.typesetPromise){
    mj.startup.promise.then(function(){
      if(mj.typesetClear)mj.typesetClear([element]);
      if(prepare&&prepare()===false)return;
      return mj.typesetPromise([element]);
    });
  }else if(mj&&mj.Hub&&mj.Hub.Queue){
    mj.Hub.Queue(["Typeset",mj.Hub,element]);
  }
}
ChemicalKeyboard.prototype.setCursorFromClick=function(e){
  var target=e.target,start,end,rect,after,script,conditionArrow;

  /* A click on the condition above an arrow puts the cursor at its end. */
  conditionArrow=target;

  while(conditionArrow&&conditionArrow!==this.display&&!conditionArrow.hasAttribute("data-condition-arrow")){
    conditionArrow=conditionArrow.parentNode;
  }

  if(conditionArrow&&conditionArrow!==this.display){
    start=Number(conditionArrow.getAttribute("data-condition-arrow"));

    if(this.chars[start]&&this.chars[start].condition){
      this.cond={arrow:start,pos:this.chars[start].condition.length};
      this.script="normal";
      this.render();
      this.root.focus();
      return;
    }
  }

  this.cond=null;

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
  /* While editing the condition, its caret is drawn by renderCondition only. */
  var self=this,i=0,j,k,c,sp,color,pair,wrapper,subLine,supLine,lower,upper,states,width,cursorDrawn=!!this.cond;
  function makeClickable(element,index){
    var item=self.chars[index],start=index,end=index+1,pair,kind;

    if(item.kind==="element"||item.kind==="state"){
      pair=item.pair;
      kind=item.kind;

      while(start>0&&self.chars[start-1].kind===kind&&self.chars[start-1].pair===pair){
        start--;
      }

      while(end<self.chars.length&&self.chars[end].kind===kind&&self.chars[end].pair===pair){
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
  if(self.mode==="edit"&&self.cursor===index&&!cursorDrawn&&self.script===mode){
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
      if(self.mode==="edit"&&self.cursor===i&&!cursorDrawn&&self.script==="normal"){
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
      if(!cursorDrawn&&self.mode==="edit"&&self.script==="sub"&&lower.length&&self.cursor===lower[lower.length-1]+1){
        addCaret(subLine,"sub");
      }

      if(!cursorDrawn&&self.mode==="edit"&&self.script==="sup"&&upper.length&&self.cursor===upper[upper.length-1]+1){
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

    /* Arrow with a condition (or an open placeholder): condition above the arrow. */
    if(c.condition){
      wrapper=node("span","");

      apply(wrapper,{
        display:"inline-flex",
        flexDirection:"column",
        alignItems:"center",
        verticalAlign:"middle",
        lineHeight:"1",
        margin:"0 .15em"
      });

      apply(sp,{display:"block",lineHeight:"1"});

      wrapper.appendChild(this.renderCondition(i,c.condition));
      wrapper.appendChild(sp);

      if(color)wrapper.style.backgroundColor=color;

      this.display.appendChild(wrapper);
      i++;
      continue;
    }

    if(color){
      sp.style.backgroundColor=color;
    }

    this.display.appendChild(sp);
    i++;
  }

  if(this.mode==="edit"&&this.cursor===this.chars.length&&!cursorDrawn){
    addCaret(this.display,this.script);
  }
  this.updateScriptButtons();
  this.syncRenderedDisplay();
};

/*
 * The condition line above an arrow (small text). An empty condition
 * is shown as a dashed placeholder box. Draws the caret when the
 * condition is being edited.
 */
ChemicalKeyboard.prototype.renderCondition=function(index,condition){
  var line=node("span",""),editing=this.mode==="edit"&&this.cond&&this.cond.arrow===index,k,ch;

  function caret(){
    var caretSpan=node("span","");

    caretSpan.setAttribute("data-chemical-caret","1");

    apply(caretSpan,{
      display:"inline-block",
      width:"2px",
      height:"1em",
      background:"#1769aa",
      verticalAlign:"-.12em"
    });

    line.appendChild(caretSpan);
  }

  line.setAttribute("data-condition-arrow",index);

  apply(line,{
    display:"block",
    minWidth:"1.6em",
    minHeight:"1.1em",
    padding:"0 2px",
    fontSize:"45%",
    lineHeight:"1.1",
    textAlign:"center",
    whiteSpace:"nowrap",
    boxSizing:"border-box",
    cursor:this.mode==="edit"?"text":"default",
    border:condition.length?"1px solid transparent":"1px dashed #1769aa",
    borderRadius:"3px",
    background:editing?"#eef5fc":"transparent"
  });

  for(k=0;k<condition.length;k++){
    if(editing&&this.cond.pos===k)caret();

    ch=node("span",condition[k].ch);

    if(condition[k].script==="sub"){
      apply(ch,{fontSize:"75%",verticalAlign:"sub"});
    }else if(condition[k].script==="sup"){
      apply(ch,{fontSize:"75%",verticalAlign:"super"});
    }

    line.appendChild(ch);
  }

  if(editing&&this.cond.pos===condition.length)caret();

  return line;
};

/* LaTeX of a condition: words in \mathrm, sub/sup groups, Δ, hν, °. */
function conditionToLatex(condition){
  var out="",i,c,run,script;

  for(i=0;i<condition.length;i++){
    c=condition[i];

    if(c.script==="sub"||c.script==="sup"){
      script=c.script;
      run="";

      while(i<condition.length&&condition[i].script===script){
        run+=esc(condition[i].ch);
        i++;
      }

      i--;
      out+=(script==="sub"?"_{":"^{")+run+"}";
      continue;
    }

    /* Consecutive letters form one upright word: \mathrm{MnO}, \mathrm{atm}. */
    if(isUpper(c.ch)||isLower(c.ch)){
      run="";

      while(i<condition.length&&condition[i].script==="normal"&&(isUpper(condition[i].ch)||isLower(condition[i].ch))){
        run+=condition[i].ch;
        i++;
      }

      i--;
      out+="\\mathrm{"+run+"}";
      continue;
    }

    if(c.ch==="Δ")out+="\\Delta ";
    else if(c.ch==="°C")out+="^{\\circ}\\mathrm{C}";
    else if(c.ch===" K")out+="\\ \\mathrm{K}";
    else if(c.ch==="hν")out+="h\\nu ";
    else if(c.ch==="ν")out+="\\nu ";
    else if(c.ch==="°")out+="^{\\circ}";
    else if(c.ch===" ")out+="\\ ";
    else out+=esc(c.ch);
  }

  return out;
}

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

    /* Arrow with a condition: \xrightarrow stretches under the text. */
    if(c.ch==="→"&&c.condition&&c.condition.length){
      out+="\\xrightarrow{"+conditionToLatex(c.condition)+"}";
    }else if(c.ch==="⇌"&&c.condition&&c.condition.length){
      out+="\\overset{"+conditionToLatex(c.condition)+"}{\\rightleftharpoons}";
    }else if(c.ch==="→"){
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

  ChemicalKeyboard.prototype.getValue = function () {
      var s = "";
      var i;

      for (i = 0; i < this.chars.length; i++) {
        s += this.chars[i].ch;

        /* Condition after its arrow, in the "→[...]" value form. */
        if (this.chars[i].condition && this.chars[i].condition.length) {
          s += "[" + conditionText(this.chars[i].condition) + "]";
        }
      }

      return s;
    };

  ChemicalKeyboard.prototype.getModel = function () {
      return JSON.parse(JSON.stringify(this.chars));
    };

  ChemicalKeyboard.prototype.getAST = function () {
      return analyze(this.chars);
    };

  ChemicalKeyboard.prototype.result = function () {
      return {
        value: this.getValue(),
        latex: this.toLatex(),
        model: this.getModel(),
        ast: this.getAST()
      };
    };
ChemicalKeyboard.prototype.markStates = function () {
      var i;
      var len;
      var stateId;
      var j;

      for ( i = 0; i < this.chars.length; i++ ) {
        len = 0;

        if (
          i + 3 < this.chars.length &&
          this.chars[i].ch === "(" &&
          this.chars[i + 1].ch === "a" && this.chars[i + 2].ch === "q" && this.chars[i + 3].ch === ")"
        ) {
          len = 4;
        } else if ( i + 2 < this.chars.length && this.chars[i].ch === "(" &&
          (
            this.chars[i + 1].ch === "s" || this.chars[i + 1].ch === "l" || this.chars[i + 1].ch === "g"
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
  /*
   * v: a model (array, e.g. from getModel) or a text value.
   * Text is read by modelFromValue - the same parser used by compare() -
   * so the display and the comparison always agree on character positions.
   */
  ChemicalKeyboard.prototype.setValue = function (v) {
      this.cond = null;

      this.chars = Array.isArray(v)
        ? JSON.parse(JSON.stringify(v))
        : modelFromValue(v);

      this.markStates();     // re-number state ids from this.groupId
      this.markElements();
      this.cursor=this.chars.length;
      this.render();
      if ( typeof this.config.onChange === "function" ) {
        this.config.onChange( this.result() );
      }
    };

ChemicalKeyboard.prototype.setMode = function (m) {
    this.mode = m;

    this.panel.style.display = m === "edit" ? "block" : "none";

    this.display.tabIndex = m === "edit" ? 0 : -1;

    this.root.tabIndex = m === "edit" ? 0 : -1;

    this.render();
  };

  ChemicalKeyboard.prototype.setHighlights = function (h) {
      this.highlights = h || [];
      this.render();
    };

ChemicalKeyboard.prototype.makeCloseButton=function(panel){
  var self=this,b=node("button","×");

  b.type="button";
  b.title=(T[this.language]||T.en).close;
  b.setAttribute("aria-label",b.title);

  apply(b,{
    position:"absolute",
    top:"4px",
    right:"6px",
    width:"26px",
    height:"26px",
    padding:"0",
    border:"0",
    borderRadius:"4px",
    background:"transparent",
    fontSize:"24px",
    lineHeight:"24px",
    cursor:"pointer",
    zIndex:"2"
  });

  b.addEventListener("pointerdown",function(e){
    e.stopPropagation();
  });

  b.addEventListener("mousedown",function(e){
    e.stopPropagation();
  });

  b.addEventListener("click",function(e){
    e.preventDefault();
    e.stopPropagation();
    panel.style.display="none";
    self.root.focus();
  });

  return b;
};

ChemicalKeyboard.prototype.closeElementWindows = function () {
    this.elementPanel.style.display = "none";

    this.atomPanel.style.display = "none";
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

    for (i = 0; i < SYMBOLS.length; i++) {
      letter = SYMBOLS[i].charAt(0);

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
        "repeat(" + columns + ", minmax(34px, 1fr))", gridTemplateRows:
        "repeat(4, 38px)",
      gap: "5px"
    });

    for ( i = 0; i < letters.length; i++ ) {
      (function (initial) {
        b = node("button", initial);

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
            self.showElementLetter(initial);
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
    this.elementPanel.focus();
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

ChemicalKeyboard.prototype.showElementLetter = function (letter) {
    var self = this;

    var idx = this.language === "he" ? 1 : this.language === "ar" ? 2 : 0;

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
    this.atomPanel.focus();

    this.atomPanel.textContent="";
    this.makePopupHeader(this.atomPanel,letter);

    for ( i = 0; i < SYMBOLS.length; i++ ) {
      s = SYMBOLS[i];

      if ( s.charAt(0) !== letter ) {
        continue;
      }

      if (NAMES[s]) {
        n = NAMES[s][idx];
      } else {
        n = s;
      }

      b = node("button", s + " — " + n);

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
            self.insertText(sym, "normal");

            self.atomPanel.style.display = "none";

            self.display.focus();
          }
        );
      })(s, b);

      this.atomPanel.appendChild(b);
       }

    this.atomPanel.style.display = "block";
  };
/* true when the error or note is covered by a penalty line of the score */
function isPenalized(result,item){
  var i;

  for(i=0;i<result.score.penalties.length;i++){
    if(result.score.penalties[i].errorIds.indexOf(item.id)>=0)return true;
  }

  return false;
}

/*
  Graded feedback: the score, then one block per penalty line - the penalty
  is written once, with all the errors it covers under it. An error that is
  not counted is shown, greyed, under the error that caused it. Counted
  errors whose category is not in the rubric are listed under "No penalty".
*/
function renderGradedResult(result,language,summary,details){
  var messages=ERROR_TEXT[language]||ERROR_TEXT.en;
  var items=result.errors.concat(result.notes||[]),byId={},shown={},number=1,i,j,penalty,block,heading,label,rest;

  for(i=0;i<items.length;i++)byId[items[i].id]=items[i];

  summary.textContent=replaceTextToken(localizedFromTable(GRADE_TEXT,"score",language),"score",result.score.total);
  summary.style.color=result.score.total===100?"#18742a":"#a12622";

  if(result.correct&&!result.score.penalties.length){
    details.appendChild(node("div",messages.equivalent,{marginBottom:"8px"}));
    return;
  }

  function appendWithConsequences(parent,item){
    var k,caused;

    shown[item.id]=true;
    appendErrorMessage(parent,item,language,number++);

    for(k=0;k<items.length;k++){
      if(items[k].suppressedBy!==item.id||shown[items[k].id])continue;

      caused=node("div",null,{color:"#777",marginInlineStart:"24px"});
      caused.appendChild(node("div",localizedFromTable(GRADE_TEXT,"notCounted",language),{fontStyle:"italic"}));
      appendWithConsequences(caused,items[k]);
      parent.appendChild(caused);
    }
  }

  function appendBlock(title){
    var section=node("div",null,{marginBottom:"10px"});

    section.appendChild(node("div",title,{fontWeight:"bold",marginBottom:"4px"}));
    details.appendChild(section);
    return section;
  }

  for(i=0;i<result.score.penalties.length;i++){
    penalty=result.score.penalties[i];
    label=GRADE_TEXT[penalty.category]
      ?localizedFromTable(GRADE_TEXT,penalty.category,language)
      :penalty.category;

    if(penalty.allMissing)label+=" ("+localizedFromTable(GRADE_TEXT,"allMissing",language)+")";
    else if(penalty.capped)label+=" ("+localizedFromTable(GRADE_TEXT,"capped",language)+")";

    heading="⁦−"+penalty.penalty+"%⁩ · "+label;
    block=appendBlock(heading);

    for(j=0;j<penalty.errorIds.length;j++)appendWithConsequences(block,byId[penalty.errorIds[j]]);
  }

  /* errors without a penalty: category not in the rubric, or errors in the reference answer */
  rest=result.errors.filter(function(e){return !shown[e.id]&&!e.suppressedBy;});

  if(rest.length){
    block=appendBlock(localizedFromTable(GRADE_TEXT,"noPenalty",language));
    for(i=0;i<rest.length;i++)appendWithConsequences(block,rest[i]);
  }
}

function renderComparisonResult(result,language,summary,details){
  var messages=ERROR_TEXT[language]||ERROR_TEXT.en;
  var i;

  summary.dir=language==="en"?"ltr":"rtl";
  details.dir=language==="en"?"ltr":"rtl";

  summary.style.textAlign=language==="en"?"left":"right";
  details.style.textAlign=language==="en"?"left":"right";

  summary.textContent="";
  details.textContent="";

  if(result.score){
    renderGradedResult(result,language,summary,details);
  }else if(result.correct){
    summary.textContent=messages.correct;
    summary.style.color="#18742a";
    details.appendChild(node("div",messages.equivalent,{marginBottom:"8px"}));
  }else{
    summary.textContent=replaceTextToken(messages.issues, "count", result.errors.length);

    summary.style.color="#a12622";

    for(i=0;i<result.errors.length;i++){
      appendErrorMessage(details, result.errors[i], language, i+1);
    }
  }

  /*
   * Notes are listed separately, in a neutral colour,
   * for both correct and incorrect answers (a note that costs points in
   * the rubric is listed with its penalty instead).
   */
  var notes=(result.notes||[]).filter(function(n){return !(result.score&&(isPenalized(result,n)||n.suppressedBy));});

  if(notes.length){
    var notesBlock=node("div",null,{marginTop:"10px",color:"#555"});

    notesBlock.appendChild(node("div",localizedFromTable(NOTE_TEXT,"notes-heading",language),{fontWeight:"bold",marginBottom:"4px"}));

    for(i=0;i<notes.length;i++){
      appendErrorMessage(notesBlock, notes[i], language, i+1);
    }

    details.appendChild(notesBlock);
  }

  typesetMath(details);
}
function feedbackText(language,key){
  var messages=ERROR_TEXT[language]||ERROR_TEXT.en;
  var interfaceText=T[language]||T.en;
  return messages[key]||interfaceText[key]||ERROR_TEXT.en[key]||T.en[key]||key;
}
  global.ChemicalKeyboard = ChemicalKeyboard;

  global.ChemicalGrammar={
  analyzeModel:analyze,
  analyzeValue:analyzeValue,
  canonicalize:canonicalizeValue,
  compare:compareChemicalAnswers,
  grade:gradeComparison,
  feedbackHighlights:comparisonHighlights,
  feedbackText:feedbackText,
  renderComparison:renderComparisonResult,
  elements:SYMBOLS.slice(),
  version:"2.0.5"     // raise with every change, to see in the console which copy a page runs
};
})(window);