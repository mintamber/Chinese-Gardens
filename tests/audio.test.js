import test from "node:test";
import assert from "node:assert/strict";
import { createAudioController } from "../js/audio.js";

function fakeAudio(src) {
  return {
    src,
    paused: true,
    loop: false,
    plays: 0,
    pauses: 0,
    async play() {
      this.paused = false;
      this.plays += 1;
    },
    pause() {
      this.paused = true;
      this.pauses += 1;
    },
  };
}

test("playing narration pauses the previous spoken guide", async () => {
  const made = [];
  const audio = createAudioController((src) => {
    const player = fakeAudio(src);
    made.push(player);
    return player;
  });

  assert.equal(await audio.playNarration("one.m4a"), true);
  assert.equal(await audio.playNarration("two.m4a"), true);
  assert.equal(made[0].pauses, 1);
  assert.equal(made[1].plays, 1);
});

test("changing views can stop narration without stopping challenge music", async () => {
  const made = [];
  const audio = createAudioController((src) => {
    const player = fakeAudio(src);
    made.push(player);
    return player;
  });

  await audio.playNarration("guide.m4a");
  await audio.startMusic("bgm.mp3");
  audio.stopNarration();

  assert.equal(made[0].paused, true);
  assert.equal(audio.status().musicPlaying, true);
});

test("starts looping BGM only from an explicit challenge action", async () => {
  const audio = createAudioController(fakeAudio);
  assert.deepEqual(audio.status(), {
    musicStarted: false,
    musicPlaying: false,
    musicUnavailable: false,
  });

  await audio.startMusic("bgm.mp3");
  assert.equal(audio.status().musicStarted, true);
  assert.equal(audio.status().musicPlaying, true);
  audio.toggleMusic();
  assert.equal(audio.status().musicPlaying, false);
  audio.toggleMusic();
  assert.equal(audio.status().musicPlaying, true);
});

test("reports unavailable music without throwing into gameplay", async () => {
  const broken = () => ({
    ...fakeAudio("missing"),
    async play() {
      throw new Error("not installed");
    },
  });
  const audio = createAudioController(broken);
  await audio.startMusic("bgm.mp3");
  assert.equal(audio.status().musicUnavailable, true);
  assert.doesNotThrow(() => audio.toggleMusic());
});

test("stopping all playback returns the music status to paused", async () => {
  const audio = createAudioController(fakeAudio);
  await audio.playNarration("one.m4a");
  await audio.startMusic("bgm.mp3");
  audio.stopAll();
  assert.equal(audio.status().musicPlaying, false);
});
