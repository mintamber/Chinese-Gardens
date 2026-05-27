# Classical Garden Learning Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the four learning scenes with the complete bilingual garden-philosophy content and reveal it only through thematic scene hotspots that open a responsive reading scroll.

**Architecture:** Extend each `learningStops` record with structured bilingual principles, observation copy, and hotspot metadata. Keep the existing single-page renderer and add one transient `scrollOpen` UI state: `renderLearn()` renders a hotspot and off-canvas scroll for the active scene, while view changes reset the open state. CSS changes replace the permanent study-card layout with a side scroll on wide screens and a bottom drawer on small screens; the existing offline bundle build remains the delivery path for `file://` use.

**Tech Stack:** Static HTML/CSS, vanilla ES modules bundled by the repository's offline build script, Node built-in test runner, Codex in-app browser verification.

**Working Directory:** `/Users/indigo/Downloads/xanna/GardenJourney/.worktrees/moon-gate-site`

---

## File Map

- Modify `data/content.js`: keep the four existing stops and add complete structured bilingual learning material plus hotspot and observation metadata.
- Modify `js/app.js`: render the hotspot and scroll, manage open/closed state, retain narration and progression behavior.
- Modify `styles.css`: style unobstructed scenes, hotspot markers, desktop side scroll, and mobile bottom drawer.
- Modify `tests/content.test.js`: verify every source-slide term and the new stop metadata contract.
- Modify `tests/shell.test.js`: verify renderer hooks and CSS support for the reveal interaction.
- Rebuild `js/app.bundle.js`: generated offline artifact consumed from `index.html`.
- Preserve and separately checkpoint the existing pending changes in `index.html`, `js/audio.js`, `package.json`, `scripts/build-offline.mjs`, `tests/audio.test.js`, and existing portions of `js/app.js`/`tests/shell.test.js`, which fix local-file launching and audio transitions.

No image asset changes are planned initially. Inspection found appropriate visible cues already present: a framed window, pavilion plaque area, winding layered path, and waterside rockwork. Image generation becomes a separate follow-up only if browser review shows a scene cannot communicate its hotspot.

### Task 0: Checkpoint Existing Local-Launch and Audio Fixes

**Files:**
- Existing modified files to commit unchanged: `index.html`, `js/app.js`, `js/audio.js`, `package.json`, `tests/audio.test.js`, `tests/shell.test.js`
- Existing generated/new files to commit unchanged: `js/app.bundle.js`, `scripts/build-offline.mjs`

- [ ] **Step 1: Verify the pending repair set before staging**

Run:

```bash
git status --short
git diff -- index.html js/app.js js/audio.js package.json tests/audio.test.js tests/shell.test.js
git diff --check
node scripts/build-offline.mjs --check && node --test tests/*.test.js
```

Expected: the diff is limited to the already-reviewed local `file://` bundle, duplicate-arch removal, narration stop, restored-music behavior, and their tests; `git diff --check` is silent; all current tests pass.

- [ ] **Step 2: Commit only that existing repair set**

```bash
git add index.html js/app.js js/audio.js package.json tests/audio.test.js tests/shell.test.js js/app.bundle.js scripts/build-offline.mjs
git commit -m "fix: support offline garden journey playback"
```

Expected: one repair commit is created, leaving the implementation work below on a clean base while preserving the separately committed design and plan documents.

### Task 1: Define the Complete Bilingual Content Contract

**Files:**
- Modify: `tests/content.test.js`
- Modify: `data/content.js`

- [ ] **Step 1: Write a failing content-completeness test**

Append this test to `tests/content.test.js`:

