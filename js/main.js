const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches,
  $ = (id) => document.getElementById(id);
const els = {
  base: $("baseUrl"),
  source: $("source"),
  medium: $("medium"),
  campaign: $("campaign"),
  content: $("content"),
  term: $("term"),
  normalize: $("normalize"),
  build: $("build"),
  copy: $("copy"),
  reset: $("reset"),
  output: $("output"),
  urlError: $("urlError"),
  length: $("lengthLabel"),
  count: $("paramCount"),
  quality: $("qualityScore"),
  mode: $("modeLabel"),
  statusDot: $("statusDot"),
  statusText: $("statusText"),
  statusMode: $("statusMode"),
  open: $("openLink"),
  fBase: $("fBase"),
  fSource: $("fSource"),
  fMedium: $("fMedium"),
  fCampaign: $("fCampaign"),
  fExtras: $("fExtras"),
};
let finalUrl = "";
const defaults = {
  source: [
    "google",
    "facebook",
    "instagram",
    "linkedin",
    "email",
    "qr",
    "newsletter",
    "youtube",
    "bing",
  ],
  medium: [
    "cpc",
    "paid_social",
    "social",
    "email",
    "display",
    "offline",
    "referral",
    "organic_social",
  ],
  campaign: [
    "fall_2026_launch",
    "spring_2027_campaign",
    "open_house",
    "webinar_series",
    "brand_awareness",
  ],
};
function stored(key) {
  try {
    return [
      ...new Set([
        ...defaults[key],
        ...JSON.parse(localStorage.getItem("utm_" + key) || "[]"),
      ]),
    ];
  } catch {
    return defaults[key];
  }
}
function remember(key, value) {
  if (!value) return;
  const arr = stored(key);
  if (!arr.includes(value)) {
    arr.push(value);
    localStorage.setItem("utm_" + key, JSON.stringify(arr.slice(-30)));
  }
}
function renderLists() {
  [
    ["source", "sourceList"],
    ["medium", "mediumList"],
    ["campaign", "campaignList"],
  ].forEach(([key, id]) => {
    $(id).innerHTML = stored(key)
      .map((v) => `<option value="${v.replace(/"/g, "&quot;")}"></option>`)
      .join("");
  });
}
function norm(v) {
  v = (v || "").trim();
  if (!els.normalize.checked) return v;
  return v
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_\-.]/g, "");
}
function validUrl(v) {
  try {
    const u = new URL(v);
    return ["http:", "https:"].includes(u.protocol);
  } catch {
    return false;
  }
}
function setStatus(kind, text, mode) {
  els.statusDot.className = "status-dot" + (kind ? " " + kind : "");
  els.statusText.textContent = text;
  els.statusMode.textContent = mode;
}
function liveFormula() {
  els.fBase.textContent = els.base.value.trim() || "your destination";
  els.fSource.textContent = norm(els.source.value) || "waiting";
  els.fMedium.textContent = norm(els.medium.value) || "waiting";
  els.fCampaign.textContent = norm(els.campaign.value) || "waiting";
  const ex = [];
  if (norm(els.content.value)) ex.push("content=" + norm(els.content.value));
  if (norm(els.term.value)) ex.push("term=" + norm(els.term.value));
  els.fExtras.textContent = ex.join(" · ") || "none yet";
  els.mode.textContent = els.normalize.checked ? "AUTO" : "RAW";
}
function evaluate(url, paramCount) {
  const n = url.length;
  els.length.textContent = n + " chars";
  els.count.textContent = paramCount;
  let label = "Great";
  if (n > 1800) label = "Long";
  else if (n > 1000) label = "Watch";
  els.quality.textContent = label;
  return label;
}
function buildUrl(quiet = false) {
  const base = els.base.value.trim(),
    source = norm(els.source.value),
    medium = norm(els.medium.value),
    campaign = norm(els.campaign.value),
    content = norm(els.content.value),
    term = norm(els.term.value);
  liveFormula();
  els.urlError.style.display = "none";
  if (!validUrl(base)) {
    els.urlError.style.display = "block";
    setStatus(
      "err",
      "The destination URL needs http:// or https://.",
      "Fix URL",
    );
    if (!quiet) els.base.focus();
    return "";
  }
  if (!source || !medium || !campaign) {
    setStatus(
      "warn",
      "Source, medium, and campaign are required.",
      "Missing fields",
    );
    return "";
  }
  try {
    const u = new URL(base);
    u.searchParams.set("utm_source", source);
    u.searchParams.set("utm_medium", medium);
    u.searchParams.set("utm_campaign", campaign);
    if (content) u.searchParams.set("utm_content", content);
    else u.searchParams.delete("utm_content");
    if (term) u.searchParams.set("utm_term", term);
    else u.searchParams.delete("utm_term");
    finalUrl = u.toString();
    els.output.textContent = finalUrl;
    els.output.classList.remove("empty");
    els.copy.disabled = false;
    els.open.style.display = "flex";
    els.open.href = finalUrl;
    const count = 3 + (content ? 1 : 0) + (term ? 1 : 0);
    evaluate(finalUrl, count);
    remember("source", source);
    remember("medium", medium);
    remember("campaign", campaign);
    renderLists();
    setStatus("ok", "Formula complete. Ready to copy.", "Built");
    if (!quiet) animateBuild();
    return finalUrl;
  } catch (e) {
    console.error(e);
    setStatus("err", "Could not build this URL.", "Error");
    return "";
  }
}
function animateBuild() {
  if (reduceMotion || !window.gsap) return;
  gsap.fromTo(
    ".formula-line",
    { x: -24, opacity: 0.2, rotate: -2 },
    {
      x: 0,
      opacity: 1,
      rotate: 0,
      duration: 0.55,
      stagger: 0.07,
      ease: "back.out(1.7)",
    },
  );
  gsap.fromTo(
    els.output,
    { scale: 0.96, rotate: -1 },
    { scale: 1, rotate: 0, duration: 0.5, ease: "elastic.out(1,.6)" },
  );
}
function copyParty() {
  if (reduceMotion || typeof confetti !== "function") return;
  const end = Date.now() + 1400;
  confetti({
    particleCount: 140,
    spread: 100,
    startVelocity: 50,
    origin: { x: 0.72, y: 0.62 },
  });
  const timer = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(timer);
      return;
    }
    confetti({
      particleCount: 18,
      spread: 70,
      startVelocity: 25,
      origin: { x: 0.6 + Math.random() * 0.35, y: 0.25 + Math.random() * 0.35 },
    });
  }, 180);
}
async function copyUrl() {
  if (!finalUrl) return;
  try {
    await navigator.clipboard.writeText(finalUrl);
    copyParty();
    setStatus("ok", "Copied! Your campaign is ready to travel.", "Copied");
    if (window.gsap && !reduceMotion) {
      gsap.fromTo(
        els.copy,
        { scale: 0.84, rotate: -4 },
        { scale: 1, rotate: 0, duration: 0.7, ease: "elastic.out(1,.4)" },
      );
    }
  } catch {
    const ta = document.createElement("textarea");
    ta.value = finalUrl;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    copyParty();
    setStatus("ok", "Copied! Your campaign is ready to travel.", "Copied");
  }
}
function reset() {
  [
    els.base,
    els.source,
    els.medium,
    els.campaign,
    els.content,
    els.term,
  ].forEach((el) => (el.value = ""));
  els.normalize.checked = true;
  finalUrl = "";
  els.output.textContent = "Your tracking URL will appear here.";
  els.output.classList.add("empty");
  els.copy.disabled = true;
  els.open.style.display = "none";
  els.length.textContent = "0 chars";
  els.count.textContent = "0";
  els.quality.textContent = "--";
  liveFormula();
  setStatus("", "Ready for ingredients.", "Idle");
  if (window.gsap && !reduceMotion)
    gsap.fromTo(
      ".formula-stage",
      { rotate: 2, scale: 0.97 },
      { rotate: 0, scale: 1, duration: 0.45, ease: "back.out(1.5)" },
    );
}
document.querySelectorAll(".preset").forEach((btn) =>
  btn.addEventListener("click", () => {
    els.source.value = btn.dataset.source;
    els.medium.value = btn.dataset.medium;
    liveFormula();
    if (window.gsap && !reduceMotion)
      gsap.fromTo(
        btn,
        { scale: 0.9 },
        { scale: 1, duration: 0.4, ease: "elastic.out(1,.5)" },
      );
  }),
);
els.build.addEventListener("click", () => buildUrl(false));
els.copy.addEventListener("click", copyUrl);
els.reset.addEventListener("click", reset);
[els.base, els.source, els.medium, els.campaign, els.content, els.term].forEach(
  (el) => el.addEventListener("input", liveFormula),
);
els.normalize.addEventListener("change", () => {
  liveFormula();
  if (finalUrl) buildUrl(true);
});
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") buildUrl(false);
});
renderLists();
liveFormula();
if (window.gsap && !reduceMotion) {
  gsap.set(".title-line", { y: 70, opacity: 0, rotate: 3 });
  gsap.set(".reveal", { y: 18, opacity: 0 });
  gsap.set(".panel-in", { y: 30, opacity: 0, scale: 0.97 });
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.to(".reveal", { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 })
    .to(
      ".title-line",
      { y: 0, opacity: 1, rotate: 0, duration: 0.7, stagger: 0.09 },
      "-=.25",
    )
    .to(
      ".panel-in",
      { y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.1 },
      "-=.35",
    );
  gsap.to(".mark", { rotate: 354, duration: 16, repeat: -1, ease: "none" });
  gsap.to(".blob.a", {
    x: -18,
    y: 14,
    rotation: "+=8",
    duration: 4.3,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
  gsap.to(".blob.b", {
    x: 16,
    y: -10,
    scale: 1.05,
    duration: 5,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
  gsap.to(".blob.c", {
    y: 20,
    rotation: "+=10",
    duration: 3.7,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
  document.querySelectorAll(".wobble").forEach((btn) => {
    btn.addEventListener("mouseenter", () =>
      gsap.to(btn, {
        rotate: Math.random() > 0.5 ? 1.5 : -1.5,
        duration: 0.18,
      }),
    );
    btn.addEventListener("mouseleave", () =>
      gsap.to(btn, { rotate: 0, duration: 0.3, ease: "elastic.out(1,.5)" }),
    );
  });
}
