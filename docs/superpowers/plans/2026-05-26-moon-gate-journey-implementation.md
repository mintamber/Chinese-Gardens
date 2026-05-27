# Moon Gate Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, mobile-first six-minute English learning game in which students first encounter four principles of Chinese classical gardens and then apply them through five visual aesthetic decisions.

**Architecture:** This is a dependency-free static site with ES modules and Node built-in tests. Content, asset references, serializable journey state, and audio behavior remain separate from DOM rendering; `js/app.js` binds them into one album-leaf interface. Generated garden illustrations and bundled American-English narration are ordinary project assets, while optional `bgm.mp3` degrades gracefully when absent.

**Tech Stack:** HTML5, CSS custom properties and animations, vanilla JavaScript ES modules, `node --test`, local `python3 -m http.server`, built-in ChatGPT image generation, macOS `say`/`afconvert` for American-English narration, Codex in-app Browser for visual verification.

---

## File Map

| File | Responsibility |
| --- | --- |
| `index.html` | Semantic shell: arrival, learn carousel, challenge, result, audio controls and templates. |
| `styles.css` | Luxury Jiangnan album-leaf design system, responsive layouts, animated scenery layers, record player, accessibility and reduced motion. |
| `data/content.js` | Exact student-facing English/Chinese content, four learning stops, five challenge questions and result profiles. |
| `data/assets.js` | Stable logical asset keys mapped to generated garden images and audio URLs. |
| `js/state.js` | Serializable progression, learning gate, answers, scoring and result selection. |
| `js/audio.js` | Narration/BGM orchestration and optional missing-music state independent of UI decoration. |
| `js/app.js` | DOM rendering, transitions, observation gestures, accessibility bindings and session persistence. |
| `tests/content.test.js` | Content integrity and coverage checks. |
| `tests/state.test.js` | RED/GREEN behavior tests for gating, answering, scoring and reset. |
| `tests/audio.test.js` | Audio-controller behavior with lightweight fake audio objects. |
| `tests/shell.test.js` | Static shell contract checks for landmark controls and CSS accessibility rules. |
| `prompts/garden-scenes.md` | Shared image style bible and final scene-specific prompts. |
| `assets/images/*.png` | Generated garden illustrations for hero, learning, comparisons and result. |
| `assets/audio/narration/*.m4a` | Four bundled Samantha `en_US` spoken learning passages. |
| `assets/audio/bgm.mp3` | Optional user-provided game music file. |
| `README.md` | Classroom launch, optional BGM placement and interaction notes. |

### Task 1: Establish Static Project Shell and Content Contract

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `data/content.js`
- Create: `data/assets.js`
- Create: `tests/content.test.js`

- [ ] **Step 1: Write the failing content-integrity test**

Create `tests/content.test.js`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { learningStops, questions, resultProfiles } from "../data/content.js";
import { images, narration, music } from "../data/assets.js";

test("defines four learned garden principles with American-English narration", () => {
  assert.equal(learningStops.length, 4);
  assert.deepEqual(
    learningStops.map((stop) => stop.id),
    ["contrast", "poetic", "harmony", "naturalness"],
  );
  learningStops.forEach((stop) => {
    assert.match(stop.chinese, /[\u4e00-\u9fff]/);
    assert.ok(stop.script.split(" ").length >= 18);
    assert.equal(narration[stop.id].endsWith(".m4a"), true);
  });
});

test("uses five concise observation questions and four result profiles", () => {
  assert.equal(questions.length, 5);
  assert.equal(questions.at(-1).id, "empty-space");
  assert.deepEqual(Object.keys(resultProfiles), [
    "contrast",
    "poetic",
    "harmony",
    "naturalness",
  ]);
});

test("declares every required generated image and optional BGM", () => {
  const requiredKeys = [
    "hero", "contrast", "poetic", "harmony", "naturalness",
    "frameA", "frameB", "pathA", "pathB", "placementA",
    "placementB", "emptySpaceA", "emptySpaceB", "result",
  ];
  assert.deepEqual(Object.keys(images), requiredKeys);
  assert.equal(music.bgm, "./assets/audio/bgm.mp3");
});
```

- [ ] **Step 2: Run the content test and verify RED**

Run: `node --test tests/content.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `data/content.js` or `data/assets.js`.

- [ ] **Step 3: Add package metadata and minimal page shell**

Create `package.json`:

```json
{
  "name": "moon-gate-journey",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/*.test.js",
    "serve": "python3 -m http.server 8080"
  }
}
```