```js
test("includes the complete bilingual classical garden learning reference", () => {
  const expected = {
    contrast: [
      ["Various scales of openings", "大小开合"],
      ["Vastness within a small area", "小中见大"],
      ["Enhance the grand with the small", "以小衬大"],
      ["Less is more", "以少胜多"],
    ],
    poetic: [
      ["3D landscape painting", "三维山水画"],
      ["A reflection of the literati's personality and worldview", "造园人的文人情结"],
      ["Residences and social hangouts", "文人雅士的雅集文酒之处"],
      ["Poetic names of architecture", "亭台楼阁的诗意命名"],
      ["Inscriptions of poetry or calligraphic art on the plaques and gate couplets", "匾额的书法题诗与楹联"],
      ["Ubiquitous cultural symbols", "无处不在的文化符号"],
    ],
    harmony: [
      ["Winding paths to seclusion", "曲径通幽"],
      ["Interplay of light and shadow", "明暗交错"],
      ["Alternation of density and spacing", "疏密相间"],
      ["Balance between openness and privacy", "旷奥相济"],
      ["Changing views with changing steps", "移步换景"],
      ["Beauty in all four seasons", "四季皆景"],
      ["Nuanced but profound aesthetics", "含蓄幽远"],
    ],
    naturalness: [
      ["Tailor to the natural environment", "因地制宜"],
      ["Nestled by/follow mountains and waters", "依山傍水"],
      ["Unity between nature and man", "天人合一"],
      ["Retreat to serene nature", "归隐山林"],
    ],
  };

  learningStops.forEach((stop) => {
    assert.deepEqual(
      stop.principles.map(({ english, chinese }) => [english, chinese]),
      expected[stop.id],
    );
    assert.match(stop.observation, /[\u4e00-\u9fff]/);
    assert.match(stop.hotspot.label, /[\u4e00-\u9fff]/);
    assert.equal(typeof stop.hotspot.marker, "string");
  });

  assert.deepEqual(learningStops[2].principles.at(-1).children, [
    { english: "Concealment", chinese: "犹抱琵琶" },
    { english: "Multiple layers", chinese: "错落有致" },
    { english: "Empty Space", chinese: "留白艺术" },
  ]);
});
```

- [ ] **Step 2: Run the test and confirm it fails for the missing data**

Run:

```bash
node --test tests/content.test.js
```

Expected: FAIL because `stop.principles`, `stop.observation`, and `stop.hotspot` do not yet exist.

- [ ] **Step 3: Extend the four records in `data/content.js`**

Add these fields to the matching stop records, preserving their existing identifiers and narration-compatible fields:

```js
// contrast
intro: "Openings and restraint let a compact garden suggest a larger world.",
principles: [
  { english: "Various scales of openings", chinese: "大小开合" },
  { english: "Vastness within a small area", chinese: "小中见大" },
  { english: "Enhance the grand with the small", chinese: "以小衬大" },
  { english: "Less is more", chinese: "以少胜多" },
],
observation: "观景提示：留意漏窗如何框取远景，让有限庭院显出深远与开阔。",
hotspot: { marker: "窗", label: "点击漏窗阅览对比与平衡 / Open the framed-window lesson" },

// poetic
intro: "Architecture, names and inscriptions make a garden a walkable poem and painting.",
principles: [
  { english: "3D landscape painting", chinese: "三维山水画" },
  { english: "A reflection of the literati's personality and worldview", chinese: "造园人的文人情结" },
  { english: "Residences and social hangouts", chinese: "文人雅士的雅集文酒之处" },
  { english: "Poetic names of architecture", chinese: "亭台楼阁的诗意命名" },
  { english: "Inscriptions of poetry or calligraphic art on the plaques and gate couplets", chinese: "匾额的书法题诗与楹联" },
  { english: "Ubiquitous cultural symbols", chinese: "无处不在的文化符号" },
],
observation: "观景提示：看看水亭与匾额所在之处，建筑如何成为诗文、书法与雅集的载体。",
hotspot: { marker: "诗", label: "点击亭上匾额阅览诗画的雅趣 / Open the pavilion-plaque lesson" },

// harmony
intro: "Variety unfolds step by step, held together by rhythm, concealment and calm.",
principles: [
  { english: "Winding paths to seclusion", chinese: "曲径通幽" },
  { english: "Interplay of light and shadow", chinese: "明暗交错" },
  { english: "Alternation of density and spacing", chinese: "疏密相间" },
  { english: "Balance between openness and privacy", chinese: "旷奥相济" },
  { english: "Changing views with changing steps", chinese: "移步换景" },
  { english: "Beauty in all four seasons", chinese: "四季皆景" },
  {
    english: "Nuanced but profound aesthetics",
    chinese: "含蓄幽远",
    children: [
      { english: "Concealment", chinese: "犹抱琵琶" },
      { english: "Multiple layers", chinese: "错落有致" },
      { english: "Empty Space", chinese: "留白艺术" },
    ],
  },
],
observation: "观景提示：顺着曲径观察竹影、遮掩、层次和水面留白，景色如何逐步显现。",
hotspot: { marker: "径", label: "点击曲径阅览多样性与和谐性 / Open the winding-path lesson" },

// naturalness
intro: "Good design settles into terrain and water until craft feels natural.",
principles: [
  { english: "Tailor to the natural environment", chinese: "因地制宜" },
  { english: "Nestled by/follow mountains and waters", chinese: "依山傍水" },
  { english: "Unity between nature and man", chinese: "天人合一" },
  { english: "Retreat to serene nature", chinese: "归隐山林" },
],
observation: "观景提示：观察临水亭台与叠石竹木的关系，人造之景如何顺应水岸与地势。",
hotspot: { marker: "山", label: "点击水岸叠石阅览自然与质朴 / Open the waterside lesson" },
```

