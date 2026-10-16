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
    tipFormulaState:"State written as a formula, e.g. a solution in another solvent: I₂(CCl₄)",
    tipIonPlus:"Positive ion in solution: charge + and (aq)",
    tipIonMinus:"Negative ion in solution: charge − and (aq)",
    tipAlpha:"Alpha particle (a helium-4 nucleus, ⁴₂He)",
    tipBeta:"Beta particle (an electron, ⁰₋₁e)",
    tipPositron:"Positron (⁰₊₁e)",
    tipGamma:"Gamma radiation",
    tipElectron:"Electron",
    tipNeutron:"Neutron (¹₀n)",
    tipProton:"Proton (¹₁p, ¹₁H)",
    tipLeft:"Move the cursor one chemical unit to the left",
    tipRight:"Move the cursor one chemical unit to the right",
    tipDelete:"Delete the chemical unit to the left of the cursor",
    tipClear:"Clear the complete formula or equation",
    tipAllElements:"Open the complete list of chemical elements",
    invalidWriting:"The answer is not written correctly:"
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
    tipFormulaState:"מצב הכתוב כנוסחה, למשל תמיסה בממס אחר: ⁦I₂(CCl₄)⁩",
    tipIonPlus:"יון חיובי בתמיסה מימית: מטען + ו-(aq)",
    tipIonMinus:"יון שלילי בתמיסה מימית: מטען − ו-(aq)",
    tipAlpha:"חלקיק אלפא (גרעין הליום-4, ⁴₂He)",
    tipBeta:"חלקיק בטא (אלקטרון, ⁰₋₁e)",
    tipPositron:"פוזיטרון (⁰₊₁e)",
    tipGamma:"קרינת גמא",
    tipElectron:"אלקטרון",
    tipNeutron:"נייטרון (¹₀n)",
    tipProton:"פרוטון (¹₁p, ¹₁H)",
    tipLeft:"הזזת הסמן יחידה כימית אחת שמאלה",
    tipRight:"הזזת הסמן יחידה כימית אחת ימינה",
    tipDelete:"מחיקת היחידה הכימית שמשמאל לסמן",
    tipClear:"מחיקת הנוסחה או המשוואה כולה",
    tipAllElements:"פתיחת הרשימה המלאה של היסודות הכימיים",
    invalidWriting:"התשובה אינה כתובה נכון:"
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
    tipFormulaState:"حالة مكتوبة كصيغة، مثل محلول في مذيب آخر: ⁦I₂(CCl₄)⁩",
    tipIonPlus:"أيون موجب في محلول مائي: الشحنة + و(aq)",
    tipIonMinus:"أيون سالب في محلول مائي: الشحنة − و(aq)",
    tipAlpha:"جسيم ألفا (نواة هيليوم-4، ⁴₂He)",
    tipBeta:"جسيم بيتا (إلكترون، ⁰₋₁e)",
    tipPositron:"بوزيترون (⁰₊₁e)",
    tipGamma:"أشعة غاما",
    tipElectron:"إلكترون",
    tipNeutron:"نيوترون (¹₀n)",
    tipProton:"بروتون (¹₁p، ¹₁H)",
    tipLeft:"تحريك المؤشر وحدة كيميائية واحدة إلى اليسار",
    tipRight:"تحريك المؤشر وحدة كيميائية واحدة إلى اليمين",
    tipDelete:"حذف الوحدة الكيميائية الموجودة إلى يسار المؤشر",
    tipClear:"مسح الصيغة أو المعادلة كاملة",
    tipAllElements:"فتح القائمة الكاملة للعناصر الكيميائية",
    invalidWriting:"الإجابة غير مكتوبة بشكل صحيح:"
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
    "missing-reference-answer":"No reference answer was supplied.",
    "missing-numbers":"{species} is written without its mass number and atomic number; the reference answer writes them.",
    "wrong-mass-number":"The mass number of {species} is {actual}, but the reference answer has {expected}.",
    "missing-mass-number":"The mass number of {species} is missing (written at the top, before the symbol).",
    "wrong-atomic-number":"The atomic number of {species} is {actual}, but it should be {expected}.",
    "missing-atomic-number":"The atomic number of {species} is missing (written at the bottom, before the symbol).",
    "mass-not-conserved":"The mass numbers are not conserved: {left} on the left side and {right} on the right side.",
    "atomic-number-not-conserved":"The atomic numbers are not conserved: {left} on the left side and {right} on the right side."
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
    "missing-reference-answer":"לא הוגדרה תשובת ייחוס.",
    "missing-numbers":"{species} כתוב בלי מספר המסה והמספר האטומי; בתשובת הייחוס הם כתובים.",
    "wrong-mass-number":"מספר המסה של {species} הוא {actual}, אך בתשובת הייחוס הוא {expected}.",
    "missing-mass-number":"חסר מספר המסה של {species} (נכתב למעלה, לפני הסמל).",
    "wrong-atomic-number":"המספר האטומי של {species} הוא {actual}, אך הוא צריך להיות {expected}.",
    "missing-atomic-number":"חסר המספר האטומי של {species} (נכתב למטה, לפני הסמל).",
    "mass-not-conserved":"מספרי המסה אינם נשמרים: בצד שמאל {left} ובצד ימין {right}.",
    "atomic-number-not-conserved":"המספרים האטומיים אינם נשמרים: בצד שמאל {left} ובצד ימין {right}."
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
    "missing-reference-answer":"لم يتم تحديد إجابة مرجعية.",
    "missing-numbers":"{species} مكتوب دون العدد الكتلي والعدد الذري؛ الإجابة المرجعية تكتبهما.",
    "wrong-mass-number":"العدد الكتلي لـ {species} هو {actual}، لكن الإجابة المرجعية تحدد {expected}.",
    "missing-mass-number":"العدد الكتلي لـ {species} مفقود (يُكتب في الأعلى قبل الرمز).",
    "wrong-atomic-number":"العدد الذري لـ {species} هو {actual}، لكن يجب أن يكون {expected}.",
    "missing-atomic-number":"العدد الذري لـ {species} مفقود (يُكتب في الأسفل قبل الرمز).",
    "mass-not-conserved":"الأعداد الكتلية غير محفوظة: {left} في الطرف الأيسر و{right} في الطرف الأيمن.",
    "atomic-number-not-conserved":"الأعداد الذرية غير محفوظة: {left} في الطرف الأيسر و{right} في الطرف الأيمن."
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
  "nuclide-compound":{
    en:"in a nuclear equation each term is one nucleus or particle (for example ⁦²³⁸₉₂U⁩), not a compound",
    he:"במשוואה גרעינית כל איבר הוא גרעין אחד או חלקיק אחד (למשל ⁦²³⁸₉₂U⁩), ולא תרכובת",
    ar:"في المعادلة النووية كل حدّ هو نواة واحدة أو جسيم واحد (مثل ⁦²³⁸₉₂U⁩)، وليس مركبًا"
  },
  "invalid-prescript":{
    en:"the numbers before a symbol must be a mass number (top) and an atomic number (bottom)",
    he:"המספרים לפני סמל צריכים להיות מספר מסה (למעלה) ומספר אטומי (למטה)",
    ar:"يجب أن تكون الأرقام قبل الرمز عددًا كتليًا (في الأعلى) وعددًا ذريًا (في الأسفل)"
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
  massNumbers:{en:"Mass numbers",he:"מספרי מסה",ar:"الأعداد الكتلية"},
  atomicNumbers:{en:"Atomic numbers",he:"מספרים אטומיים",ar:"الأعداد الذرية"},
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
/* "⁻" -> {script:"sup", ch:"−"}: reading the numbers of a nuclide label (²³⁸₉₂U, e⁻) */
var UNSCRIPT=null;
function unscript(ch){
  var k;
  if(!UNSCRIPT){
    UNSCRIPT={};
    for(k in SUP_CHARS)if(k!=="-")UNSCRIPT[SUP_CHARS[k]]={script:"sup",ch:k};
    for(k in SUB_CHARS)if(k!=="-")UNSCRIPT[SUB_CHARS[k]]={script:"sub",ch:k};
  }
  return UNSCRIPT[ch]||null;
}

function formulaTextToLatex(text){
  var out="",i=0,symbol,digits,ch,u,sup,sub;

  text=String(text||"");

  while(i<text.length){
    ch=text.charAt(i);

    /* the numbers of a nuclide (²³⁸₉₂U) or a particle's sign (e⁻): one empty base for both */
    if(unscript(ch)){
      sup="";
      sub="";
      while(i<text.length&&(u=unscript(text.charAt(i)))){
        if(u.script==="sup")sup+=u.ch;
        else sub+=u.ch;
        i++;
      }
      out+="{}"+(sup?"^{\\scriptscriptstyle "+sup+"}":"")+(sub?"_{\\scriptscriptstyle "+sub+"}":"");
      continue;
    }

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
  /* nuclear equations: the "atoms" #A and #Z are the conservation of mass and atomic numbers */
  var code=error.code==="unbalanced-atom"&&error.atom==="#A"?"mass-not-conserved"
    :error.code==="unbalanced-atom"&&error.atom==="#Z"?"atomic-number-not-conserved":error.code;
  var text=messages[code]||localizedFromTable(NOTE_TEXT,code,language);

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
        end: i + 1,
        char: chars[start]      // its first character (a formula state keeps its formula there)
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

  /*
   * NUCLEAR EQUATIONS (design: ENHANCEMENTS-DESIGN.md, section 4)
   * A nuclide is written with its mass number A (superscript) and atomic number Z (subscript) before
   * the symbol: ²³⁸₉₂U. Particles: α β γ n p e, with or without their numbers (α = ⁴₂α = ⁴₂He,
   * β = ⁰₋₁β = ⁰₋₁e = e⁻, β⁺ = ⁰₊₁β = e⁺ the positron, p = ¹₁p = ¹₁H, n = ¹₀n, γ = ⁰₀γ).
   * A nuclear species gets the composition {"#A": A, "#Z": Z}, so the equation's "atom balance" is the
   * conservation of mass and atomic numbers, and the identity of a species is its A and Z: equivalent
   * forms are equal. Parsing does not depend on an option: chemical formulas never start with a
   * superscript or subscript, and the particle letters can only be typed with the particle keys.
   */
  var PARTICLES = { "α": { A: 4, Z: 2 }, "β": { A: 0, Z: -1 }, "γ": { A: 0, Z: 0 },
                    "n": { A: 1, Z: 0 }, "p": { A: 1, Z: 1 }, "e": { A: 0, Z: -1 } };
  var SUP_CHARS = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
                    "+": "⁺", "−": "⁻", "-": "⁻" };
  var SUB_CHARS = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
                    "+": "₊", "−": "₋", "-": "₋" };

  /*
   * Particle keys of a nuclear question (config.nuclear). full: the numbers inserted with
   * particleLabels "full". The electron key has no full form; β⁺ is the positron (⁰₊₁β in full form).
   */
  var NUCLEAR_KEYS = [
    { short: "α", symbol: "α", full: { A: "4", Z: "2" }, tip: "tipAlpha" },
    { short: "β", symbol: "β", full: { A: "0", Z: "−1" }, tip: "tipBeta" },
    { short: "β⁺", symbol: "β", charge: "+", full: { A: "0", Z: "+1" }, tip: "tipPositron" },
    { short: "γ", symbol: "γ", full: { A: "0", Z: "0" }, tip: "tipGamma" },
    { short: "e⁻", symbol: "e", charge: "−", tip: "tipElectron" },
    { short: "n", symbol: "n", full: { A: "1", Z: "0" }, tip: "tipNeutron" },
    { short: "p", symbol: "p", full: { A: "1", Z: "1" }, tip: "tipProton" }
  ];

  /*
   * Mass numbers entered with an element (config.autoNuclideNumbers), in atomic-number order: the most abundant
   * isotope; for radioactive elements the one usually taught (U 238, Ra 226, Rn 222, Pu 239, Am 241) or the
   * longest-lived. Only a starting point - the student changes it (²³⁵U).
   */
  var MASS_NUMBERS = [1, 4, 7, 9, 11, 12, 14, 16, 19, 20, 23, 24, 27, 28, 31, 32, 35, 40, 39, 40,
    45, 48, 51, 52, 55, 56, 59, 58, 63, 64, 69, 74, 75, 80, 79, 84, 85, 88, 89, 90,
    93, 98, 98, 102, 103, 106, 107, 114, 115, 120, 121, 130, 127, 132, 133, 138, 139, 140, 141, 142,
    145, 152, 153, 158, 159, 164, 165, 166, 169, 174, 175, 180, 181, 184, 187, 192, 193, 195, 197, 202,
    205, 208, 209, 210, 210, 222, 223, 226, 227, 232, 231, 238, 237, 239, 241, 247, 247, 251, 252, 257,
    258, 259, 266, 267, 268, 269, 270, 269, 278, 281, 282, 285, 286, 289, 290, 293, 294, 294];

  function particleLabel(key) {
    return scriptText(key.full.A, "sup") + scriptText(key.full.Z, "sub") + key.symbol;
  }

  function atomicNumberOf(symbol) {
    var k = SYMBOLS.indexOf(symbol);
    return k < 0 ? null : k + 1;
  }

  function signedNumber(text) {
    var m = /^([−+-]?)(\d+)$/.exec(text);
    if (!m) return null;
    return (m[1] === "−" || m[1] === "-" ? -1 : 1) * Number(m[2]);
  }

  /* "238" -> "²³⁸": the written numbers in labels (messages, feedback lines) */
  function scriptText(text, script) {
    var map = script === "sup" ? SUP_CHARS : SUB_CHARS, out = "", k;
    for (k = 0; k < text.length; k++) out += map[text.charAt(k)] || text.charAt(k);
    return out;
  }

  /*
   * A nuclide or particle in tokens[from..to) (charge already removed), or null when this is not one:
   * prescripts (superscript / subscript tokens) followed by exactly one symbol, or a particle symbol alone.
   * Inconsistent numbers are not syntax errors but issues, reported when the species is compared
   * (compareNuclides): the species keeps the identity of its symbol (²³⁸₉₁U is U-238 with a wrong Z),
   * so one mistake gives one error.
   */
  function parseNuclide(tokens, from, to, chargeText) {
    var k = from, supText = "", subText = "", sym, particle, base, sign, A, Z;
    var massWritten = null, atomicWritten = null, issues = [], errors = [], composition;

    while (k < to && (tokens[k].script === "sup" || tokens[k].script === "sub")) {
      if (tokens[k].script === "sup") supText += tokens[k].text;
      else subText += tokens[k].text;
      k++;
    }

    if (k !== to - 1 || tokens[k].script !== "normal") return null;

    sym = tokens[k].text;
    particle = Object.prototype.hasOwnProperty.call(PARTICLES, sym);

    if (!particle && (!(supText || subText) || !isUpper(sym.charAt(0)))) return null;

    if (supText) {
      massWritten = isDigits(supText) ? Number(supText) : null;
      if (massWritten === null) errors.push({ code: "invalid-prescript", range: [tokens[from].start, tokens[k].start] });
    }

    if (subText) {
      atomicWritten = signedNumber(subText);
      if (atomicWritten === null) errors.push({ code: "invalid-prescript", range: [tokens[from].start, tokens[k].start] });
    }

    if (particle) {
      base = PARTICLES[sym];
      A = base.A;
      Z = base.Z;

      /* β and e: the electron, or the positron with "+" (β⁺, e⁺) or with the atomic number +1 (⁰₊₁β) */
      if (sym === "β" || sym === "e") {
        sign = chargeText ? chargeText.charAt(chargeText.length - 1) : "";
        if (sign === "+") Z = 1;
        else if (sign === "−" || sign === "-") Z = -1;
        else if (atomicWritten === 1) Z = 1;
      }

      if (massWritten !== null && massWritten !== A) issues.push({ code: "wrong-mass-number", expected: A, actual: massWritten });
    } else {
      if (!SET[sym]) errors.push({ code: "unknown-element", range: [tokens[k].start, tokens[k].end], value: sym });
      Z = atomicNumberOf(sym);
      if (Z === null) Z = atomicWritten !== null ? atomicWritten : 0;
      A = massWritten;
    }

    if (atomicWritten !== null && atomicWritten !== Z) issues.push({ code: "wrong-atomic-number", expected: Z, actual: atomicWritten });

    /* the two numbers come together: a mass number needs its atomic number, and the other way round */
    if (supText && !subText) issues.push({ code: "missing-atomic-number" });
    if (subText && !supText) issues.push({ code: "missing-mass-number" });

    composition = A === null ? { "#Z": Z } : { "#A": A, "#Z": Z };

    return {
      nuclear: {
        symbol: sym, particle: particle, A: A, Z: Z,
        massWritten: massWritten, atomicWritten: atomicWritten, issues: issues
      },
      composition: composition,
      label: scriptText(supText, "sup") + scriptText(subText, "sub") + sym + (chargeText ? scriptText(chargeText, "sup") : ""),
      errors: errors
    };
  }

  /*
   * The state value of a formula state: its formula in a fixed order with Unicode sub/superscripts
   * ("CCl₄", "C₆H₁₄"), so the same formula written in another order is the same state, and the value
   * reads well in messages. An empty box is no state. Errors inside point at the whole box (range).
   */
  function formulaStateOf(content, range) {
    var tokens = tokenize(content), sp, keys, text = "", k, n, errors = [];

    if (!tokens.length) return { state: null, errors: [] };

    sp = parseSpecies(tokens, 0, tokens.length);
    for (k = 0; k < sp.errors.length; k++) {
      errors.push({ code: sp.errors[k].code, value: sp.errors[k].value, range: range.slice() });
    }

    keys = sortedKeys(sp.composition);
    for (k = 0; k < keys.length; k++) {
      n = sp.composition[keys[k]];
      text += keys[k] + (n === 1 ? "" : scriptText(String(n), "sub"));
    }
    if (sp.charge) text += scriptText((Math.abs(sp.charge) === 1 ? "" : String(Math.abs(sp.charge))) + (sp.charge > 0 ? "+" : "−"), "sup");

    return { state: text, errors: errors };
  }

  /* tokens[from..end) end with a state: a formula state box, or (s) (l) (g) (aq) */
  function endsWithState(tokens, from, end) {
    if (end - from >= 1 && tokens[end - 1].char && tokens[end - 1].char.kind === "fstate") return true;
    return end - from >= 3 &&
      tokens[end - 3].text === "(" && tokens[end - 3].script === "sub" &&
      tokens[end - 2].script === "sub" &&
      (tokens[end - 2].text === "s" || tokens[end - 2].text === "l" || tokens[end - 2].text === "g" || tokens[end - 2].text === "aq") &&
      tokens[end - 1].text === ")" && tokens[end - 1].script === "sub";
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

    /*
     * A charge typed after the state (I₂(CCl₄) then ^−, Na(aq) then ^+) looks exactly like one typed before it -
     * charge and state share one stacked cluster - so both orders are read the same: the superscript
     * tokens after a state are part of the charge.
     */
    var stateTo = to, trailing = "", t2;
    while (stateTo - 1 > i && tokens[stateTo - 1].script === "sup") stateTo--;
    if (stateTo < to && !endsWithState(tokens, i, stateTo)) stateTo = to;
    for (t2 = stateTo; t2 < to; t2++) trailing += tokens[t2].text;
    formulaEnd = stateTo;

    /* a state written as a formula, I₂(CCl₄): compared by its formula (atoms and charge) */
    if (stateTo - i >= 1 && tokens[stateTo - 1].char && tokens[stateTo - 1].char.kind === "fstate") {
      var formulaState = formulaStateOf(tokens[stateTo - 1].char.condition || [], [tokens[stateTo - 1].start, tokens[stateTo - 1].end]);
      state = formulaState.state;
      errors = errors.concat(formulaState.errors);
      stateRange = [tokens[stateTo - 1].start, tokens[stateTo - 1].end];
      formulaEnd = stateTo - 1;
    } else if (endsWithState(tokens, i, stateTo)) {
      state = tokens[stateTo - 2].text;
      stateRange = [tokens[stateTo - 3].start, tokens[stateTo - 1].end];
      formulaEnd = stateTo - 3;
    }

    var chargeStart = formulaEnd;
    var j = formulaEnd - 1;
    var chargeText = "";

    while (j >= i && tokens[j].script === "sup") {
      chargeStart = j;
      chargeText = tokens[j].text + chargeText;
      j--;
    }

    /* the charge's range: the part before the state and / or the part after it */
    var chargeFrom = chargeStart < formulaEnd ? tokens[chargeStart].start : trailing ? tokens[stateTo].start : 0;
    var chargeTo = trailing ? tokens[to - 1].end : chargeStart < formulaEnd ? tokens[formulaEnd - 1].end : 0;
    chargeText += trailing;

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
            range: [chargeFrom, chargeTo]
          });
        }
      } else {
        errors.push({
          code: "invalid-charge",
          range: [chargeFrom, chargeTo]
        });
      }

      chargeRange = [chargeFrom, chargeTo];

      formulaEnd = chargeStart;
    }

    /* A nuclide or particle (nuclear equations): its charge sign belongs to the particle (e⁻, β⁺). */
    var nuclide = i < formulaEnd ? parseNuclide(tokens, i, formulaEnd, chargeText) : null;

    /*
     * A nuclide followed by more (²³⁸₉₂UO, ²³⁸₉₂U¹⁶₈O): in a nuclear equation each term is one nucleus or
     * particle. One clear syntax error for the whole term (not "a symbol in an unexpected place"); the term is
     * read as its first nuclide, so the rest of the comparison stays meaningful.
     */
    if (!nuclide && i < formulaEnd && tokens[i].script !== "normal") {
      var firstSymbol = i;
      while (firstSymbol < formulaEnd && tokens[firstSymbol].script !== "normal") firstSymbol++;
      nuclide = firstSymbol < formulaEnd - 1 ? parseNuclide(tokens, i, firstSymbol + 1, "") : null;
      if (nuclide) {
        nuclide.errors.push({ code: "nuclide-compound", range: [tokens[i].start, tokens[formulaEnd - 1].end] });
      }
    }

    if (nuclide) {
      for (var q = 0; q < notes.length; q++) notes[q].species = nuclide.label;

      return {
        type: "species",
        nuclear: nuclide.nuclear,
        coefficient: coefficient,
        formula: [],
        composition: nuclide.composition,
        label: nuclide.label,
        writtenFormula: undefined,
        hydrateKey: null,
        hydrateParts: null,
        charge: 0,
        state: state,
        coefficientRange: coefficientRange,
        formulaRange: [tokens[i].start, tokens[formulaEnd - 1].end],
        chargeRange: chargeRange,
        stateRange: stateRange,
        range: [tokens[from].start, tokens[to - 1].end],
        errors: errors.concat(nuclide.errors),
        notes: notes
      };
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

/*
 * A model (getModel()) in the value notation that setValue / modelFromValue read exactly:
 * a run of subscript characters -> _{...}, a run of superscript characters -> ^{...}, states as
 * written ((s), (aq) - recognized as states when read), the condition above an arrow -> [...]
 * after it, in the same notation. Unlike getValue(), the sub/superscript levels are kept:
 * getValue() gives "SO42-" for SO₄²⁻, which can't be read back without guessing.
 */
function valueTextOf(chars){
  var out="",i=0,c,script,run;

  chars=chars||[];
  while(i<chars.length){
    c=chars[i];
    /* a formula state: "({CCl_{4}})" - the braces tell it from (aq) */
    if(c.kind==="fstate"){
      out+="({"+valueTextOf(c.condition)+"})";
      i++;
      continue;
    }
    if(c.kind==="state"){
      out+=c.ch;
      i++;
      continue;
    }
    if(c.script==="sub"||c.script==="sup"){
      script=c.script;
      run="";
      while(i<chars.length&&chars[i].script===script&&chars[i].kind!=="state"&&chars[i].kind!=="fstate"){
        run+=chars[i].ch;
        i++;
      }
      out+=(script==="sub"?"_{":"^{")+run+"}";
      continue;
    }
    out+=c.ch;
    if(c.condition&&c.condition.length)out+="["+valueTextOf(c.condition)+"]";
    i++;
  }
  return out;
}

/* "({CCl_{4}})": the position of the closing "}" (followed by ")") of the content starting at k, or -1 */
function formulaStateEnd(s,k){
  var depth=0;

  for(;k<s.length;k++){
    if(s.charAt(k)==="{")depth++;
    else if(s.charAt(k)==="}"){
      if(depth===0)return s.charAt(k+1)===")"?k:-1;
      depth--;
    }
  }
  return -1;
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

    /* a formula state "({...})": its own model, inside one box character */
    if(ch==="("&&s.charAt(i+1)==="{"){
      j=formulaStateEnd(s,i+2);
      if(j>=0){
        token=makeChar("◌","sub",null,"fstate");
        token.condition=modelFromValue(s.substring(i+2,j)).map(function(x){return makeChar(x.ch,x.script);});
        chars.push(token);
        i=j+1;
        script="normal";
        continue;
      }
    }

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
  /* a nuclide or particle is identified by its mass and atomic numbers: ⁴₂He = α */
  if(species.nuclear)return "N:"+(species.nuclear.A===null?"?":species.nuclear.A)+","+species.nuclear.Z;
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
      nuclear:s.nuclear,
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
    nuclear:s.nuclear,
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
    /* nuclides of the same element are paired (²³⁵U for ²³⁸U: a wrong mass number); particles are not */
    atomSetKey:s.nuclear?(s.nuclear.particle?"P:"+s.nuclear.symbol+s.nuclear.Z:"E:"+s.nuclear.symbol):atomSetKey(s.composition),
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
    /* a nuclide always takes part in both balances, also when its mass number is unknown (U) */
    list[i].speciesAtoms=species.nuclear?["#A","#Z"]:sortedKeys(species.composition);
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

/*
  A matched nuclide or particle (nuclear equations): the mass number against the reference, and the
  student's own written numbers (a wrong atomic number for the symbol, a number written without the
  other one). Each code once per species.
*/
function compareNuclides(student,reference,side,errors){
  var s=student.nuclear,r=reference.nuclear,reported={},i,issue;
  var studentRanges=oneTarget(student.formulaRange||student.range,"species");
  var referenceRanges=oneTarget(reference.formulaRange||reference.range,"species");

  function report(code,expected,actual){
    if(reported[code])return;
    reported[code]=true;
    addError(errors,code,{
      side:side,
      species:speciesLabel(student),
      expected:expected,
      actual:actual,
      studentRanges:studentRanges,
      referenceRanges:referenceRanges
    });
  }

  /*
   * Numbers written in the reference must be written by the student (decided 2026-10-15: they help the
   * student check the balance). A species has both numbers or none: none at all is "missing-numbers";
   * only one of them is an issue of the student's own writing (below).
   */
  var studentNone=!s||(s.massWritten===null&&s.atomicWritten===null);
  var referenceHas=!!r&&(r.massWritten!==null||r.atomicWritten!==null);

  if(referenceHas&&studentNone)report("missing-numbers");
  else if(r&&r.A!==null&&(!s||s.A===null))report("missing-mass-number",r.A);
  else if(s&&r&&s.A!==null&&r.A!==null&&s.A!==r.A)report("wrong-mass-number",r.A,s.A);

  if(!s)return;

  for(i=0;i<s.issues.length;i++){
    issue=s.issues[i];
    report(issue.code,issue.expected,issue.actual);
  }
}

/* true when the answer has a nuclide or a particle: the question is a nuclear equation */
function astIsNuclear(ast){
  var sides=[ast.reactants||[],ast.products||[]],a,i;

  for(a=0;a<sides.length;a++){
    for(i=0;i<sides[a].length;i++)if(sides[a][i].nuclear)return true;
  }
  return false;
}

/*
  In a nuclear equation, a symbol written without its numbers (U) is the nuclide with an unknown mass
  number - not one atom of U - so it is paired with the reference nuclide and reported as a missing
  mass number.
*/
function nuclearizeAst(ast){
  var sides=[ast.reactants||[],ast.products||[]],a,i,s,item,Z;

  for(a=0;a<sides.length;a++){
    for(i=0;i<sides[a].length;i++){
      s=sides[a][i];
      if(s.nuclear||s.charge||s.hydrateKey||s.formula.length!==1)continue;
      item=s.formula[0];
      if(item.type!=="element"||item.count!==1)continue;
      Z=atomicNumberOf(item.symbol)||0;
      s.nuclear={symbol:item.symbol,particle:false,A:null,Z:Z,massWritten:null,atomicWritten:null,issues:[]};
      s.composition={"#Z":Z};
      s.formula=[];
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

    if(student.nuclear||reference.nuclear)compareNuclides(student,reference,side,errors);
    else compareAtomCounts(student,reference,side,errors);
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
/*
 * The problems of the WRITING only (syntax errors, symbols that are not elements), as texts in the
 * language: the answer is compared with itself, so nothing depends on a reference; unbalanced atoms
 * are left out (balancing is part of the task). Used by the validation icon. value: text or AST.
 */
var WRITING_CODES=["syntax-error","unknown-element"];

function validateWriting(value,language){
  var errors=compareChemicalAnswers(value,value,language,{}).errors,problems=[],i;

  for(i=0;i<errors.length;i++){
    if(WRITING_CODES.indexOf(errors[i].code)>=0&&problems.indexOf(errors[i].description)<0){
      problems.push(errors[i].description);
    }
  }
  return problems;
}

function compareChemicalAnswers(studentValue,referenceValue,language,options){
  language=language==="he"||language==="ar"?language:"en";
  options=options||{};
  var studentAst=studentValue&&studentValue.type?studentValue:analyzeValue(studentValue);
  var referenceAst=referenceValue&&referenceValue.type?referenceValue:analyzeValue(referenceValue);
  /* a nuclear equation: decided by the reference (or options.nuclear) */
  var nuclear=options.nuclear===true||astIsNuclear(referenceAst);
  if(nuclear){
    nuclearizeAst(studentAst);
    nuclearizeAst(referenceAst);
  }
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

  /* elements missing / extra in the whole answer: not in a nuclear equation, where elements change */
  keys=nuclear?[]:sortedKeys(studentAtoms);

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

  keys=nuclear?[]:sortedKeys(referenceAtoms);

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
var RUBRIC_CATEGORIES=["syntax","answerType","unknownElement","substances","massNumbers","atomicNumbers","coefficients","scaledCoefficients",
  "balance","states","charges","arrow","conditions","notation"];

var RUBRIC_CATEGORY_OF={
  "syntax-error":"syntax",
  "wrong-answer-type":"answerType",
  "unknown-element":"unknownElement",
  "missing-species":"substances","unexpected-species":"substances","wrong-atom-count":"substances",
  "wrong-structure":"substances","missing-structure":"substances","wrong-dot-parts":"substances",
  "unexpected-atom":"substances","missing-atom":"substances",
  "wrong-mass-number":"massNumbers","missing-mass-number":"massNumbers","missing-numbers":"massNumbers",
  "wrong-atomic-number":"atomicNumbers","missing-atomic-number":"atomicNumbers",
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
var WRONG_SPECIES_CODES=["wrong-atom-count","wrong-structure","missing-structure","wrong-dot-parts",
  /* a nuclide with a wrong or missing mass number is a wrong substance: it also explains the mass balance */
  "wrong-mass-number","missing-mass-number","missing-numbers"];

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
 * config.autoSubscript: true (default); false - digits are not made subscripts by themselves (insertDigit).
 * config.ionKeys: false (default); true adds the shortcut keys ⁺(aq) and ⁻(aq) (insertIon).
 * config.formulaStateKey: false (default); true adds the key (▢) for a state written as a formula.
 * config.nuclear: nuclear equation - particle keys (particleLabels "short" / "full");
 *   autoNuclideNumbers: an element typed at the start of a substance gets its numbers (autoNuclideNumbers).
 * config.states: show the state keys; default true, false in a nuclear question unless set to true.
 * config.molecules: molecule keys (see insertMolecule); default none.
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
    /*
     * The keyboard window's typing area is smaller, so longer formulas fit on one line (see buildPopupWindow).
     * Read-only displays: config.fontSize (any CSS value) when given - "inherit" takes the size from the
     * host div, so a page can style it (size, color, place) - otherwise DISPLAY_FONT_SIZE (24px; was 28px
     * until 2026-10-16 - too big next to the 22px typing area).
     */
    fontSize:this.mode==="edit"?TYPING_FONT_SIZE+"px":(this.config.fontSize||DISPLAY_FONT_SIZE+"px"),
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

  if(this.mode==="edit"&&this.config.validation!==false){
    this.buildValidation(root,t);
  }else{
    root.appendChild(this.display);
  }

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
    if(self.cond&&!self.condIsFormula())self.insertConditionChars([makeChar(",","normal")]);
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
  if(this.config.conditions!==false&&!this.config.nuclear){
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
    gridTemplateColumns:"repeat("+(4+(this.config.ionKeys?2:0)+(this.config.formulaStateKey?1:0))+", minmax(52px, 72px))",
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

  /* config.formulaStateKey: a state written as a formula, I₂(CCl₄) - see insertFormulaState */
  if(this.config.formulaStateKey){
    var formulaStateButton=btn(statesRow,"(▢)",function(){
      self.insertFormulaState();
    },t.tipFormulaState);
    removeButtonFocus(formulaStateButton);
  }

  /*
   * Nuclear equations (config.nuclear): particle keys instead of the states. config.particleLabels:
   * "short" (default: α, β ...) or "full" (⁴₂α, ⁰₋₁β ...) - the key inserts what its label shows,
   * as separate characters (numbers + symbol), so DEL and the arrows work as if typed by hand.
   */
  if(this.config.nuclear){
    var particlesRow=node("div");
    apply(particlesRow,{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"10px"});
    this.panel.insertBefore(particlesRow,statesRow);
    NUCLEAR_KEYS.forEach(function(key){
      var full=self.config.particleLabels==="full"&&key.full,b,stack,top,bottom;
      b=btn(particlesRow,full?"":key.short,function(){
        self.insertParticle(key,!!full);
      },t[key.tip]||key.short,{fontFamily:"'Times New Roman',serif",fontSize:"25px",minWidth:"52px",padding:"0 6px"});
      if(!full)return;
      /*
       * The numbers stacked and right-aligned before the symbol, with the same layout as the typing area
       * (render): a fixed box with the two lines placed absolutely - a flex column lines up differently
       * in different browsers and button styles.
       */
      stack=node("span","");
      apply(stack,{display:"inline-block",position:"relative",
        width:Math.max(key.full.A.length,key.full.Z.length)*.42+"em",height:"1em",verticalAlign:"-.18em",marginRight:"1px"});
      top=node("span",key.full.A);
      bottom=node("span",key.full.Z);
      apply(top,{position:"absolute",right:"0",top:"-.3em",fontSize:"58%",lineHeight:"1",whiteSpace:"nowrap"});
      apply(bottom,{position:"absolute",right:"0",top:".78em",fontSize:"58%",lineHeight:"1",whiteSpace:"nowrap"});
      stack.appendChild(top);
      stack.appendChild(bottom);
      b.appendChild(stack);
      b.appendChild(document.createTextNode(key.symbol));
      b.setAttribute("aria-label",(t[key.tip]||"")+" "+particleLabel(key));
    });
  }

  /*
   * config.states: show the state keys (the row also holds the ion keys and the formula-state key).
   * Default: shown, except in a nuclear question - where the teacher can still turn them on.
   */
  if(this.config.states===false||this.config.nuclear&&this.config.states!==true){
    statesRow.style.display="none";
  }

  /* config.ionKeys: shortcuts for a charge + (aq) - see insertIon */
  if(this.config.ionKeys){
    btn(statesRow,"⁺(aq)",function(){
      self.insertIon("+");
    },t.tipIonPlus);

    btn(statesRow,"⁻(aq)",function(){
      self.insertIon("−");
    },t.tipIonMinus);
  }

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

  /*
   * 6 grid columns: elements take 2 (3 per row), molecule keys take 3 (2 per row, wider labels like Cr₂O₇²⁻).
   * Molecule keys (config.molecules, MOLECULES-DESIGN.md) come first, at the top of the panel; each types the
   * characters of its formula (insertMolecule) - not one unit.
   */
  apply(atomsGrid,{
    display:"grid",
    gridTemplateColumns:"repeat(6, 1fr)",
    gap:"6px"
  });

  atomsPanel.appendChild(atomsGrid);

  this.moleculeKeys=moleculeKeysFrom(this.config.molecules);
  this.moleculeKeys.forEach(function(key){
    var b=btn(atomsGrid,"",function(){self.insertMolecule(key.formula);},
      moleculeTooltip(key,self.language),
      {width:"100%",minWidth:"0",gridColumn:"span 3",padding:"0 2px",whiteSpace:"nowrap",overflow:"hidden",fontSize:"16px"});
    if(key.label)b.textContent=key.label;
    else b.appendChild(formulaNodes(key.formula));
  });

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
        {width:"100%",minWidth:"0",gridColumn:"span 2"}
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
      gridColumn:"1 / -1",
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
    fontSize:DISPLAY_FONT_SIZE+"px",     // the formula box on the page: the same size as the read-only displays
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
/*
 * Typing area of the keyboard window. config.displayChars widens the window so that many characters
 * fit on one line; a character is counted as CHAR_WIDTH_EM of the font size (a capital letter or a
 * digit at the normal level - sub/superscripts take less, so the count is on the safe side).
 * Horizontal space in the typing area: border 2px + padding 12px right + 44px left (room for the
 * validation icon; counted also without it, so the width does not depend on that option).
 * DISPLAY_CHARS is the default and the minimum: at 32 characters (481px) the first row of keys,
 * up to the comma, fits on one line.
 */
var TYPING_FONT_SIZE=22,CHAR_WIDTH_EM=0.6,DISPLAY_CHARS=32;
/* the formula box on the page and the read-only displays (feedback, reference answer) */
var DISPLAY_FONT_SIZE=24;

ChemicalKeyboard.prototype.buildPopupWindow=function(root,t){
  var self=this,header,title,close,
  chars=Math.max(DISPLAY_CHARS,Number(this.config.displayChars)||0),
  width=Math.ceil(chars*CHAR_WIDTH_EM*TYPING_FONT_SIZE)+2+12+44;

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
    setButtonEnabled(this.commaButton,!!this.cond&&!this.condIsFormula());

    /* The minus: a negative charge (superscript) or condition text (−78°C). */
    setButtonEnabled(this.minusButton,this.script==="sup"||!!this.cond||!!this.config.nuclear&&this.script==="sub");
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

/*
   FORMULA STATE (config.formulaStateKey; design: ENHANCEMENTS-DESIGN.md, section 1)
   A state written as a formula, in the state position: I₂(CCl₄). One character of kind "fstate"
   (ch "◌", lower line) holds the formula in .condition, so it is edited exactly like the condition
   above an arrow (this.cond = {arrow: its index, pos}): the cursor enters it, the same keys work,
   Enter / → leave it. Only formulas: no words, commas or condition symbols inside.
*/
ChemicalKeyboard.prototype.condIsFormula=function(){
  return !!this.cond&&!!this.chars[this.cond.arrow]&&this.chars[this.cond.arrow].kind==="fstate";
};

ChemicalKeyboard.prototype.insertFormulaState=function(){
  var index,box;

  if(this.mode!=="edit"||this.cond)return;

  box=makeChar("◌","sub",null,"fstate");
  box.condition=[];
  index=this.cursor;
  this.chars.splice(index,0,box);
  this.cursor=index+1;
  this.cond={arrow:index,pos:0};
  this.script="normal";
  this.navigationScript=false;
  this.changed();
};

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

  /* inside a formula state the condition keys leave it first (they belong to the arrow) */
  if(this.condIsFormula())this.closeCondition(1);

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

/*
 * config.autoSubscript: true (default) - a digit after a symbol or ")" becomes a subscript by itself.
 * false - digits stay at the current level; the student chooses the subscript with "_" or the panel's
 * subscript key (practising the notation). A capital letter, "+", an arrow and "·" still return to the
 * normal level, and a charge sign still ends the superscript.
 */
ChemicalKeyboard.prototype.insertDigit=function(d){
  var s=this.script,p,c,auto=this.config.autoSubscript!==false;

  if(this.cond){
    c=this.conditionChars();

    /* V2O5, H2O: a digit after a letter or ")" is a subscript. */
    if(auto&&s==="normal"&&this.cond.pos>0){
      p=c[this.cond.pos-1];

      if(isUpper(p.ch)||isLower(p.ch)||p.ch===")"||p.script==="sub"&&isDigit(p.ch)){
        s="sub";
        this.script="sub";
      }
    }

    this.insertText(d,s);
    return;
  }

  if(auto&&s==="normal"&&!this.inSpeciesStart()&&this.cursor>0){
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

  /* nuclear: the numbers of an element typed at the start of a substance (C, then Cl when "l" follows) */
  if(this.config.nuclear&&this.config.autoNuclideNumbers&&script==="normal"){
    if(isUpper(s.charAt(0)))this.autoNuclideNumbers(this.cursor-a.length);
    else if(s.length===1&&isLower(s)&&this.cursor>=2&&isUpper(this.chars[this.cursor-2].ch))this.autoNuclideNumbers(this.cursor-2);
  }

  this.changed();
};

/*
 * config.autoNuclideNumbers (nuclear questions): put the mass and atomic numbers of the element whose symbol
 * starts at symbolIndex before it - or replace numbers that were put there automatically (C -> Cl). Numbers the
 * student typed or changed are never touched (only characters marked .auto are replaced), and nothing happens
 * inside a formula (only at the start of a substance: after nothing, "+", an arrow or a coefficient).
 */
ChemicalKeyboard.prototype.autoNuclideNumbers=function(symbolIndex){
  var chars=this.chars,sym=chars[symbolIndex].ch,start=symbolIndex,prev,Z,A,items=[],k,text;

  if(symbolIndex+1<chars.length&&chars[symbolIndex+1].script==="normal"&&isLower(chars[symbolIndex+1].ch))sym+=chars[symbolIndex+1].ch;

  while(start>0&&chars[start-1].auto)start--;
  prev=start>0?chars[start-1]:null;
  if(prev&&!(prev.script==="normal"&&(prev.ch==="+"||isArrowChar(prev.ch)||isDigit(prev.ch))))return;

  Z=atomicNumberOf(sym);
  if(!Z||!SET[sym])return;
  A=MASS_NUMBERS[Z-1];

  text=String(A);
  for(k=0;k<text.length;k++)items.push(makeChar(text.charAt(k),"sup"));
  text=String(Z);
  for(k=0;k<text.length;k++)items.push(makeChar(text.charAt(k),"sub"));
  items.forEach(function(c){c.auto=true;});

  chars.splice.apply(chars,[start,symbolIndex-start].concat(items));
  if(this.cursor>=symbolIndex)this.cursor+=items.length-(symbolIndex-start);
};
ChemicalKeyboard.prototype.insertSign = function (sign) {
    /*
     * A minus is a negative charge (superscript) or part of the condition
     * text (−78°C); anywhere else in the formula it is ignored.
     */
    /*
     * Nuclear equations: a sign at the start of a subscript is the sign of an atomic number (⁰₋₁e, ⁰₊₁β).
     * Anywhere else a subscript "+" is the plus between substances, as before.
     */
    var prev = this.cursor > 0 ? this.chars[this.cursor - 1] : null;
    var subSign = this.config.nuclear && this.script === "sub" && !this.cond && !(prev && prev.script === "sub");

    if ((sign === "−" || sign === "-") && this.script !== "sup" && !this.cond && !subSign) return;

    var mode = this.script === "sup"
        ? "sup"
        : subSign ? "sub" : "normal";

    if (subSign) {
      this.insertText(sign, "sub");
      return;
    }

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

/*
 * Ion shortcut keys (config.ionKeys): "⁺(aq)" and "⁻(aq)" after a symbol, e.g. Na → Na⁺(aq).
 * Only a shortcut: it inserts the same characters as typing the charge sign at the superscript level
 * and then the (aq) key - a separate charge character and a state - so DEL and the arrows treat them
 * exactly as typed by hand, and Ca ^2 ⁺(aq) gives Ca²⁺(aq).
 */
ChemicalKeyboard.prototype.insertIon = function (sign) {
    var stateId, text = "(aq)", chars, i;

    if (this.cond) return;

    stateId = this.groupId++;
    chars = [makeChar(sign === "+" ? "+" : "−", "sup")];
    for (i = 0; i < text.length; i++) chars.push(makeChar(text.charAt(i), "sub", stateId, "state"));

    this.chars.splice.apply(this.chars, [this.cursor, 0].concat(chars));
    this.cursor += chars.length;
    this.script = "normal";
    this.navigationScript = false;
    this.changed();
  };

/* A particle key (config.nuclear): its numbers (full form) and symbol, as separate characters. */
ChemicalKeyboard.prototype.insertParticle = function (key, full) {
    var chars = [], k;

    if (this.cond) return;

    if (full && key.full) {
      for (k = 0; k < key.full.A.length; k++) chars.push(makeChar(key.full.A.charAt(k), "sup"));
      for (k = 0; k < key.full.Z.length; k++) chars.push(makeChar(key.full.Z.charAt(k), "sub"));
    }

    chars.push(makeChar(key.symbol, "normal"));
    if (key.charge && !(full && key.full)) chars.push(makeChar(key.charge, "sup"));

    this.chars.splice.apply(this.chars, [this.cursor, 0].concat(chars));
    this.cursor += chars.length;
    this.script = "normal";
    this.navigationScript = false;
    this.changed();
  };

/*
 * MOLECULE KEYS (config.molecules; design: MOLECULES-DESIGN.md)
 * config.molecules: ["H_{2}O", "SO_{4}^{2-}", { formula: "(SO_{4})", label: "(SO₄)", name: { en: "sulfate" } }]
 * - formulas in the value notation. A key types the characters of its formula, exactly as if the student had
 * typed them: no new kind of object, so comparison, grading and the saved answer are unchanged, and the
 * inserted formula is edited character by character (decided 2026-10-16: a sequence of symbols, not one unit -
 * the same as the ion keys).
 */
function moleculeKeysFrom(list){
  return (Array.isArray(list)?list:[]).map(function(item){
    if(typeof item==="string")return item?{formula:item,label:"",name:null}:null;
    if(item&&item.formula)return {formula:String(item.formula),label:item.label||"",name:item.name||null};
    return null;
  }).filter(Boolean);
}

/* "H_{2}O" -> "H₂O": the formula as plain text (tooltips, builder chips) */
function plainFormula(formula){
  return modelFromValue(formula).map(function(c){
    if(c.kind==="fstate")return "("+(c.condition||[]).map(function(x){return x.script==="normal"?x.ch:scriptText(x.ch,x.script);}).join("")+")";
    return c.script==="normal"||c.kind==="state"?c.ch:scriptText(c.ch,c.script);
  }).join("");
}

function moleculeTooltip(key,language){
  var name=typeof key.name==="string"?key.name:key.name?(key.name[language]||key.name.en||""):"";
  return plainFormula(key.formula)+(name?" — "+name:"");
}

/* The formula drawn for a key label: subscripts and charges as small lowered / raised text. */
function formulaNodes(formula){
  var box=document.createElement("span"),chars=modelFromValue(formula),i,c,s;
  for(i=0;i<chars.length;i++){
    c=chars[i];
    s=document.createElement("span");
    s.textContent=c.kind==="fstate"?"("+(c.condition||[]).map(function(x){return x.ch;}).join("")+")":c.ch;
    if(c.script==="sub"||c.script==="sup"){
      s.style.fontSize="70%";
      s.style.verticalAlign=c.script==="sub"?"-.25em":".45em";
    }
    box.appendChild(s);
  }
  return box;
}

ChemicalKeyboard.prototype.insertMolecule=function(formula){
  var src=modelFromValue(formula),out=[],pairs={},i,c,box;

  if(this.mode!=="edit")return;

  for(i=0;i<src.length;i++){
    c=src[i];
    if(c.kind==="state"||c.kind==="fstate"){
      if(this.cond)continue;                  // no states inside a condition or a formula state
      if(c.kind==="fstate"){
        box=makeChar("◌","sub",null,"fstate");
        box.condition=(c.condition||[]).map(function(x){return makeChar(x.ch,x.script);});
        out.push(box);
        continue;
      }
      if(!pairs[c.pair])pairs[c.pair]=this.groupId++;
      out.push(makeChar(c.ch,"sub",pairs[c.pair],"state"));
      continue;
    }
    out.push(makeChar(c.ch,c.script));
  }

  if(!out.length)return;
  this.navigationScript=false;
  this.script="normal";

  if(this.cond){
    this.insertConditionChars(out);
    return;
  }

  this.chars.splice.apply(this.chars,[this.cursor,0].concat(out));
  this.cursor+=out.length;
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

  /*
   * Moving left to the start of a superscript / subscript (Na|⁺(aq)): the cursor takes that level, as when
   * arriving there from the left, so a digit typed there is the charge number (Na²⁺), not an atom count.
   * Before a charge it is the superscript also after a subscript (SO₄|²⁻: stepping back over the sign).
   */
  if(d<0&&this.cursor<this.chars.length){
    c=this.chars[this.cursor];
    if(c.kind!=="state"&&c.kind!=="fstate"&&(c.script==="sup"&&(!near||near.script!=="sup")||
       c.script==="sub"&&(!near||near.script==="normal")))near=c;
  }

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

    if(!c.length&&this.condIsFormula()){
      /* an empty formula state is removed with its box */
      previous=this.cond.arrow;
      this.chars.splice(previous,1);
      this.cond=null;
      this.cursor=previous;
      this.script="normal";
    }else if(!c.length){
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

  /* DEL after a formula state goes into it (deleting from its end); an empty one is removed */
  if(previous.kind==="fstate"){
    if(previous.condition&&previous.condition.length){
      this.cond={arrow:this.cursor-1,pos:previous.condition.length};
    }else{
      this.chars.splice(--this.cursor,1);
    }
    this.script="normal";
    this.changed();
    return;
  }

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
    if (this.cond && (this.condIsFormula() ? "()" : " ,.°()%").indexOf(k) >= 0) {
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

      /* inside a formula state the same rule, on the formula's own characters */
      if (this.condIsFormula()) prev = this.cond.pos > 0 ? this.conditionChars()[this.cond.pos - 1] : null;

      if (isLower(k) && (!this.cond || this.condIsFormula()) && !(prev && prev.script === "normal" && isUpper(prev.ch))) {
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
  this.scheduleValidation();
};

/*
 * VALIDATION ICON (config.validation, on unless false; edit mode only)
 * Like Moodle's formulas question: a red "!" in a circle inside the typing area when the answer
 * is not written correctly (syntax errors, symbols that are not elements - see validateWriting).
 * A half-written answer is always invalid, so the check runs only after a pause in typing
 * (VALIDATION_DELAY) and at once when the keyboard closes or a value is set. The left padding
 * of the typing area is reserved for the icon, so the text does not move when it appears.
 */
var VALIDATION_DELAY=2000;

ChemicalKeyboard.prototype.buildValidation=function(root,t){
  var self=this,wrapper=node("div"),icon=node("span","!"),message=node("div");

  apply(wrapper,{position:"relative"});
  apply(this.display,{paddingLeft:"44px"});

  apply(icon,{
    position:"absolute",
    left:"12px",
    top:"50%",
    transform:"translateY(-50%)",
    display:"none",
    width:"22px",
    height:"22px",
    lineHeight:"19px",
    border:"2px solid #c62828",
    borderRadius:"50%",
    boxSizing:"border-box",
    color:"#c62828",
    fontSize:"15px",
    fontWeight:"bold",
    textAlign:"center",
    cursor:"pointer",
    userSelect:"none"
  });
  icon.setAttribute("role","img");

  /* a tap shows the problems under the typing area (no hover on a tablet); focus stays in the typing area */
  icon.addEventListener("pointerdown",function(e){ e.preventDefault(); });
  icon.addEventListener("click",function(e){
    e.stopPropagation();
    message.style.display=message.style.display==="none"?"block":"none";
    self.display.focus();
  });

  apply(message,{
    display:"none",
    marginTop:"6px",
    padding:"6px 10px",
    border:"1px solid #e3a1a1",
    borderRadius:"6px",
    background:"#fdecec",
    color:"#a12622",
    fontSize:"14px",
    direction:this.language==="he"||this.language==="ar"?"rtl":"ltr",
    textAlign:"start"
  });

  wrapper.appendChild(this.display);
  wrapper.appendChild(icon);
  root.appendChild(wrapper);
  root.appendChild(message);

  this.validationIcon=icon;
  this.validationMessage=message;
  this.validationText=t.invalidWriting||T.en.invalidWriting;
};

/* The problems of the writing (texts in the keyboard language); empty when it is written correctly. */
ChemicalKeyboard.prototype.validate=function(){
  return validateWriting(this.getAST(),this.language);
};

ChemicalKeyboard.prototype.scheduleValidation=function(){
  var self=this;

  if(!this.validationIcon)return;
  clearTimeout(this.validationTimer);
  this.showValidation([]);             // editing: no icon until the next pause
  this.validationTimer=setTimeout(function(){ self.updateValidation(); },VALIDATION_DELAY);
};

ChemicalKeyboard.prototype.updateValidation=function(){
  if(!this.validationIcon)return;
  clearTimeout(this.validationTimer);
  this.showValidation(this.mode==="edit"&&this.chars.length?this.validate():[]);
};

ChemicalKeyboard.prototype.showValidation=function(problems){
  var invalid=problems.length>0,i,line;

  this.validationIcon.style.display=invalid?"block":"none";
  this.validationIcon.title=invalid?this.validationText+"\n"+problems.join("\n"):"";
  this.validationIcon.setAttribute("aria-label",invalid?this.validationIcon.title:"");
  this.display.style.setProperty("border",invalid?"1px solid #c62828":"1px solid #789","important");

  this.validationMessage.textContent="";
  if(!invalid){
    this.validationMessage.style.display="none";
    return;
  }
  this.validationMessage.appendChild(node("div",this.validationText));
  for(i=0;i<problems.length;i++){
    line=node("div",problems[i]);
    this.validationMessage.appendChild(line);
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
/*
 * Read-only displays (feedback, reference answer) typeset with MathJax, like the formula box on the page, with
 * the marking as colored boxes (toLatex(true)). Only when the page has MathJax (Moodle and the builder load it);
 * otherwise the displays are drawn as HTML (render). Returns true when MathJax is used.
 */
ChemicalKeyboard.prototype.renderReadonlyMath=function(){
  var self=this,revision;

  if(this.mode==="edit"||this.config.mathjax===false||typeof window==="undefined"||!window.MathJax)return false;

  this.mathRevision=(this.mathRevision||0)+1;
  revision=this.mathRevision;
  this.display.textContent="\\("+this.toLatex(true)+"\\)";
  typesetMath(this.display,function(){
    if(revision!==self.mathRevision)return false;
    self.display.textContent="\\("+self.toLatex(true)+"\\)";
    return true;
  });
  return true;
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

  /* read-only with MathJax on the page: typeset, with the marking as colored boxes */
  if(this.renderReadonlyMath()){
    this.updateScriptButtons();
    this.syncRenderedDisplay();
    return;
  }
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

  /* a script character's box (and highlight) is exactly one line of its small font: no overlap with the other line */
  if(mode==="sub"||mode==="sup")apply(sp,{display:"inline-block",lineHeight:"1"});

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
        if(this.chars[j].kind==="state"||this.chars[j].kind==="fstate"){
          if(this.chars[j].kind==="fstate"){
            states.push(j);
            j++;
            continue;
          }

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

      /* a formula state is as wide as its formula and parentheses */
      width=0;
      for(k=0;k<lower.length;k++){
        width+=this.chars[lower[k]].kind==="fstate"?Math.max(2,this.chars[lower[k]].condition.length)+2:1;
      }
      width=Math.max(1,width,upper.length)*.42;

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
        top:".78em",
        fontSize:"58%",
        lineHeight:"1",
        whiteSpace:"nowrap"
      });

      /*
       * Script sizes and places (2026-10-16): smaller (58%) and further apart, so that the highlighted boxes of
       * a superscript and a subscript stacked above each other (²³⁸₉₂U, SO₄²⁻) do not cover each other in the
       * feedback. "top" is in the line's own (small) em: superscript -0.17..0.41, subscript 0.45..1.03 of the
       * formula's font size.
       */
      apply(supLine,{
        position:"absolute",
        left:"0",
        top:"-.3em",
        fontSize:"58%",
        lineHeight:"1",
        whiteSpace:"nowrap"
      });

      /* mass and atomic numbers before a symbol (²³⁸₉₂U): right-aligned against the symbol */
      if(this.isPrescript(i,j)){
        apply(subLine,{left:"auto",right:"0",textAlign:"right"});
        apply(supLine,{left:"auto",right:"0",textAlign:"right"});
      }

      for(k=0;k<lower.length;k++){
        if(this.chars[lower[k]].kind==="fstate"){
          if(self.mode==="edit"&&self.cursor===lower[k]&&!cursorDrawn&&self.script==="sub")addCaret(subLine,"sub");
          subLine.appendChild(this.renderFormulaState(lower[k]));
        }else{
          appendCharacter(subLine,lower[k],"sub");
        }
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

/*
 * A formula state on the lower line: "(" formula ")", a dashed box while empty. Clicking it enters it
 * (data-condition-arrow, as for a condition); the caret is drawn here while it is being edited.
 */
ChemicalKeyboard.prototype.renderFormulaState=function(index){
  var content=this.chars[index].condition||[],box=node("span",""),k,ch,color,self=this;
  var editing=this.mode==="edit"&&this.cond&&this.cond.arrow===index;

  function caret(){
    var c=node("span","");
    c.setAttribute("data-chemical-caret","1");
    apply(c,{display:"inline-block",width:"2px",height:"1em",background:"#1769aa",verticalAlign:"-.12em"});
    box.appendChild(c);
  }

  box.setAttribute("data-condition-arrow",index);
  apply(box,{
    display:"inline-block",
    border:content.length?"1px solid transparent":"1px dashed #1769aa",
    borderRadius:"3px",
    padding:"0 1px",
    background:editing?"#eef5fc":"transparent",
    cursor:this.mode==="edit"?"text":"default"
  });
  color=this.isHighlighted(index);
  if(color)box.style.backgroundColor=color;

  box.appendChild(document.createTextNode("("));
  if(!content.length)box.appendChild(node("span"," "));
  for(k=0;k<content.length;k++){
    if(editing&&self.cond.pos===k)caret();
    ch=node("span",content[k].ch);
    if(content[k].script==="sub")apply(ch,{fontSize:"75%",verticalAlign:"sub"});
    else if(content[k].script==="sup")apply(ch,{fontSize:"75%",verticalAlign:"super"});
    box.appendChild(ch);
  }
  if(editing&&this.cond.pos===content.length)caret();
  box.appendChild(document.createTextNode(")"));

  return box;
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

/*
 * The script cluster chars[start..end) stands before a symbol at the start of a substance: the mass and
 * atomic numbers of a nuclide (²³⁸₉₂U, ⁴₂α), not an index or charge of what comes before it.
 */
ChemicalKeyboard.prototype.isPrescript=function(start,end){
  var next=this.chars[end],prev=start>0?this.chars[start-1]:null;

  if(!next||next.script!=="normal"||!(isUpper(next.ch)||Object.prototype.hasOwnProperty.call(PARTICLES,next.ch)))return false;
  return !prev||prev.script==="normal"&&(prev.ch==="+"||isArrowChar(prev.ch)||isDigit(prev.ch));
};

/*
 * The answer in LaTeX (MathJax). Element symbols and state letters upright (\mathrm), as written in chemistry.
 * withHighlights: the marked characters (setHighlights / setComparisonFeedback) get their color as a
 * background, \bbox[color]{...} - consecutive characters with the same color share one box. Used for the
 * read-only displays, so the feedback looks like the formula box on the page (2026-10-16).
 */
ChemicalKeyboard.prototype.toLatex=function(withHighlights){
  var self=this,out="",i,c,pair,sub,sup,j,normal=[];

  function colorOf(k){ return withHighlights?self.isHighlighted(k):null; }
  function charTex(ch){ return isUpper(ch)||isLower(ch)?"\\mathrm{"+ch+"}":esc(ch); }
  /* pieces [{tex, color}] -> LaTeX; a run of pieces with the same color in one box */
  function joinPieces(pieces){
    var s="",k=0,run,col;
    while(k<pieces.length){
      col=pieces[k].color;
      run="";
      while(k<pieces.length&&pieces[k].color===col){ run+=pieces[k].tex; k++; }
      s+=col?"\\bbox["+col+"]{"+run+"}":run;
    }
    return s;
  }
  function flushNormal(){ out+=joinPieces(normal); normal=[]; }

  for(i=0;i<this.chars.length;i++){
    c=this.chars[i];

    /*
     * Treat every consecutive combination of
     * index, state and charge as one cluster.
     */
    if(c.kind==="state"||c.script==="sub"||c.script==="sup"){
      flushNormal();
      sub=[];
      sup=[];
      j=i;

      while(j<this.chars.length){
        /* a formula state: its formula in LaTeX, inside the lower group */
        if(this.chars[j].kind==="fstate"){
          sub.push({tex:"("+conditionToLatex(this.chars[j].condition||[])+")",color:colorOf(j),state:true});
          j++;
          continue;
        }

        if(this.chars[j].kind==="state"){
          pair=this.chars[j].pair;

          while(j<this.chars.length&&this.chars[j].kind==="state"&&this.chars[j].pair===pair){
            sub.push({tex:charTex(this.chars[j].ch),color:colorOf(j),state:true});
            j++;
          }

          continue;
        }

        if(this.chars[j].script==="sub"){
          sub.push({tex:charTex(this.chars[j].ch),color:colorOf(j)});
          j++;
          continue;
        }

        if(this.chars[j].script==="sup"){
          sup.push({tex:charTex(this.chars[j].ch),color:colorOf(j)});
          j++;
          continue;
        }

        break;
      }

      /* the index before the state (H₂O(l): "2" then "(l)") */
      sub.sort(function(a,b){ return (a.state?1:0)-(b.state?1:0); });

      /*
       * Add a shared anchor whenever both a
       * lower and an upper component exist (and before a nuclide's numbers).
       */
      var prescript=this.isPrescript(i,j),pad="";
      if(sub.length&&sup.length||prescript){
        out+="{}";
      }

      /*
       * A nuclide's numbers are right-aligned against the symbol (¹⁴₆C); LaTeX aligns them on the left, so the
       * shorter one is padded on the left with invisible digits.
       */
      if(prescript&&sub.length!==sup.length)pad="\\phantom{"+new Array(Math.abs(sub.length-sup.length)+1).join("0")+"}";

      if(sub.length)out+="_{\\scriptscriptstyle "+(sub.length<sup.length?pad:"")+joinPieces(sub)+"}";
      if(sup.length)out+="^{\\scriptscriptstyle "+(sup.length<sub.length?pad:"")+joinPieces(sup)+"}";

      i=j-1;
      continue;
    }

    /* Arrow with a condition: \xrightarrow stretches under the text. */
    if(c.ch==="→"&&c.condition&&c.condition.length){
      normal.push({tex:"\\xrightarrow{"+conditionToLatex(c.condition)+"}",color:colorOf(i)});
    }else if(c.ch==="⇌"&&c.condition&&c.condition.length){
      normal.push({tex:"\\overset{"+conditionToLatex(c.condition)+"}{\\rightleftharpoons}",color:colorOf(i)});
    }else if(c.ch==="→"){
      normal.push({tex:"\\longrightarrow ",color:colorOf(i)});
    }else if(c.ch==="⇌"){
      normal.push({tex:"\\rightleftharpoons ",color:colorOf(i)});
    }else if(c.ch==="·"){
      normal.push({tex:"\\cdot ",color:colorOf(i)});
    }else{
      normal.push({tex:charTex(c.ch),color:colorOf(i)});
    }
  }

  flushNormal();
  return out;
};

  ChemicalKeyboard.prototype.getValue = function () {
      var s = "";
      var i;

      for (i = 0; i < this.chars.length; i++) {
        if (this.chars[i].kind === "fstate") {
          s += "(" + conditionText(this.chars[i].condition) + ")";
          continue;
        }

        s += this.chars[i].ch;

        /* Condition after its arrow, in the "→[...]" value form. */
        if (this.chars[i].condition && this.chars[i].condition.length) {
          s += "[" + conditionText(this.chars[i].condition) + "]";
        }
      }

      return s;
    };

  /* The answer in the value notation (H_{2}O, SO_{4}^{2-}): setValue(getValueText()) gives the same model. */
  ChemicalKeyboard.prototype.getValueText = function () {
      return valueTextOf(this.chars);
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
        valueText: this.getValueText(),
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
      this.updateValidation();   // a set value (e.g. a saved answer) is checked at once
    };

ChemicalKeyboard.prototype.setMode = function (m) {
    this.mode = m;

    this.panel.style.display = m === "edit" ? "block" : "none";

    this.display.tabIndex = m === "edit" ? 0 : -1;

    this.root.tabIndex = m === "edit" ? 0 : -1;

    this.render();
    this.updateValidation();
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
  this.updateValidation();          // no pause to wait for: the student has finished typing
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

/* ================================================================
   QUESTIONS ON A PAGE (the Moodle snippet of the question builder, QUESTION-BUILDER.md)

   The student-side code lives here, in the library - not in the pasted snippet (2026-10-16): a Moodle
   server or text filter may turn "<", ">" and "&" inside a pasted script into &lt; &gt; &amp;, which breaks
   any JavaScript that uses them. The snippet is now only a box, the configuration (JSON) and a few lines
   without those characters that queue the question and load the library:

     window.__chemkbdQuestions.push({ id: "chemkbd-q1", script: document.currentScript })

   startQueuedQuestions (run when the library loads, and by every later snippet) starts each queued question
   when the page is fully read. A side effect: changes of the student-side code reach Moodle with a library
   release, without copying the questions again.
   ================================================================ */

/*
 * undo what a server or filter may have done to the configuration text: <br /> for each line break (Moodle's
 * auto-format, found 2026-10-16) and HTML escaping
 */
function decodeEntities(text){
  return String(text)
    .replace(/<br\s*\/?>/gi,"")
    .replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"").replace(/&#0?39;/g,"'").replace(/&amp;/g,"&");
}

function startQueuedQuestions(){
  var queue=global.__chemkbdQuestions||[];
  function go(){
    var item;
    while(queue.length){
      item=queue.shift();
      if(item&&item.id)startQuestion(item.id,item.script);
    }
  }
  /* the STACK inputs come after the code in the question text: start when the whole page is read */
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);
  else go();
}

function startQuestion(id,script){
  /* this copy's own element with the given id: the nearest one before its script (another copy may use the same id) */
  function own(x){
    var e;
    for(e=script&&script.previousElementSibling;e;e=e.previousElementSibling){if(e.id===x)return e;}
    return document.getElementById(x);
  }
  var copies=document.querySelectorAll("[id='"+id+"']").length,host,configElement;
  if(copies>1&&global.console)console.warn("[chemkbd "+id+"] "+copies+" keyboards on this page have the id "+id+
    ": the code was pasted more than once, or two questions have the same question id");
  try{
    host=own(id);
    configElement=own(id+"-config");
    if(!host||!configElement)throw new Error("the question box or its configuration is missing");
    runQuestion(host,JSON.parse(decodeEntities(configElement.textContent)));
  }catch(e){
    if(global.console)console.error("[chemkbd "+id+"] failed:",e);
  }
}

/*
 * One question: host - an element with an id; cfg - the question configuration (the builder's JSON).
 * Returns { keyboard, feedback: [reference keyboard of the review page] } (feedback may be empty).
 * Moved here from the builder (where it was chemkbdRun, copied into every snippet).
 */
function runQuestion(host,cfg){
  /*
   * The student language. "system": the language Moodle shows the page in, so one copy of the
   * question serves all languages - window.studentLanguage when a script on the page sets it
   * (e.g. through Moodle's multilang filter), otherwise <html lang="..."> which Moodle sets to the
   * user's current language ("he", "ar", "en", "en_us"...); anything else is English.
   */
  function supported(code){
    code=String(code||"").replace(/['"\s]/g,"").toLowerCase().slice(0,2);
    return code==="he"||code==="ar"||code==="en"?code:"";
  }
  var lang=cfg.language==="system"
    ?(supported(global.studentLanguage)||supported(document.documentElement.lang)||"en")
    :(supported(cfg.language)||"en");
  var CHECK={en:"Check the writing",he:"בדיקת הכתיבה",ar:"فحص الكتابة"};
  var WRITTEN_OK={en:"No writing problems were found.",he:"לא נמצאו בעיות בכתיבה.",ar:"لم يتم العثور على مشكلات في الكتابة."};
  var base=host.id;
  var options,keyboard,button,summary,details,referenceTitle,referenceDiv,feedback=[];

  function make(tag,suffix,css){
    var e=document.createElement(tag);
    if(suffix)e.id=base+"-"+suffix;
    if(css)e.style.cssText=css;
    return e;
  }

  /* the texts (feedback, titles) follow the student language; the formulas are always left to right */
  host.textContent="";
  host.dir=lang==="en"?"ltr":"rtl";
  var FORMULA_CSS="direction:ltr;text-align:left";

  /* ids of the parts: from the host's id, made unique if another keyboard on the page already uses them */
  if(document.getElementById(base+"-keyboard"))base+="-"+(global.__chemkbdRuns=(global.__chemkbdRuns||1)+1);

  var keyboardDiv=make("div","keyboard",FORMULA_CSS);
  keyboardDiv.dir="ltr";
  host.appendChild(keyboardDiv);

  options={
    divId:keyboardDiv.id,
    language:lang,
    mode:"edit",
    correctAnswer:cfg.correctAnswer||"",
    value:cfg.value||""
  };
  if(cfg.elementsMode==="none")options.elements=[];
  else if(cfg.elementsMode==="custom")options.elements=(cfg.elements||[]).slice();
  if(cfg.rubric)options.rubric=cfg.rubric;
  if(cfg.distinguishIsomers)options.distinguishIsomers=true;
  if(cfg.conditions===false)options.conditions=false;     // no reaction-condition (process) keys
  if(cfg.autoSubscript===false)options.autoSubscript=false; // the student chooses subscripts with _ or the key
  if(cfg.ionKeys)options.ionKeys=true;                    // shortcut keys ⁺(aq) and ⁻(aq)
  if(cfg.formulaStateKey)options.formulaStateKey=true;    // key for a state written as a formula, I₂(CCl₄)
  if(cfg.molecules)options.molecules=cfg.molecules;       // molecule keys (they type the formula's characters)
  if(cfg.nuclear){                                        // nuclear equation: particle keys
    options.nuclear=true;
    if(cfg.particleLabels==="full")options.particleLabels="full";
    if(cfg.autoNuclideNumbers)options.autoNuclideNumbers=true;
    if(cfg.states===true)options.states=true;             // state keys in a nuclear question
  }
  if(cfg.displayChars>0)options.displayChars=cfg.displayChars;   // keyboard window width, in characters

  /*
   * Connection to the STACK question (cfg.stack). On every change the keyboard writes into inputs
   * of the same question, and hides them:
   *   scoreInput:  the score from 0 to 1 (rubric score / 100; without a rubric 1 = correct, 0 = not);
   *                the PRT gives it as the mark
   *   answerInput: the answer as value text (H_{2}O, SO_{4}^{2-}); Moodle keeps it, and the
   *                keyboard starts from it when the page is shown again
   * An empty answer empties both, so STACK sees an unanswered question.
   * STACK names its inputs "q<usage>:<slot>_ans1", so an input is found by the end of its name.
   */
  function findInput(name){
    if(!name)return null;
    var que=host.closest&&host.closest(".que");
    return (que||document).querySelector("input[name$='_"+name+"'],textarea[name$='_"+name+"']");
  }
  function setInput(field,value){
    var e,i,types=["input","change"];
    if(!field||field.value===value)return;
    field.value=value;
    for(i=0;i<types.length;i++){
      try{e=new Event(types[i],{bubbles:true});}catch(x){e=document.createEvent("Event");e.initEvent(types[i],true,true);}
      field.dispatchEvent(e);
    }
  }

  /*
   * answerInput holds "answer || score% | feedback | feedback ...": the answer (read back by the
   * keyboard) and, after " || ", the feedback the student got, for Moodle's response history.
   * Quotes and backslashes are left out of the feedback (STACK string input).
   */
  var FEEDBACK_SEPARATOR=" || ";
  function savedAnswer(text){
    var i=text.indexOf(FEEDBACK_SEPARATOR);
    return i>=0?text.slice(0,i):text;
  }
  function feedbackLine(result){
    var parts=[],i,items=result.errors.concat(result.notes||[]);
    if(result.score)parts.push(result.score.total+"%");
    else if(result.correct)parts.push(global.ChemicalGrammar.feedbackText(lang,"correct"));
    for(i=0;i<items.length;i++){
      if(items[i].suppressedBy)continue;      // not counted: caused by another error
      if(items[i].description)parts.push(items[i].description);
    }
    return parts.join(" | ").replace(/["\\⁦-⁩]/g,"");
  }
  function compare(ast){
    return global.ChemicalGrammar.compare(ast,cfg.correctAnswer||"",lang,
      {rubric:cfg.rubric||null,distinguishIsomers:cfg.distinguishIsomers===true});
  }

  var stack=cfg.stack||{};
  var scoreInput=findInput(stack.scoreInput);
  var answerInput=findInput(stack.answerInput);
  if(global.console&&((stack.scoreInput&&!scoreInput)||(stack.answerInput&&!answerInput))){
    console.warn("Chemical keyboard "+base+": STACK input not found:",
      stack.scoreInput&&!scoreInput?stack.scoreInput:"",stack.answerInput&&!answerInput?stack.answerInput:"");
  }
  /* review page (after the attempt is submitted): Moodle shows the inputs read-only */
  var review=[scoreInput,answerInput].some(function(f){return f&&(f.readOnly||f.disabled);});

  /*
   * The teacher's review div (cfg.reviewDiv, an id): a div the teacher puts in the question text and
   * styles (size, place, font size, color). The review output goes into it, and the formulas take
   * its font size. Looked up in the same question first (ids repeat when a question is shown twice).
   * Hidden while answering, so an empty styled box is not seen. Without it the output stays in host.
   */
  var out=host,reviewDiv=null;
  if(cfg.reviewDiv){
    var que=host.closest&&host.closest(".que");
    reviewDiv=(que&&que.querySelector("[id='"+cfg.reviewDiv+"']"))||document.getElementById(cfg.reviewDiv);
    if(!reviewDiv&&global.console)console.warn("Chemical keyboard "+base+": review div not found:",cfg.reviewDiv);
  }
  if(reviewDiv&&!review)reviewDiv.style.display="none";

  if(scoreInput)scoreInput.style.display="none";
  if(answerInput){
    answerInput.style.display="none";
    if(answerInput.value)options.value=savedAnswer(answerInput.value);
  }

  /*
   * Review (after submission): the student's answer, read-only - nothing can change any more.
   * What else is shown is set in the builder (cfg.review, each true unless set to false):
   *   grade:     the score line (with a rubric) or correct / number of issues (without)
   *   reference: the reference answer, marked; when false the student's answer is not marked
   *              either, because the marking gives the answer away
   *   details:   the detailed evaluation (the penalty lines of the rubric / the list of errors)
   */
  if(review){
    var show=cfg.review||{};
    var showGrade=show.grade!==false,showReference=show.reference!==false,showDetails=show.details!==false;

    options.mode="readonly-errors";
    if(reviewDiv){
      out=reviewDiv;
      out.textContent="";
      out.dir=host.dir;
      out.appendChild(keyboardDiv);
      options.fontSize="inherit";
    }
    keyboard=new ChemicalKeyboard(options);
    if(options.value){
      var reviewResult=keyboard.compare();
      if(showReference)keyboard.setComparisonFeedback(reviewResult,"student",options.value);

      /* renderComparison fills both parts; only the parts that are switched on are put on the page */
      summary=make("div","summary","margin-top:8px;font-weight:bold");
      details=make("div","details");
      global.ChemicalGrammar.renderComparison(reviewResult,lang,summary,details);
      if(showGrade)out.appendChild(summary);
      if(showDetails)out.appendChild(details);

      if(showReference){
        referenceTitle=make("div",null,"font-weight:bold;margin:12px 0 4px");
        referenceTitle.textContent=global.ChemicalGrammar.feedbackText(lang,"referenceAnswer");
        referenceDiv=make("div","reference",FORMULA_CSS);
        referenceDiv.dir="ltr";
        out.appendChild(referenceTitle);
        out.appendChild(referenceDiv);
        feedback.push(new ChemicalKeyboard({divId:referenceDiv.id,language:lang,mode:"readonly-errors",value:"",
          fontSize:options.fontSize}));
        feedback[0].setComparisonFeedback(reviewResult,"reference",cfg.correctAnswer||"");
      }
    }
    return {keyboard:keyboard,feedback:feedback};
  }

  if(scoreInput||answerInput){
    options.onChange=function(r){
      var result,score;
      if(!r.model.length){
        setInput(answerInput,"");
        setInput(scoreInput,"");
        return;
      }
      result=compare(r.ast);
      score=result.score?result.score.total/100:(result.correct?1:0);
      /* r.valueText: the answer in the value notation the keyboard reads back exactly (library 2.1.0) */
      setInput(answerInput,r.valueText+FEEDBACK_SEPARATOR+feedbackLine(result));
      setInput(scoreInput,String(Math.round(score*10000)/10000));
    };
  }

  keyboard=new ChemicalKeyboard(options);

  /*
   * Check button while answering: the WRITING only - syntax errors and symbols that are not
   * elements - never the grade or anything that compares with the reference (that is for Moodle's
   * own Check and the review page). The answer is compared with itself, so the only errors left
   * are those of the writing; unbalanced atoms are left out (balancing is part of the task).
   */
  var WRITING_CODES_CHECK=["syntax-error","unknown-element"];
  if(cfg.checkButton){
    button=make("button","check","margin-top:8px;padding:5px 14px;font-size:16px;cursor:pointer");
    button.type="button";
    button.textContent=CHECK[lang];
    summary=make("div","summary","margin-top:8px");
    host.appendChild(button);
    host.appendChild(summary);

    button.addEventListener("click",function(){
      var ast=keyboard.getAST(),problems=[],errors,i,line;
      summary.textContent="";
      if(!keyboard.getModel().length)return;
      errors=global.ChemicalGrammar.compare(ast,ast,lang,{}).errors;
      for(i=0;i<errors.length;i++){
        if(WRITING_CODES_CHECK.indexOf(errors[i].code)>=0&&problems.indexOf(errors[i].description)<0)problems.push(errors[i].description);
      }
      if(!problems.length){
        summary.style.color="#18742a";
        summary.textContent=WRITTEN_OK[lang];
        return;
      }
      summary.style.color="#a12622";
      for(i=0;i<problems.length;i++){
        line=document.createElement("div");
        line.textContent=problems[i];
        summary.appendChild(line);
      }
    });
  }

  return {keyboard:keyboard,feedback:feedback};
}

  ChemicalKeyboard.runQuestion=runQuestion;
  ChemicalKeyboard.startQueuedQuestions=startQueuedQuestions;
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
  validate:validateWriting,
  valueText:valueTextOf,
  elements:SYMBOLS.slice(),
  nuclearKeys:NUCLEAR_KEYS,     // particle keys of a nuclear question (config.nuclear)
  plainFormula:plainFormula,    // "H_{2}O" -> "H₂O" (molecule keys in the builder)
  version:"2.7.0"     // raise with every change, to see in the console which copy a page runs
};

/* questions queued by snippets before the library was loaded */
startQueuedQuestions();
/*
 * Snippets made before 2026-10-16 carry their own code and queue start functions in __chemkbdQueue; the
 * snippet that loads the library runs them on load. When a new snippet loaded the library first, nobody
 * else would run them: run them here (each runs once - the queue is emptied).
 */
(function(){
  var old=global.__chemkbdQueue;
  function go(){ while(old&&old.length){ var f=old.shift(); if(typeof f==="function")f(); } }
  if(old&&old.length){
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);
    else go();
  }
})();
})(window);