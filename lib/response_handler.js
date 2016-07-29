/**
 * Response handler (borrowed from ripple-rest)
 * Format http(s) responses and appropriate error codes
 *
 * Every response will have JSON body containing at least the `success` property
 * Responses will be accompanied by appropriate error codes
 *
 * In case of error, an error type and optional message will be supplied
 *
 *
 * HTTP Status Codes
 *
 * 200 OK - Everything worked as expected.
 * 201 Created - POST request has been accepted and resulted in successful creation.
 * 202 Accepted - Request has been accepted for processing. E.g. submitting a transaction.
 * 400 Bad Request - Invalid or malformed request. E.g. missing or invalid parameter.
 * 403 Forbidden - Unauthorized access to endpoint
 * 404 Not Found - The requested item doesn't exist.
 * 500 Internal Server Error - Unexpected condition occurred
 *
 *
 * Error Types
 *
 * invalid_request  - invalid request errors arise when the request has invalid parameters.
 * transaction      - response from rippled or internal processing error
 * server           - unexpected condition in the server occurred
 *
 */

var _ = require('lodash')

var ErrorType = {
  invalidRequest: 'invalid_request',
  transaction: 'transaction',
  unauthorized: 'unauthorized_request',
  server: 'server',
  unprocessableEntity: 'unprocessable_entity'
}

var StatusCode = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  unprocessableEntity: 422,
  internalServerError: 500,
  serviceUnavailable: 503
}

module.exports = {
  success: success,
  created: created,
  errorSet: errorSet,
  transactionError: transactionError,
  invalidRequest: invalidRequestError,
  internalError: internalError,
  notFoundError: notFoundError,
  serviceUnavailable: serviceUnavailableError,
  unprocessableEntity: unprocessableEntityError
}

/**
 * Send a success response
 *
 * @param response - response object
 * @param body - (optional) body to the response, in addition to the success property
 */
function success (response, body) {
  var content =
    {
      success: true
    }

  if (body !== void (0)) {
    content = _.extend(content, body)
  }

  send(response, content, StatusCode.ok)
}

/**
 * Send a created response
 *
 * @param response - response object
 * @param body - (optional) body to the response, in addition to the success property
 */
function created (response, body) {
  var content =
    {
      success: true
    }

  if (body !== void (0)) {
    content = _.extend(content, body)
  }

  send(response, content, StatusCode.created)
}

/**
 * Define error
 *
 * @param response - response object
 * @param body - (optional) body to the response, in addition to the success property
 */
function errorSet (response, body) {
  body.status = _.toNumber(body.status)

  if (body.status === StatusCode.notFound) {
    notFoundError(response, body.error, null)
  }

  if (body.status === StatusCode.badRequest) {
    invalidRequestError(response, body.error, null)
  }

  if (body.status === StatusCode.internalServerError) {
    internalError(response, body.error, null)
  }

  if (body.status === StatusCode.unauthorized) {
    unauthorizedRequestError(response, body.error, null)
  }

  if (body.status === StatusCode.serviceUnavailable) {
    serviceUnavailableError(response, body.error, null)
  }

  if (body.status === StatusCode.unprocessableEntity) {
    unprocessableEntityError(response, null, response.response.body)
  }
}

/**
 * Send an transaction error response
 *
 * @param response  - response object
 * @param message   - (optional) message to accompany and describe the invalid response
 * @param body      - (optional) additional body to the response
 */
function transactionError (response, message, body) {
  var content = {
    success: false,
    error_type: ErrorType.transaction
  }

  if (message) {
    content.message = message
  }

  if (body) {
    content = _.extend(content, body)
  }

  send(response, content, StatusCode.internalServerError)
}

/**
 * Send a unprocessable entity error response
 *
 * @param response  - response object
 * @param message   - (optional) message to accompany and describe the invalid response
 * @param body      - (optional) additional body to the response
 */
function unprocessableEntityError (response, message, body) {
  var content = {
    success: false,
    error_type: ErrorType.unprocessableEntity
  }

  if (message) {
    content.message = message
  }

  if (body) {
    content = _.extend(content, body)
  }

  send(response, content, StatusCode.unprocessableEntity)
}

/**
 * Send an invalid request error response
 *
 * @param response  - response object
 * @param message   - (optional) message to accompany and describe the invalid response
 * @param body      - (optional) additional body to the response
 */
function invalidRequestError (response, message, body) {
  var content = {
    success: false,
    error_type: ErrorType.invalidRequest
  }

  if (message) {
    content.message = message
  }

  if (body) {
    content = _.extend(content, body)
  }

  send(response, content, StatusCode.badRequest)
}

/**
 * Send a service unavailable error response
 *
 * @param response  - response object
 * @param message   - (optional) message to accompany and describe the invalid response
 * @param body      - (optional) additional body to the response
 */
function serviceUnavailableError (response, message, body) {
  var content = {
    success: false,
    error_type: ErrorType.server
  }

  if (message) {
    content.message = message
  }

  if (body) {
    content = _.extend(content, body)
  }

  send(response, content, StatusCode.serviceUnavailable)
}

/**
 * Send an unauthorized request error response
 *
 * @param response  - response object
 * @param message   - (optional) message to accompany and describe the invalid response
 * @param body      - (optional) additional body to the response
 */
function unauthorizedRequestError (response, message, body) {
  var content = {
    success: false,
    error_type: ErrorType.unauthorized
  }

  if (message) {
    content.message = message
  }

  if (body) {
    content = _.extend(content, body)
  }

  send(response, content, StatusCode.unauthorized)
}

/**
 * Send an internal error response
 *
 * @param response  - response object
 * @param message   - (optional) additional error message, e.g. description for provided error
 * @param body      - (optional) additional body to the response
 */
function internalError (response, message, body) {
  var content = {
    success: false,
    error_type: ErrorType.server
  }

  if (message) {
    content.message = message
  }

  if (body) {
    content = _.extend(content, body)
  }

  send(response, content, StatusCode.internalServerError)
}

/**
 * Send a not found error response
 *
 * @param response  - response object
 * @param message   - (optional) additional error message
 * @param body      - (optional) additional body to the response
 */
function notFoundError (response, message, body) {
  var content = {
    success: false,
    error_type: ErrorType.invalidRequest
  }

  if (message) {
    content.message = message
  }

  if (body) {
    content = _.extend(content, body)
  }

  send(response, content, StatusCode.notFound)
}

/**
 * Send a JSON response
 *
 * @param response - response object
 * @param body
 * @param statusCode
 */
function send (response, body, statusCode) {
  response.status = statusCode
  response.json = body
}