- [ ] **Step 4: Verify the structured reference passes**

Run:

```bash
node --test tests/content.test.js
```

Expected: all content tests pass and all four themes carry their full bilingual term lists.

- [ ] **Step 5: Commit the content contract**

```bash
git add data/content.js tests/content.test.js
git commit -m "feat: add complete bilingual garden principles"
```

### Task 2: Render Hotspot-Activated Knowledge Scrolls

**Files:**
- Modify: `tests/shell.test.js`
- Modify: `js/app.js`

- [ ] **Step 1: Add failing renderer assertions**

Append this test to `tests/shell.test.js`:

```js
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
```

- [ ] **Step 2: Confirm the old permanent card fails the new expectation**

Run:

```bash
node --test tests/shell.test.js
```

Expected: FAIL because the current renderer contains `study-card` and has no hotspot, scroll state, or principle-list renderer.

- [ ] **Step 3: Add scroll state and bilingual list rendering to `js/app.js`**

After `let touchStartX = null;`, add:

```js
let scrollOpen = false;

function renderPrincipleItems(items, nested = false) {
  return `<ul class="${nested ? "principle-children" : "principle-list"}">
    ${items.map((item) => `
      <li>
        <span class="term-zh">${item.chinese}</span>
        <span class="term-en">${item.english}</span>
        ${item.children ? renderPrincipleItems(item.children, true) : ""}
      </li>`).join("")}
  </ul>`;
}

function setScrollOpen(open) {
  scrollOpen = open;
  const scene = document.getElementById("learnScene");
  const hotspot = document.getElementById("learningHotspot");
  const scroll = document.getElementById("knowledgeScroll");
  if (!scene || !hotspot || !scroll) return;
  scene.classList.toggle("is-observed", open);
  scroll.classList.toggle("is-open", open);
  scroll.toggleAttribute("inert", !open);
  scroll.setAttribute("aria-hidden", String(!open));
  hotspot.setAttribute("aria-expanded", String(open));
}
```

Reset the panel when changing scenes by updating `openStop()`:

```js
function openStop(id) {
  stopNarration();
  scrollOpen = false;
  state = visitStop(state, id);
  saveState();
  renderLearn();
}
```

- [ ] **Step 4: Replace the permanent learning card markup and handlers**

In `renderLearn()`, retain the scene image, learning effect, and stop navigation, then replace the `study-card` article with:

