const fetch = require('node-fetch');

class Util {
  /**
   * The spotify client's util.
   * @param {Spotify} Spotify - The spotify client.
   * @private
   */
  constructor(Spotify) {
    /**
     * The spotify client.
     * @type {Spotify}
     */
    this.spotify = Spotify;
  }
  /**
   * Fetchs from spotify's api.
   * @param {string} path - The path to fetch from.
   * @param {string} method - The method used in the fetch.
   * @param {node-fetch#Options} options - The options for the fetch.
   * @returns {node-fetch#Response}
   */
  fetch({
    path,
    method = 'get',
    body = {},
    options = {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  }) {
    options.headers['Authorization'] = 'Bearer ' + this.spotify.access_token;
    options['method'] = method;

    if (Object.keys(body).length) {
      options['body'] = JSON.stringify(body);
    }

    return new Promise((resolve) => resolve(fetch(path, options)));
  }
}

module.exports = Util;
