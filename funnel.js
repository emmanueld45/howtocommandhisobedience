/* ============ CONFIGURATION ============ */
const CHECKOUT = {
  4500: "https://selar.com/9v9203v295",
  8500: "https://selar.com/9v9203v295"
};
const EXIT_DOWNSELL_URL = "https://selar.com/9v9203v295";
const PIXEL_ID = "987425530787333";
const SAVE_ENDPOINT = ""; 

/* ============ STATE VARIABLES (INITIALIZED AT TOP) ============ */
let cur = "p1";
let hist = [];
let qi = 0;
let plan = 4500;
let ctry = ["NG", "Nigeria", "234"];
let busy = false;
let pi = 0;

/* Helper DOM selector */
const $ = id => document.getElementById(id);
const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch(e) { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch(e) {} }
};

function uid() {
  const a = new Uint8Array(5);
  (window.crypto || { getRandomValues: x => x.forEach((_, i) => x[i] = Math.random() * 255) }).getRandomValues(a);
  return "DEV-" + Array.from(a, b => b.toString(36).padStart(2, "0")).join("").toUpperCase();
}

const qs = new URLSearchParams(location.search);
const lead = {
  lead_id: store.get("lead_id") || uid(),
  full_name: "", country: "Nigeria", country_code: "+234", phone: "", phone_international: "", email: "",
  situation: "", power_leak: "", target_goal: "", investment: 4500, selected_plan: "Digital Ebook + Launch Bonus Pack",
  current_page: "p1", journey_status: "started",
  utm_source: qs.get("utm_source"), utm_medium: qs.get("utm_medium"), utm_campaign: qs.get("utm_campaign"),
  fbclid: qs.get("fbclid"), referrer: document.referrer || null
};
store.set("lead_id", lead.lead_id);

/* Meta Pixel Tracker */
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
try { fbq('init', PIXEL_ID); fbq('track', 'PageView'); } catch(e){}
function px(name, custom) {
  try { if (custom) { fbq('trackCustom', name); } else { fbq('track', name); } } catch(e){}
}

/* Reader Proof & Testimonials */
const PROOF = [
  { q: "I applied Chapter 4 ('The Soft Authority Register') during dinner when he canceled plans last minute. Instead of an argument, his entire demeanor changed. He apologized sincerely and planned our next three dates without me saying a single bitter word.", n: "Sarah M., Lagos, Nigeria" },
  { q: "I used to be the 'understanding girlfriend' who accepted bare minimum effort. Reading this book made me realize how much power I was throwing away. Within 2 weeks of practicing the micro-shifts, my partner started treating me with a level of respect I hadn't felt in 4 years.", n: "Kimberly O., Abuja" },
  { q: "The section on 'Setting Subconscious Boundaries' is pure gold. You don't have to yell or manipulate. You just speak and carry yourself differently. Men instinctively feel it and step up.", n: "Tiwa L., Port Harcourt" },
  { q: "Single women NEED this before dating again. It saves you from months of wasting time on men who never intended to give you real commitment. Worth 10x the price.", n: "Blessing A., Accra, Ghana" }
];

/* Countries list: [iso, name, dial] */
const C = [
  ["NG","Nigeria","234"],["GH","Ghana","233"],["KE","Kenya","254"],["ZA","South Africa","27"],["GB","United Kingdom","44"],["US","United States","1"],["CA","Canada","1"],
  ["SL","Sierra Leone","232"],["LR","Liberia","231"],["GM","Gambia","220"],["UG","Uganda","256"],["TZ","Tanzania","255"],["RW","Rwanda","250"],["CM","Cameroon","237"],
  ["BJ","Benin","229"],["CI","Côte d'Ivoire","225"],["SN","Senegal","221"],["TG","Togo","228"],["ZM","Zambia","260"],["ZW","Zimbabwe","263"],["BW","Botswana","267"],
  ["AE","United Arab Emirates","971"],["SA","Saudi Arabia","966"],["QA","Qatar","964"],["IE","Ireland","353"],["FR","France","33"],["DE","Germany","49"],["AU","Australia","61"]
];
const flag = iso => iso ? iso.replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0))) : "🇳🇬";