```js
    <button class="learning-hotspot learning-hotspot--${stop.id}" id="learningHotspot"
      aria-controls="knowledgeScroll" aria-expanded="${scrollOpen}" aria-label="${stop.hotspot.label}">
      <b>${stop.hotspot.marker}</b>
      <span>点击阅览<br><small>Tap to learn</small></span>
    </button>
    <aside class="knowledge-scroll ${scrollOpen ? "is-open" : ""}" id="knowledgeScroll"
      aria-label="${stop.principle} / ${stop.chinese}" aria-hidden="${!scrollOpen}"
      ${scrollOpen ? "" : "inert"}>
      <button class="scroll-close" id="scrollClose" aria-label="关闭知识卷轴 / Close learning scroll">×</button>
      <p class="eyebrow">${stop.number} / Four Principles</p>
      <h2>${stop.title}</h2>
      <p class="chinese">${stop.chinese}</p>
      <p class="principle-name">${stop.principle}</p>
      <p class="scroll-intro">${stop.intro}</p>
      ${renderPrincipleItems(stop.principles)}
      <p class="observation">${stop.observation}</p>
      <p class="script">${stop.script}</p>
      <div class="learning-actions">
        <button class="listen-button" id="listen">播放讲解 / Listen</button>
      </div>
      <div class="walk-footer">
        <p class="gate-status">${visitedCount === 4 ? "The garden gate is open." : `${visitedCount} of 4 principles visited`}</p>
        ${canEnterChallenge(state)
          ? `<button class="seal-button" id="beginChallenge">Begin Challenge</button>`
          : `<button class="soft-button" id="nextStop">${state.activeStop < 3 ? "Next View" : "Visit All Views"}</button>`}
      </div>
    </aside>`;
```

Replace the old observe/listen setup with:

```js
  const scene = document.getElementById("learnScene");
  const scroll = document.getElementById("knowledgeScroll");
  document.getElementById("learningHotspot").addEventListener("click", () => {
    setScrollOpen(!scrollOpen);
    if (scrollOpen) announce(`${stop.chinese}. ${stop.principle}.`);
  });
  document.getElementById("scrollClose").addEventListener("click", () => setScrollOpen(false));
  scene.addEventListener("click", (event) => {
    if (scrollOpen && !event.target.closest(".learning-hotspot")) setScrollOpen(false);
  });
  document.getElementById("listen").addEventListener("click", () => void playNarration(stop, scroll));
```

Keep the existing stop-navigation, next-view, challenge, swipe, and parallax handlers below those handlers. This preserves the route while shifting the information layer from always visible to voluntarily opened.

- [ ] **Step 5: Reset the scroll before leaving the learning phase**

In the existing `beginChallenge` click handler, reset the transient panel state before moving into the challenge:

```js
  const begin = document.getElementById("beginChallenge");
  begin?.addEventListener("click", async () => {
    stopNarration();
    scrollOpen = false;
    audio.stopAll();
    state = enterChallenge(state);
    pendingFeedback = null;
    saveState();
    await audio.startMusic(music.bgm);
    render();
  });
```

This guarantees that `Review the Four Principles` later returns to an unobstructed resting scene.

- [ ] **Step 6: Run the interaction-level tests**

Run:

```bash
node --test tests/content.test.js tests/shell.test.js
```

Expected: PASS, including the new guarantee that the permanent study card is no longer rendered.

- [ ] **Step 7: Commit the renderer behavior**

```bash
git add js/app.js tests/shell.test.js
git commit -m "feat: reveal learning scrolls from scene hotspots"
```

### Task 3: Style the Unobstructed Scene and Responsive Scroll

**Files:**
- Modify: `tests/shell.test.js`
- Modify: `styles.css`

- [ ] **Step 1: Add failing CSS-contract checks**

Extend the existing CSS test in `tests/shell.test.js` with:

```js
  assert.match(css, /\.learning-hotspot/);
  assert.match(css, /\.knowledge-scroll/);
  assert.match(css, /\.knowledge-scroll\.is-open/);
  assert.match(css, /\.principle-list/);
  assert.match(css, /\.scroll-close/);
