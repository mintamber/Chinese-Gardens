import { learningStops, questions, resultProfiles } from "../data/content.js";
import { images, music, narration } from "../data/assets.js";
import {
  answerQuestion,
  canEnterChallenge,
  createJourneyState,
  enterChallenge,
  getResult,
  resetJourney,
  visitStop,
} from "./state.js";
import { createAudioController } from "./audio.js";

const STORAGE_KEY = "moonGateJourney";
const nodes = Object.fromEntries(
  ["app", "arrival", "learn", "challenge", "result", "audioDock", "announcement"].map((id) => [
    id,
    document.getElementById(id),
  ]),
);
const audio = createAudioController();
let state = restoreState();
let pendingFeedback = null;
let touchStartX = null;
let scrollOpen = false;

function restoreState() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (!stored || !["arrival", "learn", "challenge", "result"].includes(stored.phase)) {
      return createJourneyState();
    }
    return stored;
  } catch {
    return createJourneyState();
  }
}

function saveState() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function announce(text) {
  nodes.announcement.textContent = text;
}

function stopNarration() {
  audio.stopNarration();
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function showPhase(phase) {
  nodes.app.dataset.phase = phase;
  ["arrival", "learn", "challenge", "result"].forEach((name) => {
    nodes[name].hidden = name !== phase;
  });
}

function applyParallax(container) {
  container.onpointermove = (event) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = (event.clientX / window.innerWidth - .5) * -10;
    const y = (event.clientY / window.innerHeight - .5) * -6;
    container.style.setProperty("--drift-x", `${x}px`);
    container.style.setProperty("--drift-y", `${y}px`);
  };
  container.onpointerleave = () => {
    container.style.removeProperty("--drift-x");
    container.style.removeProperty("--drift-y");
  };
}

function renderArrival() {
  nodes.arrival.innerHTML = `
    <img class="scene-image" src="${images.hero}" alt="">
    <article class="arrival-copy">
      <p class="eyebrow">An English Cultural Appreciation Journey</p>
      <h1 id="journeyTitle">Moon Gate<br>Journey <small>月洞门游园</small></h1>
      <p class="subtitle">Learn to see a Chinese classical garden.</p>
      <button class="seal-button" id="enterGarden">Enter the Garden</button>
      <span class="duration">A six-minute visual journey</span>
    </article>`;

  document.getElementById("enterGarden").addEventListener("click", () => {
    state = visitStop(state, learningStops[0].id);
    saveState();
    render();
  });
  applyParallax(nodes.arrival);
}

async function playNarration(stop, card) {
  card.classList.add("is-listening");
  const played = await audio.playNarration(narration[stop.id]);
  if (played) {
    announce(`Listening to ${stop.principle}.`);
    return;
  }

  if ("speechSynthesis" in window) {
    const speech = new SpeechSynthesisUtterance(stop.script);
    speech.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
    announce("Using device American English voice for this passage.");
  } else {
    announce("Audio is unavailable. Read the visible transcript.");
  }
}

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

function openStop(id) {
  stopNarration();
  scrollOpen = false;
  state = visitStop(state, id);
  saveState();
  renderLearn();
}

