const qs = require('querystring');
const Show = require('../structures/Show.js');
const Episode = require('../structures/Episode.js');

const API = 'https://api.spotify.com/v1/me/shows';

class ShowManager {
  /**
   * Manages spotify playing.
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
   * Get Spotify catalog information for a single show identified by its unique Spotify ID.
   * @param {string} id - The Spotify ID for the show.
   * @returns {Promise}
   */
  get(id) {
    const path = 'https://api.spotify.com/v1/shows/' + id;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) =>
            response.json().then((body) => new Show(this.spotify, body))
          )
      );
    });
  }

  /**
   * Get Spotify catalog information about an show’s episodes.
   * @param {string} id - The Spotify ID for the show.
   * @param {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
   * @param {number} [offset=0] - The index of the first item to return.
   * @returns {Promise}
   */
  episodes(id, limit = 20, offset = 0) {
    const options = qs.stringify({
      limit,
      offset,
    });

    /* prettier-ignore */
    const path = 'https://api.spotify.com/v1/shows/' + id + '/episodes?' + options;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) =>
            response.json().then((body) => {
              let b = body;

              if (b.items) {
                const episodes = body.items.map(
                  (e) => new Episode(this.spotify, e)
                );
                b['items'] = episodes;
              }

              return b;
            })
          )
      );
    });
  }

  /**
   * Get a list of shows saved in the current Spotify user's library.
   * @param {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
   * @param {number} [offset=0] - The index of the first item to return. Use with limit to get the next set of items.
   * @returns {Promise}
   */
  users(limit = 20, offset = 0) {
    const options = qs.stringify({
      limit,
      offset,
    });

    const path = API + '?' + options;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) =>
            response.json().then((body) => {
              let b = body;

              if (b.items) {
                const shows = body.items.map(
                  (s) => new Episode(this.spotify, s)
                );
                b['items'] = shows;
              }

              return b;
            })
          )
      );
    });
  }

  /**
   * Save one or more shows to current Spotify user's library.
   * @param {string|string[]} ids - A list of the Spotify IDs.
   * @returns {Promise}
   */
  save(ids) {
    const options = qs.stringify({
      ids: typeof ids == 'string' ? [ids] : ids.join(','),
    });

    const path = API + '?' + options;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
            method: 'put',
          })
          .then((response) => Object({ status: response.status }))
      );
    });
  }

  /**
   * Delete one or more shows from current Spotify user's library.
   * @param {string|string[]} ids - A list of the Spotify IDs.
   * @returns {Promise}
   */
  remove(ids) {
    const options = qs.stringify({
      ids: typeof ids == 'string' ? [ids] : ids.join(','),
    });

    const path = API + '?' + options;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
            method: 'delete',
          })
          .then((response) => Object({ status: response.status }))
      );
    });
  }

  /**
   * Check if one or more shows is already saved in the current Spotify user's library.
   * @param {string|string[]} ids - A list of the Spotify IDs.
   * @returns {Promise<boolean|boolean[]>}
   */
  favorited(ids) {
    const options = qs.stringify({
      ids: typeof ids == 'string' ? [ids] : ids.join(','),
    });

    const path = API + '/contains?' + options;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) => response.json())
      );
    });
  }
}

module.exports = ShowManager;