```

- [ ] **Step 2: Run the CSS test to prove styles are absent**

Run:

```bash
node --test tests/shell.test.js
```

Expected: FAIL until the hotspot and scroll style hooks exist.

- [ ] **Step 3: Replace card-specific styles with revealable scroll styles**

Remove the `.study-card`, `.study-card h2`, `.insight`, `.observe-button`, and `.study-card.is-listening .script` rules. Keep reusable `.principle-name`, `.learning-actions`, `.walk-footer`, and `.script` rules, adjusting the script visibility through `.knowledge-scroll.is-listening .script`.

Add this learning-panel styling after `.stop-nav .active`:

```css
.learning-hotspot {
  position: absolute;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 12px 7px 8px;
  border: 1px solid rgba(182, 99, 92, .34);
  border-radius: 28px;
  background: rgba(248, 242, 227, .84);
  box-shadow: 0 10px 25px rgba(21, 42, 36, .16);
  color: var(--pine);
  font-size: .8rem;
  line-height: 1.12;
  backdrop-filter: blur(5px);
  animation: hotspot-pulse 3.4s ease-in-out infinite;
}

.learning-hotspot b {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--cinnabar);
  color: var(--paper-bright);
  font-family: var(--han);
  font-size: 1.08rem;
  font-weight: 500;
}

.learning-hotspot small {
  color: var(--pine-soft);
  font-size: .72rem;
  letter-spacing: .08em;
}

.learning-hotspot--contrast { top: 34%; left: 9%; }
.learning-hotspot--poetic { top: 34%; right: 13%; }
.learning-hotspot--harmony { bottom: 34%; left: 37%; }
.learning-hotspot--naturalness { top: 49%; right: 20%; }

.knowledge-scroll {
  position: absolute;
  z-index: 4;
  right: 12px;
  bottom: 0;
  left: 12px;
  max-height: min(72svh, 680px);
  padding: 25px 20px 19px;
  overflow-y: auto;
  border: 1px solid var(--border);
  background: rgba(249, 242, 225, .97);
  box-shadow: 0 -15px 42px var(--shadow);
  transform: translateY(calc(100% + 28px));
  opacity: 0;
  pointer-events: none;
  transition: transform .42s ease, opacity .34s ease;
}

.knowledge-scroll.is-open {
  transform: none;
  opacity: 1;
  pointer-events: auto;
}

.scroll-close {
  position: sticky;
  top: 0;
  float: right;
  z-index: 1;
  width: 44px;
  padding: 0;
  border: 1px solid rgba(21, 61, 56, .16);
  background: var(--paper-bright);
  color: var(--cinnabar);
  font-size: 1.65rem;
}

.knowledge-scroll h2 {
  margin-bottom: 5px;
  color: var(--pine);
  font-size: clamp(2rem, 8vw, 2.45rem);
  font-weight: 500;
  line-height: 1;
}

.scroll-intro {
  margin: 13px 0 15px;
  color: var(--pine);
  font-size: 1rem;
  line-height: 1.38;
}

.principle-list,
.principle-children {
  display: grid;
  gap: 9px;
  margin: 0 0 17px;
  padding: 0;
  list-style: none;
}

.principle-list > li {
  padding: 9px 10px;
  border-left: 2px solid var(--gold);
  background: rgba(240, 229, 203, .44);
}

.term-zh,
.term-en {
  display: block;
}

.term-zh {
  color: var(--pine);
  font-family: var(--han);
  font-size: .98rem;
}

.term-en {
  margin-top: 3px;
  color: #465850;
  font-size: .88rem;
  line-height: 1.3;
}

.principle-children {
  gap: 5px;
  margin: 9px 0 0 12px;
}

.principle-children li {
  padding-left: 9px;
  border-left: 1px solid rgba(182, 99, 92, .42);
}

.observation {
  margin: 13px 0;
  padding: 11px 12px;
  background: rgba(71, 126, 120, .1);
  color: var(--pine);
  font-family: var(--han);
  font-size: .9rem;
  line-height: 1.55;
}

