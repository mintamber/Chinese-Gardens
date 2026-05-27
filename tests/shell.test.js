import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createOfflineBundle } from "../scripts/build-offline.mjs";

test("HTML exposes each journey phase and accessible status regions", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  ["arrival", "learn", "challenge", "result", "audioDock", "announcement"].forEach((id) => {
    assert.match(html, new RegExp(`id="${id}"`));
  });
  assert.match(html, /aria-live="polite"/);
});

test("HTML opens from a local file without browser module imports", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.doesNotMatch(html, /type="module"/);
  assert.match(html, /<script defer src="\.\/js\/app\.bundle\.js"><\/script>/);

  const bundle = await readFile(new URL("../js/app.bundle.js", import.meta.url), "utf8");
  assert.doesNotMatch(bundle, /^\s*(?:import|export)\s/m);
  assert.match(bundle, /function renderArrival/);
  assert.equal(bundle, await createOfflineBundle());
});

test("CSS provides touch-safe controls, a patterned record and reduced motion", async () => {
  const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(css, /--pine:/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /\.record/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /\.moon-gate/);
  assert.match(css, /\.learning-hotspot/);
  assert.match(css, /\.knowledge-scroll/);
  assert.match(css, /\.knowledge-scroll\.is-open/);
  assert.match(css, /\.principle-list/);
  assert.match(css, /\.scroll-close/);
});

test("application renders learning, the five-choice challenge and result actions", async () => {
  const app = await readFile(new URL("../js/app.js", import.meta.url), "utf8");
  assert.match(app, /function renderLearn/);
  assert.match(app, /function renderChallenge/);
  assert.match(app, /function renderAudioDock/);
  assert.match(app, /function renderResult/);
  assert.match(app, /Walk Again/);
  assert.match(app, /Review the Four Principles/);
});

test("arrival trusts the painted moon gate instead of adding a second arch", async () => {
  const app = await readFile(new URL("../js/app.js", import.meta.url), "utf8");
  assert.doesNotMatch(app, /class="moon-gate"/);
});

test("changing a learning view stops narration before rendering the next principle", async () => {
  const app = await readFile(new URL("../js/app.js", import.meta.url), "utf8");
  assert.match(app, /function stopNarration\(\) \{[\s\S]*audio\.stopNarration\(\);[\s\S]*speechSynthesis\.cancel\(\);/);
  assert.match(app, /function openStop\(id\) \{\s+stopNarration\(\);/);
});

test("a restored challenge starts music again only after the record is pressed", async () => {
  const app = await readFile(new URL("../js/app.js", import.meta.url), "utf8");
  assert.match(app, /if \(!status\.musicStarted\) \{\s+await audio\.startMusic\(music\.bgm\);/);
});

test("learning scenes reveal a structured scroll from an accessible hotspot", async () => {
  const app = await readFile(new URL("../js/app.js", import.meta.url), "utf8");
  assert.match(app, /let scrollOpen = false/);
  assert.match(app, /function renderPrincipleItems/);
  assert.match(app, /class="learning-hotspot/);
  assert.match(app, /aria-controls="knowledgeScroll"/);
  assert.match(app, /class="knowledge-scroll/);
  assert.match(app, /function setScrollOpen/);
  assert.match(app, /scrollOpen = false;\s+state = visitStop/);
  assert.match(app, /beginChallenge[\s\S]*scrollOpen = false;[\s\S]*enterChallenge/);
  assert.doesNotMatch(app, /class="study-card"/);
});
