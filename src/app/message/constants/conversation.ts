const QUESTION_TYPE = Object.freeze({
  // Most of the conversation texts are free texts
  FREE_TEXT: 1,
  // Result texts are texts with service information to show to customers
  RESULT_TEXT: 2,
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
  // Nemo asks if customer need anything else
  ANYTHING_ELSE: 3,
  // TODO: Conversation is automatically ended after 30 minutes of inactive
  END_CONVERSATION: 4,
});

export { QUESTION_TYPE, CONVERSATION_STAGE, MESSAGE_OWNER };
