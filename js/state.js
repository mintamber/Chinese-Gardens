const REQUIRED_STOPS = Object.freeze(["contrast", "poetic", "harmony", "naturalness"]);
const LENSES = Object.freeze(["contrast", "poetic", "harmony", "naturalness"]);
const QUESTION_COUNT = 5;

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
  if (!REQUIRED_STOPS.includes(id)) {
    throw new Error("Unknown learning stop.");
  }

  const visitedStops = state.visitedStops.includes(id)
    ? state.visitedStops
    : [...state.visitedStops, id];

  return {
    ...state,
    phase: "learn",
    activeStop: REQUIRED_STOPS.indexOf(id),
    visitedStops,
  };
}

export function canEnterChallenge(state) {
  return REQUIRED_STOPS.every((id) => state.visitedStops.includes(id));
}

export function enterChallenge(state) {
  if (!canEnterChallenge(state)) {
    throw new Error("Complete the learning walk before beginning the challenge.");
  }

  return {
    ...state,
    phase: "challenge",
    questionIndex: 0,
    answers: {},
    scores: { contrast: 0, poetic: 0, harmony: 0, naturalness: 0 },
  };
}

export function answerQuestion(state, { questionId, lens, correct }) {
  if (state.phase !== "challenge") {
    throw new Error("The challenge is not active.");
  }
  if (state.answers[questionId]) {
    throw new Error("This question is already answered.");
  }
  if (!LENSES.includes(lens)) {
    throw new Error("Unknown aesthetic lens.");
  }

  const answers = { ...state.answers, [questionId]: { lens, correct } };
  const scores = {
    ...state.scores,
    [lens]: state.scores[lens] + (correct ? 1 : 0),
  };
  const questionIndex = state.questionIndex + 1;

  return {
    ...state,
    answers,
    scores,
    questionIndex,
    phase: questionIndex === QUESTION_COUNT ? "result" : "challenge",
  };
}

export function getResult(state) {
  if (state.phase !== "result") {
    throw new Error("A result is not yet available.");
  }

  const lens = LENSES.reduce(
    (strongest, key) => (state.scores[key] > state.scores[strongest] ? key : strongest),
    LENSES[0],
  );
  const correct = Object.values(state.answers).filter((answer) => answer.correct).length;

  return { lens, score: state.scores[lens], correct };
}

export function resetJourney() {
  return createJourneyState();
}
