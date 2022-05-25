const qs = require('querystring');
const Episode = require('../structures/Episode.js');

const API = 'https://api.spotify.com/v1/me/episodes';

class EpisodeManager {
  /**
   * Manages spotify episodes.
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
   * Get Spotify catalog information for a single episode identified by its unique Spotify ID.
   * @param {string} id - The Spotify ID for the episode.
   * @returns {Promise<Episode>}
   */
  get(id) {
    const path = 'https://api.spotify.com/v1/episodes/' + id;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) =>
            response.json().then((body) => new Episode(this.spotify, body))
          )
      );
    });
  }

  /**
   * Get a list of the episodes saved in the current Spotify user's library.
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
              {
                let b = body;

                if (b.items) {
                  const episodes = body.items.map((t) => new Episode(t));
                  b['items'] = episodes;
                }

                return b;
              }
            })
          )
      );
    });
  }

  /**
   * Save one or more episodes to the current user's library.
   * @param {string|string[]} ids - A  list of the Spotify IDs.
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
   * Remove one or more episodes from the current user's library.
   * @param {string|string[]} ids - A  list of the Spotify IDs.
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
   * Check if one or more episodes is already saved in the current Spotify user's 'Your Episodes' library.
   * @param {string|string[]} ids - A list of the Spotify IDs for the episodes.
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

module.exports = EpisodeManager;
