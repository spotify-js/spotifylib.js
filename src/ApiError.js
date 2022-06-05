class ApiError extends Error {
  /**
   * API Error.
   * @param {number} status - The fetch response status.
   * @param {string} message - The error message.
   * @extends {Error}
   */
  constructor(error) {
    /* prettier-ignore */
    super(`API Error: status ${error.status} - ${error.message}`);

    /**
     * The fetch response status.
     * @type {number}
     */
    this.error = error;
  }
}

module.exports = ApiError;

/**
 * @typedef {Object} Status
 * @property {number} status - The status from the request.
 */
