class HTTPError extends Error {
  /**
   * HTTP Error.
   * @param {node-fetch#Response} response - The fetch Response.
   * @extends {Error}
   */
  constructor(response) {
    /* prettier-ignore */
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);

    /**
     * The fetch Response.
     * @type {node-fetch#Response}
     */
    this.response = response;
  }
}

module.exports = HTTPError;