/* Diagnostic Quiz Questions */
const Q = [
  {
    k: "status",
    t: "What best describes your current dating or relationship state?",
    m: "Pick the option that resonates most with where you are today.",
    o: [
      "I am in a relationship, but feeling taken for granted or neglected",
      "I am single and tired of attracting low-effort, indecisive men",
      "I am dating someone, but the dynamic is one-sided or confusing",
      "I am ready to step into my dark feminine gravity and quiet power"
    ]
  },
  {
    k: "leak",
    t: "Where do you feel your power leaks the most with men?",
    m: "Be completely honest with yourself.",
    o: [
      "Over-explaining my feelings when I feel hurt or ignored",
      "Being overly available and doing too much too soon",
      "Tolerating inconsistencies because I don't want to cause conflict",
      "Struggling to set boundaries without sounding angry or naggy"
    ]
  },
  {
    k: "goal",
    t: "What is the #1 outcome you want to create?",
    m: "Select your highest priority transformation.",
    o: [
      "Command his deep respect and have him willingly step up to lead",
      "Become unforgettable and fiercely cherished from the first date",
      "Stop feeling anxious and reclaim my calm, magnetic detachment",
      "Have the exact words and scripts for any conflict or testing moment"
    ]
  }
];

/* Currency Rates & Approximation */
const CUR = {
  NG: "NGN", GH: "GHS", SL: "SLE", KE: "KES", ZA: "ZAR", GB: "GBP", US: "USD", CA: "CAD",
  BJ: "XOF", CM: "XAF", CI: "XOF", SN: "XOF", TG: "XOF", LR: "LRD", GM: "GMD", UG: "UGX",
  TZ: "TZS", RW: "RWF", AE: "AED", SA: "SAR", IE: "EUR", FR: "EUR", DE: "EUR", AU: "AUD"
};
let RATES = { USD: 1, NGN: 1500, GHS: 12.5, KES: 130, ZAR: 18.2, GBP: 0.76, CAD: 1.37, EUR: 0.92, XOF: 600, XAF: 600, UGX: 3650 };

function money(v, code) {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency: code, maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(v);
  } catch(e) {
    return code + " " + Math.round(v);
  }
}

function converted(ngn, code) {
  const r = RATES[code], n = RATES.NGN;
  if (!r || !n) return null;
  let v = ngn / n * r;
  if (v >= 100) v = Math.round(v / (v >= 10000 ? 100 : 10)) * (v >= 10000 ? 100 : 10);
  return v;
}

function approx(ngn) {
  const code = (ctry && ctry[0] && CUR[ctry[0]]) ? CUR[ctry[0]] : "USD";
  const usd = converted(ngn, "USD");
  const parts = [];
  if (code !== "NGN" && code !== "USD") {
    const l = converted(ngn, code);
    if (l) parts.push(money(l, code));
  }
  if (usd) parts.push(money(usd, "USD"));
  return parts.length ? "about " + parts.join(" or ") : "";
}

function renderAmts() {
  document.querySelectorAll("#amts .plan").forEach(b => {
    const al = b.querySelector(".al");
    if (al) al.textContent = approx(+b.dataset.v);
  });
  const da = document.getElementById("d_approx");
  if (da && cur === "p6") da.textContent = approx(plan);
}

try {
  fetch("https://open.er-api.com/v6/latest/USD")
    .then(r => r.json())
    .then(d => {
      if (d && d.rates && d.rates.NGN) {
        RATES = Object.assign(RATES, d.rates);
        renderAmts();
      }
    }).catch(() => {});
} catch(e) {}