Create `index.html` with the required sections and template mounting points:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Moon Gate Journey: learn to see Chinese classical gardens through an interactive English-language experience.">
    <title>Moon Gate Journey | 月洞门游园</title>
    <link rel="stylesheet" href="./styles.css">
    <script type="module" src="./js/app.js"></script>
  </head>
  <body>
    <div class="paper-grain" aria-hidden="true"></div>
    <main id="app" class="journey" data-phase="arrival">
      <section id="arrival" class="screen screen--arrival" aria-labelledby="title"></section>
      <section id="learn" class="screen screen--learn" aria-label="Learning walk" hidden></section>
      <section id="challenge" class="screen screen--challenge" aria-label="Complete the garden challenge" hidden></section>
      <section id="result" class="screen screen--result" aria-live="polite" hidden></section>
    </main>
    <div id="audioDock" class="audio-dock" hidden></div>
    <div id="announcement" class="sr-only" aria-live="polite"></div>
  </body>
</html>
```

- [ ] **Step 4: Implement exact content and stable asset mappings**

Create `data/assets.js`:

```js
export const images = Object.freeze({
  hero: "./assets/images/hero-moon-gate.png",
  contrast: "./assets/images/learn-framed-vastness.png",
  poetic: "./assets/images/learn-poetic-reflection.png",
  harmony: "./assets/images/learn-changing-view.png",
  naturalness: "./assets/images/learn-naturalness.png",
  frameA: "./assets/images/play-frame-a.png",
  frameB: "./assets/images/play-frame-b.png",
  pathA: "./assets/images/play-path-a.png",
  pathB: "./assets/images/play-path-b.png",
  placementA: "./assets/images/play-placement-a.png",
  placementB: "./assets/images/play-placement-b.png",
  emptySpaceA: "./assets/images/play-empty-space-a.png",
  emptySpaceB: "./assets/images/play-empty-space-b.png",
  result: "./assets/images/result-complete-garden.png",
});

export const narration = Object.freeze({
  contrast: "./assets/audio/narration/contrast.m4a",
  poetic: "./assets/audio/narration/poetic.m4a",
  harmony: "./assets/audio/narration/harmony.m4a",
  naturalness: "./assets/audio/narration/naturalness.m4a",
});

export const music = Object.freeze({ bgm: "./assets/audio/bgm.mp3" });
```

Create `data/content.js` with these exported records:

```js
export const learningStops = [
  {
    id: "contrast",
    number: "01",
    title: "Framed Vastness",
    principle: "Contrast and Balance",
    chinese: "对比与平衡",
    instruction: "Tap the lattice window to open a distant view.",
    insight: "A limited opening makes the world beyond it feel larger.",
    script: "Notice the small window and the wide scene beyond it. In a Chinese classical garden, restraint can make space feel vast. This is contrast and balance.",
  },
  {
    id: "poetic",
    number: "02",
    title: "A Walkable Painting",
    principle: "Poetic and Artistic Refinement",
    chinese: "诗画的雅趣",
    instruction: "Brush the water to reveal a reflection and a poetic name.",
    insight: "A garden invites us to walk inside a painting and a poem.",
    script: "Reflection, a poetic name, and quiet architecture turn the garden into a three-dimensional landscape painting. This is poetic and artistic refinement.",
  },
  {
    id: "harmony",
    number: "03",
    title: "Changing Views",
    principle: "Diversity and Harmony",
    chinese: "多样性与和谐性",
    instruction: "Follow the winding path as bamboo gives way to light.",
    insight: "Every step can open another view, without losing harmony.",
    script: "A winding path hides and reveals. Light, shadow, layers, and empty space create variety while the whole garden remains harmonious.",
  },
  {
    id: "naturalness",
    number: "04",
    title: "Made to Feel Natural",
    principle: "Naturalness and Simplicity",
    chinese: "自然与质朴",
    instruction: "Lift the mist to see architecture settle into nature.",
    insight: "Craft is most graceful when it seems to follow nature.",
    script: "Here, buildings do not dominate mountain and water. Human design settles quietly into the landscape. This is naturalness and simplicity.",
  },
];

export const questions = [
  {
    id: "frame", lens: "contrast", prompt: "Choose the most expansive view.",
    options: [
      { id: "frameA", label: "A quiet framed opening", correct: true },
      { id: "frameB", label: "Everything exposed at once", correct: false },
    ],
    rationale: "A restrained frame lets a modest garden feel surprisingly vast.",
  },
  {
    id: "naming", lens: "poetic", prompt: "Name the pavilion that completes the mood.",
    options: [
      { id: "bright-echoes", label: "Hall of Bright Echoes", correct: true },
      { id: "meeting-room", label: "Meeting Room", correct: false },
      { id: "waterfront-building", label: "Large Waterfront Building", correct: false },
    ],
    rationale: "A poetic name lets architecture continue the feeling of water and light.",
  },
  {
    id: "path", lens: "harmony", prompt: "Guide the visitor's path.",
    options: [
      { id: "pathA", label: "Winding reveal", correct: true },
      { id: "pathB", label: "Direct exposure", correct: false },
    ],
    rationale: "Concealment and reveal make changing views feel harmonious.",
  },
  {
    id: "placement", lens: "naturalness", prompt: "Place one final element.",
    options: [
      { id: "placementA", label: "A pavilion nestled beside the shore", correct: true },
      { id: "placementB", label: "A monumental building above the pond", correct: false },
    ],
    rationale: "The most graceful structure seems to follow terrain and water.",
  },
  {
    id: "empty-space", lens: "harmony", prompt: "Which view leaves room for imagination?",
    options: [
      { id: "emptySpaceA", label: "Layers, concealment and open water", correct: true },
      { id: "emptySpaceB", label: "Every space filled and explained", correct: false },
    ],
    rationale: "What remains hidden or empty allows the mind to complete the scene.",
  },
];

