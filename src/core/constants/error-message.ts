/**
 * Generic Http error message
 */
const HTTP_MESSAGE = Object.freeze({
  UNKNOWN_SERVER_ERROR: "A system error has occured. Please try again later.",
  NOT_FOUND: "The resource that you were looking for was not found.",
  DUPLICATED: "The resource already exists on the server",
  QUERY_ERROR: "A query error has occured. Please try again later.",
  UNAUTHORIZED: "You do not have the permission to perform this action.",
  AUTHENTICATION_EXPIRED: "Authentication info expired",
  AUTHENTICATED_FAILED: "Authentication incorrect or missing",
  USER_ALREADY_ACTIVE: "This account is already active",
  USER_ALREADY_DISABLED: "This account is already disabled",
});

/**
 * Generic validation error message
 */
const VALIDATION_MESSAGE = Object.freeze({
  INCORRECT_CREDENTIAL: "The provided authentication credential is incorrect",
});

const ENTITY_MESSAGE = Object.freeze({
  USER_NOT_FOUND: "The user that you were looking for was not found.",
  USER_IS_DISABLED: "This account is disabled.",
});

export { HTTP_MESSAGE, VALIDATION_MESSAGE, ENTITY_MESSAGE };