/* Plan Content Stack */
const PLANS = {
  4500: {
    name: "Digital Ebook + Launch Bonus Pack",
    intro: "Instant digital download access to the complete 160-page manual, plus 3 fast-action bonus guides:",
    sections: [
      {
        h: "Core Ebook Chapters Included",
        items: [
          ["Chapter 1: The Psychology of Male Devotion", "Why negotiating respect backfires, and how the primal Hero Instinct creates deep loyalty."],
          ["Chapter 2: The Soft Authority Register", "How to speak, pause, and text with effortless conviction so your words carry undisputed weight."],
          ["Chapter 3: Dark Feminine Gravity & Detachment", "Shifting from anxious availability into high-status, self-contained mystery that makes him pursue."],
          ["Chapter 4: Subconscious Boundary Architecture", "How to set and hold non-negotiable standards without raising your voice, yelling, or giving ultimatums."],
          ["Chapter 5: The Devotion Reward Loop", "The psychological trigger that makes making you happy his greatest masculine achievement."],
          ["Chapter 6: Resolving Coldness & Low Effort", "How to effortlessly turn around emotional distance, dry texting, or taking you for granted."]
        ]
      },
      {
        h: "Fast-Action Bonuses Included Free Today",
        items: [
          ["Bonus 1: The 50 High-Value Text Swipe File (Value ₦7,500)", "Ready-to-use text responses for dry messages, last-minute cancellations, testing questions, and setting boundaries."],
          ["Bonus 2: The 7-Day Respect Reset Blueprint (Value ₦5,000)", "A daily step-by-step action plan to completely reset your relationship dynamic in one week."],
          ["Bonus 3: Dark Feminine Body Language Cheat Sheet (Value ₦4,000)", "Subtle physical micro-cues, eye contact, and posture habits that radiate unshakeable poise."]
        ]
      },
      {
        h: "Our 60-Day Unconditional Guarantee",
        items: [
          ["100% Risk-Free 60-Day Guarantee", "Read the entire book and test the frameworks. If you don't feel a profound shift in how he honors and treats you, receive a full refund immediately."]
        ]
      }
    ]
  },
  8500: {
    name: "VIP Dark Feminine Mastery Pack",
    intro: "Everything in the ₦4,500 Ebook Edition, PLUS the Complete VIP Audio Masterclass and Master Vault:",
    sections: [
      {
        h: "Complete Ebook & Bonuses",
        items: [
          ["Full Ebook Edition + All 3 Fast-Action Bonuses", "Instant PDF & ePub download accessible on any smartphone, tablet, or laptop."]
        ]
      },
      {
        h: "Exclusive VIP Additions",
        items: [
          ["The Soft Authority Audio Masterclass", "Listen on the go to vocal tone demonstrations, real-world cadence coaching, and live breakdown examples."],
          ["The Conflict Dissolution Master Vault", "Done-for-you word-for-word scripts to defuse tension and redirect anger into deep masculine understanding."],
          ["The High-Value Woman Daily Rituals Journal", "Daily morning and evening mindset calibrations to anchor your dark feminine power permanently."],
          ["Priority VIP Selar Delivery & Lifetime Updates", "Get all future expanded chapters and bonus additions automatically delivered."]
        ]
      },
      {
        h: "Our 60-Day Unconditional Guarantee",
        items: [
          ["100% Risk-Free 60-Day Guarantee", "Try the entire VIP Mastery Pack. If it does not completely transform your love life, simply email us for a prompt, courteous refund."]
        ]
      }
    ]
  }
};

/* Logging / Saving helper */
async function post(body, key) {
  if (!SAVE_ENDPOINT) return true;
  try {
    const r = await fetch(SAVE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({ idempotency_key: key }, body)),
      keepalive: true
    });
    return r.ok;
  } catch(e) {
    return true;
  }
}

function saveLead(status, event) {
  lead.journey_status = status;
  lead.current_page = cur;
  const body = { kind: "lead", event: event || status, ...lead, timestamp: new Date().toISOString() };
  return post(body, lead.lead_id + ":" + status);
}

function logEvent(event) {
  post({ kind: "event", event, lead_id: lead.lead_id, current_page: cur, timestamp: new Date().toISOString() }, lead.lead_id + ":ev:" + event + ":" + Date.now());
}

/* Screen Navigation */
function go(id, t, noHist) {
  const app = $("app");
  if (app) app.dataset.t = t || "slide";
  
  const to = $(id);
  if (!to) {
    console.warn("Screen not found:", id);
    return;
  }

  if (cur && !noHist) hist.push(cur);

  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active", "out", "in");
  });
  
  to.classList.add("active", "in");
  window.scrollTo(0, 0);
  cur = id;
  lead.current_page = id;
}