export const resultProfiles = {
  contrast: { title: "The Framing Observer", chinese: "借景知音", feedback: "You notice how a small frame can hold a wide emotional world." },
  poetic: { title: "The Poetic Wanderer", chinese: "诗境游人", feedback: "You listen for the poem within reflections, names and quiet structures." },
  harmony: { title: "The Changing-View Seeker", chinese: "移步寻景者", feedback: "You value layers, pauses and views that unfold gradually." },
  naturalness: { title: "The Quiet Harmonist", chinese: "天人和游者", feedback: "You sense when human craft belongs peacefully within nature." },
};
```

- [ ] **Step 5: Run tests, then commit the content contract**

Run: `node --test tests/content.test.js`
Expected: 3 tests PASS.

```bash
git add package.json index.html data tests/content.test.js
git commit -m "feat: establish journey content contract"
```

### Task 2: Build Serializable Learning and Assessment State

**Files:**
- Create: `js/state.js`
- Create: `tests/state.test.js`

- [ ] **Step 1: Write failing progression and scoring tests**

Create `tests/state.test.js`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createJourneyState, visitStop, enterChallenge, answerQuestion, getResult, resetJourney } from "../js/state.js";

test("locks the challenge until all four learning stops are visited", () => {
  let state = createJourneyState();
  ["contrast", "poetic", "harmony"].forEach((id) => { state = visitStop(state, id); });
  assert.throws(() => enterChallenge(state), /complete the learning walk/i);
  state = visitStop(state, "naturalness");
  assert.equal(enterChallenge(state).phase, "challenge");
});

test("answers five questions once and rewards the assessed lens", () => {
  let state = enterChallenge({
    ...createJourneyState(),
    visitedStops: ["contrast", "poetic", "harmony", "naturalness"],
  });
  state = answerQuestion(state, { questionId: "frame", lens: "contrast", correct: true });
  assert.equal(state.answers.frame.correct, true);
  assert.equal(state.scores.contrast, 1);
  assert.throws(
    () => answerQuestion(state, { questionId: "frame", lens: "contrast", correct: false }),
    /already answered/i,
  );
});

test("selects strongest profile after all five questions and supports reset", () => {
  let state = enterChallenge({
    ...createJourneyState(),
    visitedStops: ["contrast", "poetic", "harmony", "naturalness"],
  });
  [
    ["frame", "contrast", true],
    ["naming", "poetic", false],
    ["path", "harmony", true],
    ["placement", "naturalness", false],
    ["empty-space", "harmony", true],
  ].forEach(([questionId, lens, correct]) => {
    state = answerQuestion(state, { questionId, lens, correct });
  });
  assert.equal(state.phase, "result");
  assert.equal(getResult(state).lens, "harmony");
  assert.deepEqual(resetJourney(), createJourneyState());
});
```

- [ ] **Step 2: Run state test and verify RED**

Run: `node --test tests/state.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `js/state.js`.

- [ ] **Step 3: Implement immutable serializable state functions**

Create `js/state.js`:

```js
const requiredStops = ["contrast", "poetic", "harmony", "naturalness"];
const scoreKeys = ["contrast", "poetic", "harmony", "naturalness"];

export function createJourneyState() {
  return {
    phase: "arrival",
    activeStop: 0,
    visitedStops: [],
    questionIndex: 0,
    answers: {},
    scores: { contrast: 0, poetic: 0, harmony: 0, naturalness: 0 },
  };
}

export function visitStop(state, id) {
  if (!requiredStops.includes(id)) throw new Error("Unknown learning stop.");
  const visitedStops = state.visitedStops.includes(id)
    ? state.visitedStops
    : [...state.visitedStops, id];
  return { ...state, phase: "learn", activeStop: requiredStops.indexOf(id), visitedStops };
}

export function canEnterChallenge(state) {
  return requiredStops.every((id) => state.visitedStops.includes(id));
}

export function enterChallenge(state) {
  if (!canEnterChallenge(state)) throw new Error("Complete the learning walk before beginning the challenge.");
  return { ...state, phase: "challenge", questionIndex: 0 };
}