.knowledge-scroll.is-listening .script {
  display: block;
  animation: rise .35s ease both;
}
```

In the wide-screen media rule, replace the `.study-card` and desktop `.script` rules with:

```css
  .knowledge-scroll {
    top: 88px;
    right: 25px;
    bottom: 22px;
    left: auto;
    width: min(460px, 38vw);
    max-height: none;
    padding: 28px 26px 23px;
    box-shadow: -22px 8px 56px rgba(21, 42, 36, .18);
    transform: translateX(calc(100% + 36px));
  }

  .knowledge-scroll.is-open {
    transform: none;
  }

  .knowledge-scroll .script {
    display: block;
  }
```

Remove the mobile short-height `.study-card` rule because a bottom drawer is already scrollable. Add the pulse animation beside the existing keyframes:

```css
@keyframes hotspot-pulse {
  50% { transform: translateY(-3px); box-shadow: 0 15px 31px rgba(21, 42, 36, .2); }
}
```

- [ ] **Step 4: Run shell and content tests**

Run:

```bash
node --test tests/content.test.js tests/shell.test.js
```

Expected: PASS with selectors for the hotspot and responsive scroll present.

- [ ] **Step 5: Commit visual interaction styling**

```bash
git add styles.css tests/shell.test.js
git commit -m "style: preserve garden views behind learning scrolls"
```

### Task 4: Rebuild Offline Output and Verify the Experience

**Files:**
- Modify generated artifact: `js/app.bundle.js`
- Inspect only: `assets/images/learn-framed-vastness.jpg`, `assets/images/learn-poetic-reflection.jpg`, `assets/images/learn-changing-view.jpg`, `assets/images/learn-naturalness.jpg`

- [ ] **Step 1: Regenerate the direct-file browser bundle**

Run:

```bash
node scripts/build-offline.mjs
```

Expected: `js/app.bundle.js` contains the new principle data and scroll renderer with no module imports.

- [ ] **Step 2: Run the complete automated verification**

Run:

```bash
node scripts/build-offline.mjs --check
node --test tests/*.test.js
git diff --check
```

Expected: bundle check passes, all tests pass, and `git diff --check` prints no whitespace errors.

- [ ] **Step 3: Commit the generated offline application update**

```bash
git add js/app.bundle.js
git commit -m "build: update offline learning journey bundle"
```

- [ ] **Step 4: Verify desktop behavior in the in-app browser**

Use the browser companion to open the known local project target through the permitted local preview server, enter the garden, and inspect each scene.

Expected:

- the illustration is initially unobstructed by a large text card;
- each hotspot appears over its intended illustrated cue;
- clicking the hotspot reveals the side scroll with the correct full bilingual theme content;
- clicking close, the hotspot again, or open garden space hides the scroll;
- switching scenes closes the previous scroll;
- narration and `Next View`/`Begin Challenge` continue to function.

- [ ] **Step 5: Verify narrow/mobile layout**

Resize browser inspection to a narrow phone-like viewport and revisit one short and one long panel, including `Diversity and Harmony / 多样性与和谐性`.

Expected: the scroll rises as a readable bottom drawer, can be scrolled to its nested `含蓄幽远` items, and its close button remains reachable.

- [ ] **Step 6: Decide whether illustration generation is justified**

Compare the active hotspots with the four inspected source images. The initial implementation intentionally uses current artwork. Only create an image follow-up if the browser view shows that the poem/plaque hotspot or another themed marker lacks a legible relationship to the illustration.

Expected for current assets: no required replacement; the poetic pavilion includes a plaque area adequate for the hotspot, although inscribed plaque art can be proposed as a later refinement.

## Completion Criteria

- All four scenes open in an artwork-first state and expose their content by hotspot only.
- Every English/Chinese term from the supplied slide appears in the correct scroll, including the three nested harmony terms.
- Desktop and narrow layouts allow opening, reading, and closing without trapping the player behind content.
- Existing offline launch and audio fixes remain working.
- All automated tests and direct browser checks pass before reporting completion.
