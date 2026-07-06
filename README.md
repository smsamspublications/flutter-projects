# Dart & Flutter — A Complete Language & Framework Manual

A comprehensive Dart and Flutter reference manual, written as structured textbook chapters plus a full JNTUK R23 lab manual — browsable as a website.

🌐 **Live site:** `https://smsamspublications.github.io/flutter-projects/` (see setup steps below)


---

## What's Inside

- **Part I — The Dart Language** (17 units)
  Variables, control flow, functions, collections, OOP, generics, exception handling, async/await & Streams, null safety, packages, extension methods, records & pattern matching, isolates.

- **Part II — The Flutter Framework** (35 units)
  Widgets, layouts, navigation, state management (`setState` → `Provider` → `Riverpod` → `Bloc`), networking, local persistence, animations, theming, accessibility, internationalization, Firebase, platform channels, performance optimization, and deployment.

- **Part III — Capstone Project** (9 steps)
  A complete walkthrough building a working "Faculty Activity Tracker" app end-to-end — model, repository, state layer, UI, and tests.

- **Part IV — JNTUK R23 Lab Manual** (10 experiments)
  All 10 prescribed Flutter Application Development lab experiments, each with aim, fully line-commented programs, expected output, result, and 5 viva-voce questions.

- **Part V — Quick-Reference Appendices** (9 appendices)
  Dart syntax cheat sheet, Flutter widget catalog, troubleshooting guide, package directory, CLI/DevTools reference, glossary, practice/viva questions, and project ideas.

## Site Structure

```
index.html              → landing page with links to every part
part1-dart.html         → Part I
part2-flutter.html      → Part II
part3-capstone.html     → Part III
part4-labmanual.html    → Part IV
part5-appendices.html   → Part V
assets/style.css        → site styling
assets/script.js        → mobile nav + code highlighting
Dart_Flutter_Complete_Manual.docx  → the Word version
source/                 → the content + build script (see below)
```

## Rebuilding the Site (if you edit the content)

The actual manual text lives as structured data in `source/content-*.js`, not hand-written HTML. To change anything, edit the relevant `source/content-*.js` file, then regenerate every HTML page with:

```bash
cd source
node build-html.js
```

This rewrites `index.html` and all five part pages in the repo root using the same content and numbering as the Word document, so both versions always stay in sync.

## License

© Department of Artificial Intelligence & Data Science, Lakireddy Bali Reddy College of Engineering (Autonomous), Mylavaram. Free to use for academic and instructional purposes.
