/**
 * Generic Http error message
 */
const HTTP_MESSAGE = Object.freeze({
  UNKNOWN_SERVER_ERROR: "UNKNOWN_SERVER_ERROR",
  NOT_FOUND: "NOT_FOUND",
  DUPLICATED: "DUPLICATED",
  QUERY_ERROR: "QUERY_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
});

/**
 * Generic validation error message
 */
const VALIDATION_MESSAGE = Object.freeze({
  INCORRECT_CREDENTIAL: "INCORRECT_CREDENTIAL",
});

const ENTITY_MESSAGE = Object.freeze({
  USER_NOT_FOUND: "The user that you were looking for was not found.",
  USER_IS_DISABLED: "This account is disabled.",
});

export { HTTP_MESSAGE, VALIDATION_MESSAGE, ENTITY_MESSAGE };
