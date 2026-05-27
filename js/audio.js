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

  function stopNarration() {
    voice?.pause();
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

    if (bgm.paused) {
      void bgm.play().catch(() => {
        musicUnavailable = true;
      });
    } else {
      bgm.pause();
    }
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

  return {
    playNarration,
    stopNarration,
    startMusic,
    toggleMusic,
    stopAll,
    status,
  };
}
