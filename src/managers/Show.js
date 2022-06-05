const qs = require('querystring');
const Show = require('../structures/Show.js');
const Episode = require('../structures/Episode.js');

const API = 'https://api.spotify.com/v1/me/shows';
const HTTPError = require('../HTTPError.js');
const ApiError = require('../ApiError.js');

class ShowManager {
  /**
   * Manages spotify playing.
   * @param {Spotify} spotify - The spotify client.
   */
  constructor(spotify) {
    /**
     * The spotify client.
     * @type {Spotify}
     */
    this.spotify = spotify;
  }

  /**
   * Get Spotify catalog information for a single show identified by its unique Spotify ID.
   * @param {string} id - The Spotify ID for the show.
   * @returns {Promise<Show|HTTPError|ApiError>}
   */
  get(id) {
    const path = 'https://api.spotify.com/v1/shows/' + id;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const show = new Show(this.spotify, body);
                return resolve(show);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get Spotify catalog information about an show’s episodes.
   * @param {string} id - The Spotify ID for the show.
   * @param {LimitOptions} options
   * @returns {Promise<Episode[]|HTTPError|ApiError>}
   */
  episodes(id, { limit = 20, offset = 0 } = {}) {
    const options = qs.stringify({
      limit,
      offset,
    });

    /* prettier-ignore */
    const path = 'https://api.spotify.com/v1/shows/' + id + '/episodes?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const episodes = body.items.map(
                  (e) => new Episode(this.spotify, e)
                );
                return resolve(episodes);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get a list of shows saved in the current Spotify user's library.
   * @param {LimitOptions} options
   * @returns {Promise<Show[]|HTTPError|ApiError>}
   */
  users({ limit = 20, offset = 0 } = {}) {
    const options = qs.stringify({
      limit,
      offset,
    });

    const path = API + '?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const shows = body.items.map(
                  (s) => new Episode(this.spotify, s)
                );
                return resolve(shows);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Save one or more shows to current Spotify user's library.
   * @param {string|string[]} ids - A list of the Spotify IDs.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  save(ids) {
    const options = qs.stringify({
      ids: typeof ids == 'string' ? [ids] : ids.join(','),
    });

    const path = API + '?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'put',
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 200) {
              resolve({ status: response.status });
            } else if (body) {
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Delete one or more shows from current Spotify user's library.
   * @param {string|string[]} ids - A list of the Spotify IDs.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  remove(ids) {
    const options = qs.stringify({
      ids: typeof ids == 'string' ? [ids] : ids.join(','),
    });

    const path = API + '?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'delete',
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 200) {
              resolve({ status: response.status });
            } else if (body) {
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Check if one or more shows is already saved in the current Spotify user's library.
   * @param {string|string[]} ids - A list of the Spotify IDs.
   * @returns {Promise<boolean|boolean[]|HTTPError|ApiError>}
   */
  starred(ids) {
    const options = qs.stringify({
      ids: typeof ids == 'string' ? [ids] : ids.join(','),
    });

    const path = API + '/contains?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                if (body.length == 1) {
                  resolve(body[0]);
                }
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get Spotify catalog information about shows.
   * @param {string} query - Your search query.
   * @param {SearchOptions} options
   * @returns {Promise<Show[]|HTTPError|ApiError>}
   */
  search(query, { external = false, limit = 20, offset = 0 } = {}) {
    const opts = {
      q: query,
      type: 'show',
      limit,
      offset,
    };

    if (external) {
      opts['include_external'] = 'audio';
    }

    const options = qs.stringify(opts);
    const path = 'https://api.spotify.com/v1/search?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const shows = body.shows.items.map(
                  (p) => new Show(this.spotify, p)
                );
                return resolve(shows);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }
}

module.exports = ShowManager;