function renderLearn() {
  const stop = learningStops[state.activeStop];
  const visitedCount = state.visitedStops.length;
  nodes.learn.innerHTML = `
    <div class="learn-scene" id="learnScene">
      <img class="scene-image scene-image--${stop.id}" src="${images[stop.id]}" alt="">
      <div class="learning-effect learning-effect--${stop.id}" aria-hidden="true"></div>
    </div>
    <nav class="stop-nav" aria-label="Four garden principles">
      ${learningStops.map((item, index) => `
        <button class="${state.visitedStops.includes(item.id) ? "visited" : ""} ${index === state.activeStop ? "active" : ""}"
          data-stop="${item.id}" aria-current="${index === state.activeStop ? "step" : "false"}">
          <b>${item.number}</b>${item.title}
        </button>`).join("")}
    </nav>
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
  nodes.learn.querySelectorAll("[data-stop]").forEach((button) => {
    button.addEventListener("click", () => openStop(button.dataset.stop));
  });

  const next = document.getElementById("nextStop");
  next?.addEventListener("click", () => {
    const nextIndex = state.activeStop < 3 ? state.activeStop + 1 : 0;
    openStop(learningStops[nextIndex].id);
  });

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

  scene.addEventListener("pointerdown", (event) => {
    touchStartX = event.clientX;
  });
  scene.addEventListener("pointerup", (event) => {
    if (touchStartX === null || Math.abs(event.clientX - touchStartX) < 48) return;
    const direction = event.clientX < touchStartX ? 1 : -1;
    const nextIndex = Math.max(0, Math.min(learningStops.length - 1, state.activeStop + direction));
    openStop(learningStops[nextIndex].id);
    touchStartX = null;
  });
  applyParallax(nodes.learn);
}

function renderAudioDock() {
  const status = audio.status();
  nodes.audioDock.hidden = state.phase !== "challenge";
  if (state.phase !== "challenge") return;

  nodes.audioDock.innerHTML = `
    <button class="record ${status.musicPlaying ? "" : "is-paused"}" id="musicToggle"
      aria-label="${status.musicPlaying ? "Pause garden music" : "Play garden music"}">
      <span>乐</span>
    </button>
    <p class="audio-caption">${status.musicUnavailable ? "Music unavailable" : "Garden Music"}</p>`;
  document.getElementById("musicToggle").addEventListener("click", async () => {
    if (!status.musicStarted) {
      await audio.startMusic(music.bgm);
    } else {
      audio.toggleMusic();
    }
    renderAudioDock();
  });
}

function renderChoice(question, option) {
  if (question.id === "naming") {
    return `<button class="choice choice--name" data-option="${option.id}"><span>${option.label}</span></button>`;
  }
  return `<button class="choice" data-option="${option.id}">
    <img src="${images[option.id]}" alt="">
    <span>${option.label}</span>
  </button>`;
}

function renderChallenge() {
  const question = questions[state.questionIndex];
  nodes.challenge.innerHTML = `
    <header class="challenge-header">
      <div><p class="eyebrow">Complete the Garden</p><h1>A Seeing Eye</h1></div>
      <div class="challenge-count">${state.questionIndex + 1} / ${questions.length}</div>
    </header>
    <section class="question-panel">
      <h2>${question.prompt}</h2>
      <p class="guidance">${question.guidance}</p>
      ${question.scene ? `<figure class="poetic-stage"><img src="${images[question.scene]}" alt=""></figure>` : ""}
      <div class="choices ${question.id === "naming" ? "choices--names" : ""}">
        ${question.options.map((option) => renderChoice(question, option)).join("")}
      </div>
    </section>`;

  nodes.challenge.querySelectorAll("[data-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const option = question.options.find((candidate) => candidate.id === button.dataset.option);
      state = answerQuestion(state, {
        questionId: question.id,
        lens: question.lens,
        correct: option.correct,
      });
      pendingFeedback = { question, option };
      saveState();
      announce(`${option.correct ? "Well observed." : "Look once more in memory."} ${question.rationale}`);
      renderFeedback();
    });
  });
  renderAudioDock();
}

function renderFeedback() {
  const { question, option } = pendingFeedback;
  nodes.challenge.innerHTML = `
    <article class="feedback-card">
      <div class="mark">${option.correct ? "雅" : "观"}</div>
      <p class="eyebrow">${option.correct ? "Well Observed" : "Look More Gently"}</p>
      <h2>${question.prompt}</h2>
      <p class="feedback">${question.rationale}</p>
      <button class="seal-button" id="continue">
        ${state.phase === "result" ? "Reveal My Garden Eye" : "Continue Journey"}
      </button>
    </article>`;
  renderAudioDock();
  document.getElementById("continue").addEventListener("click", () => {
    pendingFeedback = null;
    render();
  });
}

function renderResult() {
  audio.stopAll();
  nodes.audioDock.hidden = true;
  const result = getResult(state);
  const profile = resultProfiles[result.lens];
  nodes.result.innerHTML = `
    <img class="scene-image" src="${images.result}" alt="">
    <article class="result-card">
      <p class="eyebrow">Your Garden Eye · ${result.correct} / ${questions.length}</p>
      <h2>${profile.title}</h2>
      <p class="chinese">${profile.chinese}</p>
      <p class="result-summary">${profile.feedback} Carry this way of seeing into the next garden you visit.</p>
      <div class="petals" aria-label="${result.correct} well observed choices">
        ${questions.map((_, index) => `<span class="petal ${index < result.correct ? "is-open" : ""}"></span>`).join("")}
      </div>
      <div class="result-actions">
        <button class="seal-button" id="replay">Walk Again</button>
        <button class="soft-button" id="review">Review the Four Principles</button>
      </div>
    </article>`;

  document.getElementById("replay").addEventListener("click", () => {
    state = resetJourney();
    sessionStorage.removeItem(STORAGE_KEY);
    render();
  });
  document.getElementById("review").addEventListener("click", () => {
    state = visitStop(resetJourney(), learningStops[0].id);
    saveState();
    render();
  });
  applyParallax(nodes.result);
}

function render() {
  showPhase(state.phase);
  if (state.phase === "arrival") renderArrival();
  if (state.phase === "learn") renderLearn();
  if (state.phase === "challenge") {
    if (pendingFeedback) renderFeedback();
    else renderChallenge();
  }
  if (state.phase === "result") renderResult();
}

render();
