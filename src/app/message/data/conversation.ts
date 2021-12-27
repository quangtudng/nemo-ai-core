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
  START_CONVERSATION: 1,
  // Customer asks about Covid situation of a location, Nemo asks about location if it is not provided
  COVID: {
    CUSTOMER_ASK: 2.1,
    NEMO_ASK_LOCATION: 2.2,
    NEMO_PROVIDED_RESULT: 2.3,
  },
  // Customer asks about information of a location, Nemo asks about location if it is not provided
  LOCATION_INFO: {
    CUSTOMER_ASK: 3.1,
    NEMO_ASK_LOCATION: 3.2,
    NEMO_PROVIDED_RESULT: 3.3,
  },
  // Customer asks about the services of a location
  SERVICE: {
    CUSTOMER_ASK: 4.1,
    NEMO_ASK_LOCATION: 4.2,
    NEMO_ASK_SERVICE: 4.3,
    NEMO_ASK_EMAIL: 4.5,
    NEMO_PROVIDED_RESULT: 4.4,
  },
  // Customer directly asks about the detail of a service
  DETAIL_SERVICE: {
    CUSTOMER_ASK: 6.1,
    NEMO_ASK_LOCATION: 5.2,
    NEMO_ASK_SERVICE: 5.3,
    NEMO_ASK_EMAIL: 4.6,
    NEMO_PROVIDED_RESULT: 5.4,
  },
  // Nemo asks if customer need anything else
  ANYTHING_ELSE: 6,
  // Conversation is automatically ended after 30 minutes of inactive
  END_CONVERSATION: 7,
  // When customer needs direction
  HELP: 8,
});

export { QUESTION_TYPE, CONVERSATION_STAGE, MESSAGE_OWNER };