export function answerQuestion(state, { questionId, lens, correct }) {
  if (state.phase !== "challenge") throw new Error("The challenge is not active.");
  if (state.answers[questionId]) throw new Error("This question is already answered.");
  if (!scoreKeys.includes(lens)) throw new Error("Unknown aesthetic lens.");
  const answers = { ...state.answers, [questionId]: { lens, correct } };
  const scores = { ...state.scores, [lens]: state.scores[lens] + (correct ? 1 : 0) };
  const questionIndex = state.questionIndex + 1;
  return {
    ...state,
    answers,
    scores,
    questionIndex,
    phase: questionIndex === 5 ? "result" : "challenge",
  };
}

export function getResult(state) {
  if (state.phase !== "result") throw new Error("A result is not yet available.");
  const lens = scoreKeys.reduce(
    (strongest, key) => state.scores[key] > state.scores[strongest] ? key : strongest,
    scoreKeys[0],
  );
  return { lens, score: state.scores[lens] };
}

export function resetJourney() {
  return createJourneyState();
}
```

- [ ] **Step 4: Run state tests and all current tests**

Run: `node --test tests/content.test.js tests/state.test.js`
Expected: 6 tests PASS.

- [ ] **Step 5: Commit progression behavior**

```bash
git add js/state.js tests/state.test.js
git commit -m "feat: model learning gate and aesthetic scoring"
```

### Task 3: Implement Narration and Optional Game Music

**Files:**
- Create: `js/audio.js`
- Create: `tests/audio.test.js`
- Create: `assets/audio/narration/contrast.m4a`
- Create: `assets/audio/narration/poetic.m4a`
- Create: `assets/audio/narration/harmony.m4a`
- Create: `assets/audio/narration/naturalness.m4a`

- [ ] **Step 1: Write failing controller tests with fake media objects**

Create `tests/audio.test.js`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createAudioController } from "../js/audio.js";

function fakeAudio(src) {
  return {
    src, paused: true, loop: false, plays: 0, pauses: 0,
    async play() { this.paused = false; this.plays += 1; },
    pause() { this.paused = true; this.pauses += 1; },
  };
}

test("playing narration pauses the previous narration", async () => {
  const made = [];
  const controller = createAudioController((src) => {
    const audio = fakeAudio(src);
    made.push(audio);
    return audio;
  });
  await controller.playNarration("one.m4a");
  await controller.playNarration("two.m4a");
  assert.equal(made[0].pauses, 1);
  assert.equal(made[1].plays, 1);
});

test("starts looping BGM only on challenge action and toggles playback", async () => {
  const controller = createAudioController(fakeAudio);
  assert.equal(controller.status().musicStarted, false);
  await controller.startMusic("bgm.mp3");
  assert.equal(controller.status().musicStarted, true);
  assert.equal(controller.status().musicPlaying, true);
  controller.toggleMusic();
  assert.equal(controller.status().musicPlaying, false);
});

test("reports missing music without preventing play", async () => {
  const broken = () => ({ ...fakeAudio("missing"), play: async () => { throw new Error("missing"); } });
  const controller = createAudioController(broken);
  await controller.startMusic("bgm.mp3");
  assert.equal(controller.status().musicUnavailable, true);
});
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/audio.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `js/audio.js`.

- [ ] **Step 3: Implement audio controller**

Create `js/audio.js`:

```js
export function createAudioController(makeAudio = (src) => new Audio(src)) {
  let voice = null;
  let bgm = null;
  let musicStarted = false;
  let musicUnavailable = false;

  async function playNarration(src) {
    voice?.pause();
    voice = makeAudio(src);
    try {
      await voice.play();
      return true;
    } catch {
      return false;
    }
  }

  async function startMusic(src) {
    if (!bgm) {
      bgm = makeAudio(src);
      bgm.loop = true;
    }
    musicStarted = true;
    try {
      await bgm.play();
    } catch {
      musicUnavailable = true;
    }
  }

  function toggleMusic() {
    if (!bgm || musicUnavailable) return;
    if (bgm.paused) void bgm.play();
    else bgm.pause();
  }

  function stopAll() {
    voice?.pause();
    bgm?.pause();
  }

  function status() {
    return {
      musicStarted,
      musicPlaying: Boolean(bgm && !bgm.paused && !musicUnavailable),
      musicUnavailable,
    };
  }

  return { playNarration, startMusic, toggleMusic, stopAll, status };
}
```

- [ ] **Step 4: Generate consistent American-English narration files**

Run these commands after creating `assets/audio/narration/`:

```bash
say -v Samantha -r 165 -o /tmp/contrast.aiff "Notice the small window and the wide scene beyond it. In a Chinese classical garden, restraint can make space feel vast. This is contrast and balance."
afconvert -f m4af -d aac /tmp/contrast.aiff assets/audio/narration/contrast.m4a
say -v Samantha -r 165 -o /tmp/poetic.aiff "Reflection, a poetic name, and quiet architecture turn the garden into a three-dimensional landscape painting. This is poetic and artistic refinement."
afconvert -f m4af -d aac /tmp/poetic.aiff assets/audio/narration/poetic.m4a
say -v Samantha -r 165 -o /tmp/harmony.aiff "A winding path hides and reveals. Light, shadow, layers, and empty space create variety while the whole garden remains harmonious."
afconvert -f m4af -d aac /tmp/harmony.aiff assets/audio/narration/harmony.m4a
say -v Samantha -r 165 -o /tmp/naturalness.aiff "Here, buildings do not dominate mountain and water. Human design settles quietly into the landscape. This is naturalness and simplicity."
afconvert -f m4af -d aac /tmp/naturalness.aiff assets/audio/narration/naturalness.m4a
```

Expected: four non-empty `.m4a` files; `file assets/audio/narration/*.m4a` reports MPEG-4 audio media.

- [ ] **Step 5: Verify tests and commit**

Run: `node --test tests/*.test.js`
Expected: all tests PASS.

```bash
git add js/audio.js tests/audio.test.js assets/audio/narration
git commit -m "feat: add guided American English narration and audio control"
```

### Task 4: Build the Album-Leaf UI and Learning Walk

**Files:**
- Create: `styles.css`
- Create: `js/app.js`
- Create: `tests/shell.test.js`
- Modify: `index.html`

- [ ] **Step 1: Write failing static UI contract test**

Create `tests/shell.test.js`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("HTML exposes all four phases and accessible status regions", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  ["arrival", "learn", "challenge", "result", "audioDock", "announcement"].forEach((id) => {
    assert.match(html, new RegExp(`id=\"${id}\"`));
  });
  assert.match(html, /aria-live=\"polite\"/);
});

test("CSS provides phone-first controls and reduced-motion behavior", async () => {
  const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /\.record/);
  assert.match(css, /--pine/);
});
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/shell.test.js`
Expected: first test PASS from the shell; second test FAIL because `styles.css` does not yet exist.

- [ ] **Step 3: Implement theme CSS**

Create `styles.css` with this base design system and motion/accessibility contract:

```css
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;500;700&display=swap");
:root {
  --paper: #f4eddb;
  --ink: #172925;
  --pine: #153d38;
  --celadon: #477e78;
  --mineral: #416f88;
  --cinnabar: #b6635c;
  --gold: #ba9155;
  --veil: rgba(247, 241, 224, .78);
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100svh; color: var(--ink); background: var(--paper); font-family: "Cormorant Garamond", "Noto Serif SC", serif; }
button { min-height: 44px; font: inherit; cursor: pointer; }
.screen { min-height: 100svh; position: relative; overflow: hidden; }
.scene-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform: scale(1.035); transition: transform 1.5s ease; }
.journey[data-phase="learn"] .scene-image { transform: scale(1); }
.record { width: 74px; aspect-ratio: 1; border-radius: 50%; animation: spin 9s linear infinite; background: repeating-radial-gradient(circle, #1c4642 0 4px, #32685f 5px 7px); }
.record.is-paused { animation-play-state: paused; }
@keyframes spin { to { transform: rotate(360deg); } }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
@media (min-width: 850px) {
  .screen { width: min(1280px, calc(100vw - 64px)); margin: 0 auto; }
}
```

In the same file add selectors for `.moon-gate-frame`, `.arrival-copy`, `.seal-button`, `.stop-nav`, `.study-card`, `.unlock`, `.challenge-header`, `.question`, `.choices`, `.choice`, `.feedback`, `.audio-dock`, and `.result-card`. Set text panels to the upper/lower edges of each scene; at `min-width: 850px`, put `.study-card` and `.result-card` on the right at no more than `min(420px, 36vw)` so the garden focal point remains open. These named selectors are the DOM contract used in Steps 4 and Task 5.

- [ ] **Step 4: Render arrival and locked learning flow in `js/app.js`**

Implement with imports and a single state/render loop:

```js
import { learningStops, questions, resultProfiles } from "../data/content.js";
import { images, narration, music } from "../data/assets.js";
import { createJourneyState, visitStop, canEnterChallenge, enterChallenge, answerQuestion, getResult, resetJourney } from "./state.js";
import { createAudioController } from "./audio.js";

const nodes = Object.fromEntries(["app", "arrival", "learn", "challenge", "result", "audioDock", "announcement"]
  .map((id) => [id, document.getElementById(id)]));
const audio = createAudioController();
let state = restoreState();

function saveState() {
  sessionStorage.setItem("moonGateJourney", JSON.stringify(state));
}
function restoreState() {
  try { return JSON.parse(sessionStorage.getItem("moonGateJourney")) || createJourneyState(); }
  catch { return createJourneyState(); }
}
function showPhase(name) {
  nodes.app.dataset.phase = name;
  ["arrival", "learn", "challenge", "result"].forEach((key) => { nodes[key].hidden = key !== name; });
}
function renderArrival() {
  nodes.arrival.innerHTML = `<img class="scene-image" src="${images.hero}" alt="">
    <div class="moon-gate-frame" aria-hidden="true"></div>
    <div class="arrival-copy"><p class="eyebrow">An English Cultural Appreciation Journey</p>
    <h1>Moon Gate Journey <small>月洞门游园</small></h1>
    <p>Learn to see a Chinese classical garden.</p>
    <button id="enterGarden" class="seal-button">Enter the Garden</button>
    <span class="duration">A six-minute visual journey</span></div>`;
  document.getElementById("enterGarden").addEventListener("click", () => {
    state = visitStop(state, learningStops[0].id); saveState(); render();
  });
}
function renderLearn() {
  const stop = learningStops[state.activeStop];
  nodes.learn.innerHTML = `<img class="scene-image scene-image--${stop.id}" src="${images[stop.id]}" alt="">
    <nav class="stop-nav" aria-label="Four garden principles">${learningStops.map((item, index) =>
      `<button data-stop="${item.id}" class="${state.visitedStops.includes(item.id) ? "visited" : ""}"><b>${item.number}</b>${item.principle}</button>`).join("")}</nav>
    <article class="study-card"><p class="eyebrow">${stop.number} / Four Principles</p>
    <h2>${stop.title}</h2><p class="chinese">${stop.chinese}</p><p class="insight">${stop.insight}</p>
    <p class="script">${stop.script}</p><button id="listen">Listen · American English</button>
    <button id="nextStop">${state.activeStop === 3 ? "Complete Learning" : "Next View"}</button></article>
    <aside class="unlock ${canEnterChallenge(state) ? "ready" : ""}">
      <button id="beginChallenge" ${canEnterChallenge(state) ? "" : "disabled"}>Begin the Challenge</button></aside>`;
  nodes.learn.querySelectorAll("[data-stop]").forEach((button) => button.addEventListener("click", () => {
    state = visitStop(state, button.dataset.stop); saveState(); renderLearn();
  }));
  document.getElementById("listen").addEventListener("click", () => void audio.playNarration(narration[stop.id]));
  document.getElementById("nextStop").addEventListener("click", () => {
    const next = learningStops[Math.min(state.activeStop + 1, 3)];
    state = visitStop(state, next.id); saveState(); renderLearn();
  });
  document.getElementById("beginChallenge").addEventListener("click", async () => {
    state = enterChallenge(state); saveState(); await audio.startMusic(music.bgm); render();
  });
}
function render() {
  showPhase(state.phase);
  if (state.phase === "arrival") renderArrival();
  if (state.phase === "learn") renderLearn();
}
render();
```

- [ ] **Step 5: Run shell and unit tests; commit learning UI**

Run: `node --test tests/*.test.js`
Expected: all tests PASS.

```bash
git add index.html styles.css js/app.js tests/shell.test.js
git commit -m "feat: build moon gate arrival and guided learning walk"
```

### Task 5: Implement Five-Choice Game, Record Player and Result Card

**Files:**
- Modify: `js/app.js`
- Modify: `styles.css`
- Modify: `tests/shell.test.js`

- [ ] **Step 1: Add failing interaction-surface assertion**

Append to `tests/shell.test.js`:

```js
test("application renders the five-choice challenge, music record and result actions", async () => {
  const app = await readFile(new URL("../js/app.js", import.meta.url), "utf8");
  assert.match(app, /function renderChallenge/);
  assert.match(app, /function renderAudioDock/);
  assert.match(app, /function renderResult/);
  assert.match(app, /Walk Again/);
  assert.match(app, /Review the Four Principles/);
});
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/shell.test.js`
Expected: FAIL because `js/app.js` does not yet implement `renderChallenge`.

- [ ] **Step 3: Add challenge, BGM dock and result rendering**

Extend `js/app.js` with:

```js
function currentQuestion() { return questions[state.questionIndex]; }
function renderAudioDock() {
  const status = audio.status();
  nodes.audioDock.hidden = state.phase !== "challenge";
  nodes.audioDock.innerHTML = `<button id="musicToggle" class="record ${status.musicPlaying ? "" : "is-paused"}"
    aria-label="${status.musicPlaying ? "Pause garden music" : "Play garden music"}"><span>乐</span></button>
    <p>${status.musicUnavailable ? "Music file not installed" : "Garden Music"}</p>`;
  document.getElementById("musicToggle")?.addEventListener("click", () => { audio.toggleMusic(); renderAudioDock(); });
}
function questionImage(optionId) {
  return images[optionId] || images.poetic;
}
function renderChallenge(feedback = "") {
  const question = currentQuestion();
  nodes.challenge.innerHTML = `<header class="challenge-header"><p>Complete the Garden</p>
    <span>${state.questionIndex + 1} / ${questions.length}</span></header>
    <section class="question"><h2>${question.prompt}</h2>
    <div class="choices">${question.options.map((option) => `<button class="choice" data-option="${option.id}">
      ${question.id === "naming" ? "" : `<img src="${questionImage(option.id)}" alt="">`}
      <span>${option.label}</span></button>`).join("")}</div>
    <p class="feedback" aria-live="polite">${feedback}</p></section>`;
  nodes.challenge.querySelectorAll("[data-option]").forEach((button) => button.addEventListener("click", () => {
    const option = question.options.find((candidate) => candidate.id === button.dataset.option);
    state = answerQuestion(state, { questionId: question.id, lens: question.lens, correct: option.correct });
    saveState();
    nodes.announcement.textContent = option.correct ? `Well observed. ${question.rationale}` : `Look again in memory. ${question.rationale}`;
    if (state.phase === "result") render();
    else renderChallenge(`${option.correct ? "Well observed." : "A gentler eye notices more."} ${question.rationale}`);
  }));
  renderAudioDock();
}
function renderResult() {
  audio.stopAll();
  nodes.audioDock.hidden = true;
  const { lens } = getResult(state);
  const profile = resultProfiles[lens];
  nodes.result.innerHTML = `<img class="scene-image" src="${images.result}" alt="">
    <article class="result-card"><p class="eyebrow">Your Garden Eye</p><h2>${profile.title}</h2>
    <p class="chinese">${profile.chinese}</p><p>${profile.feedback}</p>
    <button id="replay">Walk Again</button><button id="review">Review the Four Principles</button></article>`;
  document.getElementById("replay").addEventListener("click", () => {
    state = resetJourney(); sessionStorage.removeItem("moonGateJourney"); render();
  });
  document.getElementById("review").addEventListener("click", () => {
    state = visitStop(resetJourney(), "contrast"); saveState(); render();
  });
}
```

Update `render()`:

```js
if (state.phase === "challenge") renderChallenge();
if (state.phase === "result") renderResult();
```

Append these concrete visual rules to `styles.css`, refining color, spacing and breakpoints without changing the named contract:

```css
.choices { display: grid; gap: 12px; margin-top: 20px; }
.choice { min-height: 54px; padding: 0; overflow: hidden; border: 1px solid rgba(21,61,56,.18); background: var(--veil); color: var(--ink); text-align: left; }
.choice img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
.choice span { display: block; padding: 12px 14px; }
.feedback { min-height: 52px; color: var(--pine); }
.audio-dock { position: fixed; right: 14px; bottom: 14px; z-index: 20; display: grid; justify-items: center; gap: 4px; }
.audio-dock p { margin: 0; font-size: 12px; color: var(--pine); background: var(--veil); padding: 3px 7px; }
.result-card { position: absolute; inset: auto 16px 24px; padding: 25px; background: var(--veil); border: 1px solid rgba(21,61,56,.16); }
@media (min-width: 850px) {
  .choices { grid-template-columns: repeat(2, minmax(190px, 1fr)); }
  .result-card { inset: 12vh 7vw auto auto; width: min(420px, 36vw); }
}
```

The record control sits at the bottom-right edge and choice cards occupy the lower content surface, so it does not cover primary option text or central visual comparison.

- [ ] **Step 4: Run automated tests and exercise the UI before artwork is installed**

Run: `node --test tests/*.test.js`
Expected: all tests PASS.

Run: `python3 -m http.server 8080`
Expected: page loads at `http://localhost:8080`; with images and BGM not yet installed it remains navigable, learning gate works, music dock reports missing BGM without blocking questions, and five answers reach the result screen.

- [ ] **Step 5: Commit gameplay**

```bash
git add js/app.js styles.css tests/shell.test.js
git commit -m "feat: add complete-the-garden assessment and results"
```

### Task 6: Generate and Integrate the Unified Garden Artwork

**Files:**
- Create: `prompts/garden-scenes.md`
- Create: `assets/images/hero-moon-gate.png`
- Create: `assets/images/learn-framed-vastness.png`
- Create: `assets/images/learn-poetic-reflection.png`
- Create: `assets/images/learn-changing-view.png`
- Create: `assets/images/learn-naturalness.png`
- Create: `assets/images/play-frame-a.png`
- Create: `assets/images/play-frame-b.png`
- Create: `assets/images/play-path-a.png`
- Create: `assets/images/play-path-b.png`
- Create: `assets/images/play-placement-a.png`
- Create: `assets/images/play-placement-b.png`
- Create: `assets/images/play-empty-space-a.png`
- Create: `assets/images/play-empty-space-b.png`
- Create: `assets/images/result-complete-garden.png`

- [ ] **Step 1: Write the production prompt set**

Create `prompts/garden-scenes.md` with a fixed base prompt followed by fourteen scene variants. The base prompt must specify:

```text
Use case: historical-scene
Asset type: mobile-first interactive learning-game environment artwork
Primary request: Depict one imagined classical Jiangnan scholar garden in a coherent series of views.
Style: refined painterly digital illustration blending gongbi-controlled architectural outlines with translucent ink wash and gentle mineral color on tactile rice paper.
Continuity: white plaster walls, charcoal tiled eaves, Taihu rockery, lotus pond, bamboo, dark pine pavilion joinery; pine green, celadon teal, mineral blue shadow, ivory paper, cinnabar blossom and aged-gold light in every view.
Composition: keep meaningful clear space for overlaid English UI; vertical-friendly 4:5 framing for hero/learning/result and comparable framing for question pairs.
Avoid: people as subject, modern objects, text or signage, Western furniture, photographic rendering, garish saturation, tourist-poster gloss.
```

Add one scene prompt for each asset key from `data/assets.js`, explicitly identifying the observation principle and which side of paired game images is aesthetically stronger.

- [ ] **Step 2: Generate one hero and four learning scenes using the built-in image generation tool**

Use separate built-in image-generation calls for `hero`, `contrast`, `poetic`, `harmony`, and `naturalness` with the shared style bible and individual compositions. Move selected outputs into `assets/images/` under the declared filenames.

Expected: five images show the same imagined garden identity and leave UI-safe text areas.

- [ ] **Step 3: Generate matched assessment comparisons and the result landscape**

Use separate built-in image-generation calls for the eight comparison images and the result scene. For each pair, retain matched lighting, viewpoint and garden vocabulary so student decisions judge composition rather than unrelated image quality.

Expected: nine additional images exist in `assets/images/`; the correct option is legible through garden design principle without added words.

- [ ] **Step 4: Visually inspect artwork integration at phone and projector widths**

Run: `python3 -m http.server 8080`
Open in Browser at portrait and desktop sizes. Check: focal subjects remain visible beneath UI, pair comparisons are fair, all images share style and palette, and no generated artifacts or accidental signage distract from learning.

- [ ] **Step 5: Commit the visual world**

```bash
git add prompts/garden-scenes.md assets/images
git commit -m "feat: illustrate the Moon Gate garden journey"
```

### Task 7: Add Classroom Instructions, Optional BGM Path and Final Verification

**Files:**
- Create: `README.md`
- Optional user asset: `assets/audio/bgm.mp3`
- Modify only if QA exposes a recorded layout or interaction defect: `styles.css`, `js/app.js`, and its corresponding regression test.

- [ ] **Step 1: Document classroom launch and optional music setup**

Create `README.md`:

````md
# Moon Gate Journey / 月洞门游园

A six-minute, mobile-first English-language learning game for appreciating principles of Chinese classical gardens.

## Run Locally

```bash
python3 -m http.server 8080
```

Share `http://<teacher-computer-address>:8080` with students on the same accessible network, or deploy this static folder to a web host for a stable classroom URL.

## Classroom Flow

Students must visit four English learning views before the five-choice `Complete the Garden` challenge unlocks. Scores stay on each device; no account, live leaderboard or upload is used.

## Music

Place the supplied classroom track at `assets/audio/bgm.mp3`. It begins only after a student taps `Begin the Challenge` and is controlled by the rotating garden-pattern record. Without this file, every learning and game function still works.

## Narration

Four bundled American-English audio passages live at `assets/audio/narration/` and are accompanied by visible transcripts.
````

- [ ] **Step 2: Run automated verification**

Run: `node --test tests/*.test.js`
Expected: all tests PASS with no warnings or uncaught errors.

- [ ] **Step 3: Run browser playtests**

Run: `python3 -m http.server 8080`

Using the in-app Browser, verify at a phone portrait viewport and at a desktop/projector viewport:

1. Arrival is visually clear and `Enter the Garden` opens learning.
2. Challenge remains disabled before four stops are visited.
3. Each narration button plays the matching American-English asset.
4. `Begin the Challenge` exposes the record; with no `bgm.mp3`, missing music is discreet and non-blocking, or with the supplied file it rotates/plays/pauses.
5. All five choices produce English feedback and reach a personalized result.
6. `Walk Again` resets state and `Review the Four Principles` returns to learning.
7. Reduced-motion mode removes nonessential image drift and record rotation.

Expected: no console errors, no obstructed touch targets, and no clipped English copy at phone size.

- [ ] **Step 4: Capture final screenshots and commit delivery notes**

Capture representative arrival, learning, challenge and result screenshots at phone size plus one projector layout screenshot for the delivery report.

```bash
git add README.md styles.css js/app.js
git commit -m "docs: add classroom launch and verify garden journey"
```