/* Button Navigation */
const b1 = $("b1");
if (b1) {
  b1.onclick = (e) => {
    e.preventDefault();
    px("StoryExplored", 1);
    logEvent("StoryExplored");
    go("p2", "slide");
  };
}

const b2 = $("b2");
if (b2) {
  b2.onclick = (e) => {
    e.preventDefault();
    px("SolutionAccepted", 1);
    go("p3", "calm");
  };
}

/* Testimonials Carousel */
function showProof() {
  const p = $("proof");
  const pq = $("pq");
  const pc = $("pc");
  if (!p || !pq || !pc) return;
  p.classList.add("fade");
  setTimeout(() => {
    pq.textContent = "“" + PROOF[pi].q + "”";
    pc.textContent = PROOF[pi].n;
    p.classList.remove("fade");
    pi = (pi + 1) % PROOF.length;
  }, 350);
}
showProof();
setInterval(() => {
  if (cur === "p2") showProof();
}, 7500);
const proofEl = $("proof");
if (proofEl) proofEl.onclick = showProof;

/* Country Selector */
function renderCountry() {
  const cfl = $("cfl");
  const ccode = $("ccode");
  if (cfl) cfl.textContent = flag(ctry[0]);
  if (ccode) ccode.textContent = "+" + ctry[2];
}

function closeCountryModal() {
  const sheet = $("sheet");
  if (sheet) sheet.classList.remove("open");
}

function renderList(f) {
  const q = (f || "").toLowerCase().trim(), L = $("clist");
  if (!L) return;
  L.innerHTML = "";
  C.filter(c => !q || c[1].toLowerCase().includes(q) || c[2].includes(q.replace("+", ""))).forEach(c => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "crow";
    b.innerHTML = '<span class="fl">' + flag(c[0]) + '</span><span>' + c[1] + '</span><span class="dc">+' + c[2] + '</span>';
    b.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      ctry = c;
      renderCountry();
      renderAmts();
      closeCountryModal();
      const fphone = $("fphone");
      if (fphone) fphone.focus();
    };
    L.appendChild(b);
  });
}

const cbtn = $("cbtn");
if (cbtn) {
  cbtn.onclick = (e) => {
    e.preventDefault();
    renderList("");
    const csearch = $("csearch");
    if (csearch) csearch.value = "";
    const sheet = $("sheet");
    if (sheet) sheet.classList.add("open");
    setTimeout(() => { if (csearch) csearch.focus(); }, 50);
  };
}

const csearch = $("csearch");
if (csearch) {
  csearch.oninput = e => renderList(e.target.value);
}

const sheetClose = $("sheetClose");
if (sheetClose) {
  sheetClose.onclick = (e) => {
    e.preventDefault();
    closeCountryModal();
  };
}

const sheetEl = $("sheet");
if (sheetEl) {
  sheetEl.onclick = (e) => {
    if (e.target.id === "sheet") closeCountryModal();
  };
}

// Initial renders
renderCountry();
renderAmts();

/* Form Validation & Submission (Page 3) */
function fullPhone() {
  const fphone = $("fphone");
  let d = fphone ? fphone.value.replace(/\D/g, "") : "";
  const code = (ctry && ctry[2]) ? ctry[2] : "234";
  if (d.startsWith(code) && d.length > code.length + 6) d = d.slice(code.length);
  d = d.replace(/^0+/, "");
  return d;
}

