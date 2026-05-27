import test from "node:test";
import assert from "node:assert/strict";
import {
  answerQuestion,
  canEnterChallenge,
  createJourneyState,
  enterChallenge,
  getResult,
  resetJourney,
  visitStop,
} from "../js/state.js";

test("locks the challenge until all four learning stops are visited", () => {
  let state = createJourneyState();
  ["contrast", "poetic", "harmony"].forEach((id) => {
    state = visitStop(state, id);
  });
  assert.equal(canEnterChallenge(state), false);
  assert.throws(() => enterChallenge(state), /complete the learning walk/i);

  state = visitStop(state, "naturalness");
  assert.equal(canEnterChallenge(state), true);
  assert.equal(enterChallenge(state).phase, "challenge");
});

test("records one answer per question and rewards its observation lens", () => {
  let state = enterChallenge({
    ...createJourneyState(),
    visitedStops: ["contrast", "poetic", "harmony", "naturalness"],
  });
  state = answerQuestion(state, { questionId: "frame", lens: "contrast", correct: true });
  assert.deepEqual(state.answers.frame, { lens: "contrast", correct: true });
  assert.equal(state.scores.contrast, 1);
  assert.throws(
    () => answerQuestion(state, { questionId: "frame", lens: "contrast", correct: false }),
    /already answered/i,
  );
});

test("uses five decisions to select a strongest aesthetic profile", () => {
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
  assert.deepEqual(getResult(state), { lens: "harmony", score: 2, correct: 3 });
  assert.deepEqual(resetJourney(), createJourneyState());
});

test("rejects unknown stops and answers outside the challenge", () => {
  assert.throws(() => visitStop(createJourneyState(), "other"), /unknown learning stop/i);
  assert.throws(
    () => answerQuestion(createJourneyState(), { questionId: "frame", lens: "contrast", correct: true }),
    /not active/i,
  );
});
