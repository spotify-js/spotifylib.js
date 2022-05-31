const fetch = require('node-fetch');

class Util {
  /**
   * The spotify client's util.
   * @param {Spotify} Spotify - The spotify client.
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
   * @param {object} body - The body for the fetch.
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
    options['method'] = method;
    options.headers['Authorization'] = 'Bearer ' + this.spotify.access_token;

    if (Object.keys(body).length) {
      if (typeof body == 'object') {
        options['body'] = JSON.stringify(body);
      } else {
        options['body'] = body;
      }
    }

    return new Promise((resolve) => {
      fetch(path, options).then((response) => {
        if (response.status == 401 && this.spotify.refresher) {
          this.spotify.refresher.request().then((res) => {
            if (res.access_token) {
              this.spotify.set('access_token', res.access_token);
              resolve(this.fetch({ path, method, body, options }));
            } else {
              resolve(response);
            }
          });
        } else {
          resolve(response);
        }
      });
    });
  }
}

module.exports = Util;