const b3 = $("b3");
if (b3) {
  b3.onclick = (e) => {
    if (e) e.preventDefault();
    
    // Clear previous errors
    ["e_name", "e_phone", "e_email", "e_form"].forEach(i => {
      const el = $(i);
      if (el) el.textContent = "";
    });
    
    const fname = $("fname");
    const femail = $("femail");
    const name = fname ? fname.value.trim().replace(/\s+/g, " ") : "";
    const nat = fullPhone();
    const email = femail ? femail.value.trim() : "";
    let ok = true;
    
    if (!name || name.length < 2) {
      const eName = $("e_name");
      if (eName) eName.textContent = "Please enter your name.";
      ok = false;
    }
    if (!nat || nat.length < 5 || nat.length > 15) {
      const ePhone = $("e_phone");
      if (ePhone) ePhone.textContent = "Please enter a valid phone number.";
      ok = false;
    }
    if (!email || email.length < 3 || !email.includes("@")) {
      const eEmail = $("e_email");
      if (eEmail) eEmail.textContent = "Please enter your email address.";
      ok = false;
    }
    
    if (!ok) {
      const eForm = $("e_form");
      if (eForm) eForm.textContent = "Please fill in all fields correctly.";
      return;
    }

    const cName = (ctry && ctry[1]) ? ctry[1] : "Nigeria";
    const cDial = (ctry && ctry[2]) ? ctry[2] : "234";

    Object.assign(lead, {
      full_name: name,
      country: cName,
      country_code: "+" + cDial,
      phone: nat,
      phone_international: "+" + cDial + nat,
      email: email
    });

    try {
      saveLead("info_submitted", "LeadInfoSubmitted");
      px("LeadSubmitted", 1);
    } catch(err) {}

    // Advance to Diagnostic Quiz
    startQ();
    go("p4", "slide");
  };
}

/* Diagnostic Engine (Page 4) */
function startQ() {
  qi = 0;
  drawQ();
}

function drawQ() {
  const q = Q[qi], w = $("qwrap");
  if (!w || !q) return;
  const cards = q.o.map((o, i) => '<button class="card" type="button" data-i="' + i + '"><span>' + o + '</span></button>').join("");
  w.innerHTML = '<div class="qstep show"><div class="qcount">Diagnostic Step ' + (qi + 1) + ' of ' + Q.length + '</div><div class="qtitle">' + q.t + '</div><p class="micro">' + q.m + '</p><div class="cards">' + cards + '</div></div>';
  w.querySelectorAll(".card").forEach(b => b.onclick = (e) => {
    e.preventDefault();
    pick(b, q);
  });
}

function pick(btn, q) {
  const w = $("qwrap");
  if (!w || w.dataset.lock) return;
  w.dataset.lock = "1";
  w.querySelectorAll(".card").forEach(c => c.classList.remove("sel"));
  btn.classList.add("sel");
  
  const val = btn.textContent.trim();
  if (q.k === "status") lead.situation = val;
  if (q.k === "leak") lead.power_leak = val;
  if (q.k === "goal") lead.target_goal = val;

  setTimeout(() => {
    delete w.dataset.lock;
    if (qi < Q.length - 1) {
      qi++;
      drawQ();
    } else {
      try {
        px("DiagnosticCompleted", 1);
        logEvent("DiagnosticCompleted");
        saveLead("completed", "DiagnosticCompleted");
      } catch(e) {}
      go("p5", "rise");
    }
  }, 380);
}

/* Plan Detail (Page 6) */
const esc = t => String(t).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

function showPlan(v, swap) {
  plan = v;
  const P = PLANS[v];
  if (!P) return;
  const dTag = $("d_tag");
  const dPrice = $("d_price");
  const dApprox = $("d_approx");
  const dProof = $("d_proof");
  const dBody = $("d_body");
  const l6 = $("l6");
  const e6 = $("e6");

  if (dTag) dTag.textContent = P.name;
  if (dPrice) dPrice.textContent = "₦" + v.toLocaleString("en");
  if (dApprox) dApprox.textContent = approx(v);
  
  const PROOFLINE = {
    4500: '"I applied Chapter 4 during dinner... his entire tone shifted and he planned our next 3 dates." (Sarah M., Lagos)',
    8500: '"This taught me how to handle disrespect without losing my cool. He treats me like royalty now." (Kimberly O., Abuja)'
  };
  if (dProof) dProof.textContent = PROOFLINE[v] || "";
  
  let h = '<div class="pbody' + (swap ? ' swap' : '') + '">';
  if (P.intro) h += '<p class="pintro">' + esc(P.intro) + '</p>';
  P.sections.forEach(sec => {
    h += '<div class="psec">' + esc(sec.h) + '</div><ul class="pitems">' + sec.items.map(i => '<li><h3>' + esc(i[0]) + '</h3><p>' + esc(i[1]) + '</p></li>').join("") + '</ul>';
  });
  if (dBody) dBody.innerHTML = h + '</div>';
  if (l6) l6.textContent = (plan === 4500 ? "View the VIP Dark Feminine Mastery Pack (₦8,500)" : "View the Standard Digital Ebook (₦4,500)");
  if (e6) e6.textContent = "";
}

