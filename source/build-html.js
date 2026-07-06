const fs = require("fs");
const path = require("path");
const { renderPart, buildUnitList } = require("./html-render.js");

const CONTENT_DIR = __dirname;
const OUT_DIR = path.join(__dirname, "..");

// ---- Load the exact same content used for the Word document build ----
const part1 = require(path.join(CONTENT_DIR, "content-part1.js"));
const part1b = require(path.join(CONTENT_DIR, "content-part1b.js"));
const part1c = require(path.join(CONTENT_DIR, "content-part1c.js"));
const part2 = require(path.join(CONTENT_DIR, "content-part2.js"));
const part2b = require(path.join(CONTENT_DIR, "content-part2b.js"));
const part2c = require(path.join(CONTENT_DIR, "content-part2c.js"));
const part3 = require(path.join(CONTENT_DIR, "content-part3.js"));
const capstone = require(path.join(CONTENT_DIR, "content-capstone.js"));
const labmanual1 = require(path.join(CONTENT_DIR, "content-labmanual1.js"));
const labmanual2 = require(path.join(CONTENT_DIR, "content-labmanual2.js"));

// Same merge + sequential renumbering as the docx build, so unit numbers match exactly
part1.units = [...part1.units, ...part1b.units, ...part1c.units];
part2.units = [...part2.units, ...part2b.units, ...part2c.units];
let _seq = 1;
[...part1.units, ...part2.units].forEach(u => { u.number = String(_seq++); });

const labmanual = {
  partTitle: "PART IV — JNTUK R23 LAB MANUAL",
  partSubtitle: "Flutter Application Development Laboratory — 10 Experiments (as per JNTUK Kakinada R23 Regulation)",
  unitLabel: "Experiment",
  units: [...labmanual1.units, ...labmanual2.units],
};

// ---- Site page registry ----
const PAGES = [
  { key: "part1", href: "part1-dart.html", nav: "I. The Dart Language", part: part1 },
  { key: "part2", href: "part2-flutter.html", nav: "II. The Flutter Framework", part: part2 },
  { key: "part3", href: "part3-capstone.html", nav: "III. Capstone Project", part: capstone },
  { key: "part4", href: "part4-labmanual.html", nav: "IV. JNTUK R23 Lab Manual", part: labmanual },
  { key: "part5", href: "part5-appendices.html", nav: "V. Quick-Reference Appendices", part: part3 },
];

const HEAD_ASSETS = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css">
  <link rel="stylesheet" href="assets/style.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
`;

function sidebar(activeKey, unitNavHtml) {
  const partsNav = PAGES.map(p =>
    `<a href="${p.href}" class="${p.key === activeKey ? "active" : ""}">${p.nav}</a>`
  ).join("\n");

  return `
  <aside class="sidebar">
    <a href="index.html" style="text-decoration:none;">
      <span class="logo">Dart &amp; Flutter</span>
      <span class="logo-sub">Complete Manual</span>
    </a>
    <nav class="parts">${partsNav}</nav>
    ${unitNavHtml ? `<div class="unit-nav">
      <span class="unit-nav-label">On this page</span>
      <ul>${unitNavHtml}</ul>
    </div>` : ""}
  </aside>`;
}

function topbar() {
  return `
  <div class="topbar">
    <button data-nav-toggle aria-label="Toggle navigation">&#9776; Menu</button>
    <span class="brand">Dart &amp; Flutter Manual</span>
  </div>`;
}

function pageNav(currentIndex) {
  const prev = PAGES[currentIndex - 1];
  const next = PAGES[currentIndex + 1];
  let html = `<div class="page-nav">`;
  html += prev
    ? `<a href="${prev.href}"><span class="dir">&larr; Previous</span>${prev.nav}</a>`
    : `<span></span>`;
  html += next
    ? `<a href="${next.href}" class="next"><span class="dir">Next &rarr;</span>${next.nav}</a>`
    : `<span></span>`;
  html += `</div>`;
  return html;
}

function pageTemplate({ title, activeKey, unitNavHtml, bodyHtml, currentIndex }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} · Dart & Flutter Manual</title>
${HEAD_ASSETS}
</head>
<body>
${topbar()}
<div class="shell">
${sidebar(activeKey, unitNavHtml)}
<main class="main">
  <div class="content-wrap">
    ${bodyHtml}
    ${pageNav(currentIndex)}
  </div>
</main>
</div>
<script src="assets/script.js"></script>
</body>
</html>`;
}

