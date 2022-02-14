const QUESTION_TYPE = Object.freeze({
  // Most of the conversation texts are free texts
  FREE_TEXT: 1,
  // Result texts are texts with service information to show to customers
  RESULT_TEXT: 2,
  // Weather result texts
  WEATHER_TEXT: 3,
});

const MESSAGE_OWNER = Object.freeze({
  NEMO: "nemo",
  CUSTOMER: "customer",
});

const CONVERSATION_STAGE = Object.freeze({
  // When customer start the conversation
  INTRODUCTION: 1,
  // Starting capturing phase
  CAPTURING: 2,
});

export { QUESTION_TYPE, CONVERSATION_STAGE, MESSAGE_OWNER };
