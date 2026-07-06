// html-render.js - converts the same block schema used for the docx build
// into styled HTML for the GitHub Pages site.

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Parses **bold** and `code` spans. Input is raw (unescaped) text.
function parseInlineHtml(text) {
  const escaped = escapeHtml(text);
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  return escaped.replace(regex, (match) => {
    if (match.startsWith("**")) {
      return `<strong>${match.slice(2, -2)}</strong>`;
    } else {
      return `<code class="inline-code">${match.slice(1, -1)}</code>`;
    }
  });
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function renderBlock(block) {
  switch (block.type) {
    case "p":
      return `<p>${parseInlineHtml(block.text)}</p>`;
    case "h3":
      return `<h3 id="${slugify(block.text)}">${parseInlineHtml(block.text)}</h3>`;
    case "h2":
      return `<h4>${parseInlineHtml(block.text)}</h4>`;
    case "ul":
      return `<ul>${block.items.map(i => `<li>${parseInlineHtml(i)}</li>`).join("")}</ul>`;
    case "ol":
      return `<ol>${block.items.map(i => `<li>${parseInlineHtml(i)}</li>`).join("")}</ol>`;
    case "code":
      return `<pre><code>${escapeHtml(block.text)}</code></pre>`;
    case "note": {
      const cls = block.kind === "warning" ? "note warning" : "note tip";
      const label = block.kind === "warning" ? "CAUTION" : "TIP";
      return `<div class="${cls}"><span class="note-label">${label}</span>${parseInlineHtml(block.text)}</div>`;
    }
    case "table": {
      const head = `<thead><tr>${block.header.map(h => `<th>${parseInlineHtml(h)}</th>`).join("")}</tr></thead>`;
      const body = `<tbody>${block.rows.map(r => `<tr>${r.map(c => `<td>${parseInlineHtml(String(c))}</td>`).join("")}</tr>`).join("")}</tbody>`;
      return `<div class="table-wrap"><table>${head}${body}</table></div>`;
    }
    case "keypoints":
      return `<div class="keypoints"><div class="keypoints-label">KEY POINTS</div><ul>${block.items.map(i => `<li>${parseInlineHtml(i)}</li>`).join("")}</ul></div>`;
    case "spacer":
      return "";
    default:
      return "";
  }
}

function renderUnit(unit, labelPrefix) {
  const label = labelPrefix || "Unit";
  const id = `unit-${unit.number}`;
  const heading = `<h2 id="${id}" class="unit-heading"><span class="unit-label">${label} ${unit.number}</span>${escapeHtml(unit.title)}</h2>`;
  const body = unit.blocks.map(renderBlock).join("\n");
  return `<section class="unit">${heading}${body}</section>`;
}

function renderPart(part) {
  const hero = `<div class="part-hero"><div class="part-title">${escapeHtml(part.partTitle)}</div><div class="part-subtitle">${escapeHtml(part.partSubtitle || "")}</div></div>`;
  const units = part.units.map(u => renderUnit(u, part.unitLabel)).join("\n");
  return hero + units;
}

// Builds a mini on-page table of contents (unit list) for the sidebar of a single page
function buildUnitList(part) {
  const label = part.unitLabel || "Unit";
  return part.units.map(u => `<li><a href="#unit-${u.number}">${label} ${u.number} · ${escapeHtml(u.title)}</a></li>`).join("\n");
}

module.exports = { escapeHtml, parseInlineHtml, slugify, renderBlock, renderUnit, renderPart, buildUnitList };