// ---- Render each content page ----
PAGES.forEach((page, index) => {
  const bodyHtml = renderPart(page.part);
  const unitNavHtml = buildUnitList(page.part);
  const html = pageTemplate({
    title: page.part.partTitle.replace(/^PART [IVX]+ — /, ""),
    activeKey: page.key,
    unitNavHtml,
    bodyHtml,
    currentIndex: index,
  });
  fs.writeFileSync(path.join(OUT_DIR, page.href), html);
  console.log("Wrote", page.href, `(${page.part.units.length} units)`);
});

// ---- Landing page ----
const partCards = [
  { roman: "I", title: "The Dart Language", desc: "Variables, control flow, functions, collections, OOP, generics, async/await, null safety, and more.", href: "part1-dart.html", count: `${part1.units.length} units` },
  { roman: "II", title: "The Flutter Framework", desc: "Widgets, layouts, navigation, state management, networking, persistence, animation, and deployment.", href: "part2-flutter.html", count: `${part2.units.length} units` },
  { roman: "III", title: "Capstone Project", desc: "A complete, 9-step walkthrough building a working app end-to-end.", href: "part3-capstone.html", count: `${capstone.units.length} steps` },
  { roman: "IV", title: "JNTUK R23 Lab Manual", desc: "All 10 prescribed lab experiments — fully commented programs, expected output, and viva questions.", href: "part4-labmanual.html", count: "10 experiments" },
  { roman: "V", title: "Quick-Reference Appendices", desc: "Syntax cheat sheets, widget catalog, troubleshooting guide, CLI reference, glossary, and more.", href: "part5-appendices.html", count: `${part3.units.length} appendices` },
];

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dart & Flutter — A Complete Language & Framework Manual</title>
${HEAD_ASSETS}
</head>
<body>
<div class="hero">
  <div class="eyebrow">LBRCE &middot; Department of AI &amp; DS &middot; JNTUK R23</div>
  <h1>Dart &amp; Flutter</h1>
  <div class="tagline">A Complete Language &amp; Framework Manual</div>
  <div class="sub">From Dart fundamentals to shipped Flutter applications — structured textbook chapters, a full capstone build, the complete JNTUK R23 lab manual, and quick-reference appendices.</div>
  <div class="cta-row">
    <a class="cta primary" href="part1-dart.html">Start Reading &rarr;</a>
    <a class="cta secondary" href="Dart_Flutter_Complete_Manual.docx">Download Word Version</a>
  </div>
</div>
<div class="landing-wrap">
  <h2>Five Parts, Cover to Cover</h2>
  <div class="section-sub">Every page of the printed manual, browsable online.</div>
  <div class="part-grid">
    ${partCards.map(c => `
    <a class="part-card" href="${c.href}">
      <span class="roman">${c.roman}</span>
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
      <span class="count">${c.count}</span>
    </a>`).join("\n")}
  </div>
</div>
<div class="landing-footer">
  Prepared for the JNTUK B.Tech AI &amp; DS Curriculum &middot; Department of Artificial Intelligence &amp; Data Science, LBRCE (Autonomous), Mylavaram &middot;
  <a href="https://github.com/smsamspublications">smsamspublications</a>
</div>
</body>
</html>`;

fs.writeFileSync(path.join(OUT_DIR, "index.html"), indexHtml);
console.log("Wrote index.html");
console.log("\nSite build complete.");
