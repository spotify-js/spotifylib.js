const qs = require('querystring');
const Episode = require('../structures/Episode.js');

const API = 'https://api.spotify.com/v1/me/episodes';
const HTTPError = require('../HTTPError.js');
const ApiError = require('../ApiError.js');

class EpisodeManager {
  /**
   * Manages spotify episodes.
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
   * Get Spotify catalog information for a single episode identified by its unique Spotify ID.
   * @param {string} id - The Spotify ID for the episode.
   * @returns {Promise<Episode|HTTPError|ApiError>}
   */
  get(id) {
    const path = 'https://api.spotify.com/v1/episodes/' + id;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const episode = new Episode(this.spotify, body);
                return resolve(episode);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get a list of the episodes saved in the current Spotify user's library.
   * @param {LimitOptions} options
   * @returns {Promise<Episode[]|HTTPError|ApiError>}
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
                const episodes = body.items.map(
                  (t) => new Episode(this.spotify, t)
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
   * Save one or more episodes to the current user's library.
   * @param {string|string[]} ids - A  list of the Spotify IDs.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  save(ids) {
    const options = qs.stringify({
      ids: Array.isArray(ids) ? ids.join(',') : ids,
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
   * Remove one or more episodes from the current user's library.
   * @param {string|string[]} ids - A  list of the Spotify IDs.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  remove(ids) {
    const options = qs.stringify({
      ids: Array.isArray(ids) ? ids.join(',') : ids,
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
   * Check if one or more episodes is already saved in the current Spotify user's 'Your Episodes' library.
   * @param {string|string[]} ids - A list of the Spotify IDs for the episodes.
   * @returns {Promise<boolean[]|HTTPError|ApiError>}
   */
  starred(ids) {
    const options = qs.stringify({
      ids: Array.isArray(ids) ? ids.join(',') : ids,
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
                return resolve(body);
              }
              reject(new ApiError(response));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get Spotify catalog information about episodes.
   * @param {string} query - Your search query.
   * @param {SearchOptions} options
   * @returns {Promise<Episode[]|HTTPError|ApiError>}
   */
  search(query, { external = false, limit = 20, offset = 0 } = {}) {
    const opts = {
      q: query,
      type: 'episode',
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
                const episodes = body.episodes.items.map(
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
}

module.exports = EpisodeManager;