document.querySelectorAll("#amts .plan").forEach(b => {
  b.onclick = (e) => {
    e.preventDefault();
    showPlan(+b.dataset.v);
    go("p6", "slide");
  };
});

const l6 = $("l6");
if (l6) {
  l6.onclick = (e) => {
    e.preventDefault();
    showPlan(plan === 4500 ? 8500 : 4500, true);
  };
}

/* Immediate Checkout Redirection */
function beaconSave(status, event) {
  lead.journey_status = status;
  lead.current_page = cur;
  const body = { kind: "lead", event: event || status, ...lead, timestamp: new Date().toISOString() };
  if (!SAVE_ENDPOINT) return false;
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(body)], { type: "application/json" });
      return navigator.sendBeacon(SAVE_ENDPOINT, blob);
    }
  } catch(e) {}
  return false;
}

const b6 = $("b6");
if (b6) {
  b6.onclick = (e) => {
    e.preventDefault();
    if (busy) return;
    busy = true;
    const e6 = $("e6");
    if (e6) e6.textContent = "";
    lead.investment = plan;
    lead.display_currency = (ctry && ctry[0] && CUR[ctry[0]]) ? CUR[ctry[0]] : "USD";
    lead.selected_plan = PLANS[plan].name;
    
    let checkoutUrl = CHECKOUT[plan] || CHECKOUT[4500];
    if (lead.email || lead.full_name || lead.phone) {
      const params = new URLSearchParams();
      if (lead.email) params.set("email", lead.email);
      if (lead.full_name) params.set("name", lead.full_name);
      if (lead.phone_international) params.set("phone", lead.phone_international);
      if (checkoutUrl.includes("?")) {
        checkoutUrl += "&" + params.toString();
      } else {
        checkoutUrl += "?" + params.toString();
      }
    }

    try {
      beaconSave("checkout", "InitiateCheckout");
      saveLead("checkout", "InitiateCheckout");
      px("InitiateCheckout");
    } catch(e) {}
    lead.checkout_url = checkoutUrl;
    
    location.href = checkoutUrl;
    setTimeout(() => {
      hist = [];
      go("pcheck", "calm", true);
      busy = false;
    }, 400);
  };
}

const bcheck = $("bcheck");
if (bcheck) {
  bcheck.onclick = (e) => {
    e.preventDefault();
    location.href = lead.checkout_url || CHECKOUT[4500];
  };
}

/* Exit-Intent & Mobile Back-Button Interception */
(function() {
  let shown = false;
  const overlay = document.getElementById('exitIntentModal');
  const cta = document.getElementById('emCta');
  
  if (typeof approx === "function") {
    try { 
      const emApprox = document.getElementById('emApprox');
      if (emApprox) emApprox.textContent = approx(2000); 
    } catch(e) {}
  }
  if (cta) cta.href = EXIT_DOWNSELL_URL;
  
  function open() {
    if (shown || !overlay) return;
    shown = true;
    overlay.classList.add('open');
    try { if (typeof px === "function") px("DownsellOffered", 1); } catch(e) {}
  }
  
  function close() {
    if (overlay) overlay.classList.remove('open');
  }
  
  const emClose = document.getElementById('emClose');
  const emDecline = document.getElementById('emDecline');
  if (emClose) emClose.onclick = close;
  if (emDecline) emDecline.onclick = close;
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) close();
    });
  }
  
  if (cta) {
    cta.addEventListener('click', function() {
      try { if (typeof px === "function") px("DownsellClick", 1); } catch(e) {}
    });
  }

  // Desktop mouse exit
  document.addEventListener('mouseleave', function(e) {
    if (e.clientY <= 0) open();
  });

  // Mobile Back Button Popstate Hook
  try {
    history.pushState({ devExit: 1 }, '', location.href);
    window.addEventListener('popstate', function() {
      if (!shown) {
        open();
        history.pushState({ devExit: 1 }, '', location.href);
      }
    });
  } catch(e) {}
})();
