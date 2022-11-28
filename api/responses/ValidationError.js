/**
 * Class to provide uniform instance/formatting for validation error responses
 * @module ValidationError
 */
class ValidationError {
  /**
   * @constructor
   * @param {number} status - HTTP status code
   * @param {string} message - Error description
   * @param {object} errors - Array of validation errors to be added in response
   */
  constructor(status = 400, errors) {
    this.timestamp = new Date();
    this.status = status;
    this.message = 'Validation error';
    this.errors = errors;
  }
}

module.exports = ValidationError;
