const qs = require('querystring');
const Track = require('../structures/Track.js');
const Audio = require('../managers/Audio.js');

const API = 'https://api.spotify.com/v1/me/tracks';

class TrackManager {
  /**
   * Manages spotify tracks.
   * @param {Spotify} Spotify - The spotify client.
   */
  constructor(Spotify) {
    /**
     * The spotify client.
     * @type {Spotify}
     */
    this.spotify = Spotify;

    /**
     * The audio features.
     * @type {Audio}
     */
    this.audio = new Audio(Spotify);
  }

  /**
   * Get Spotify catalog information for a single track identified by its unique Spotify ID.
   * @param {string} id - The Spotify ID for the track.
   * @returns {Promise<Track>}
   */
  get(id) {
    const path = 'https://api.spotify.com/v1/tracks/' + id;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) =>
            response.json().then((body) => new Track(this.spotify, body))
          )
      );
    });
  }

  /**
   * Get a list of the songs saved in the current Spotify user's 'Your Music' library.
   * @param {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
   * @param {number} [offset=0] - The index of the first item to return. Use with limit to get the next set of items.
   * @returns {Promise}
   */
  saved(limit = 20, offset = 0) {
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

              const tracks = body.items.map((t) => new Track(t));
              b['items'] = tracks;

              return b;
            })
          )
      );
    });
  }

  /**
   * Save one or more tracks to the current user's 'Your Music' library.
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
   * Remove one or more tracks from the current user's 'Your Music' library.
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
   * Check if one or more tracks is already saved in the current Spotify user's 'Your Music' library.
   * @param {string|string[]} ids
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

  /**
   * @param {RecommendedOptions} options
   *
   */
  recommendations({
    seeds = {},
    max = {},
    min = {},
    target = {},
    limit = 20,
  } = {}) {
    const attributes = [
      'acousticness',
      'danceability',
      'duration_ms',
      'energy',
      'instrumentalness',
      'key',
      'liveness',
      'loudness',
      'mode',
      'popularity',
      'speachiness',
      'temp',
      'time_signature',
      'valence',
    ];

    const { artists = [], genres = [], tracks = [] } = seeds;

    const opts = {
      seed_artists: artists,
      seed_genres: genres,
      seed_tracks: tracks,
      limit,
    };

    const structures = [max, min, target];
    structures.forEach((struct, index) => {
      attributes.forEach((attribute) => {
        const types = ['max', 'min', 'target'];
        const key = types[index] + '_' + attribute;

        if (struct[attribute]) {
          opts[key] = struct[attribute];
        }
      });
    });

    const options = qs.stringify(opts);
    const path = 'https://api.spotify.com/v1/recommendations?' + options;

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

module.exports = TrackManager;

/**
 * @typedef {Object} RecommendedOptions
 * @property {SeedOptions} seeds - Recommendations based on the seed options.
 * @property {Attributes} max - The maximum values of for the attributes.
 * @property {Attributes} min - The minimum values of for the attributes.
 * @property {Attributes} target - The target values of for the attributes.
 * @property {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
 */

/**
 * @typedef {Object} SeedOptions
 * @property {string[]} artists - A list of Spotify IDs for seed artists.
 * @property {string[]} genres - A list of any genres in the set of available genre seeds.
 * @property {string[]} tracks - A list of Spotify IDs for a seed track.
 */

/**
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recommendations
 * @typedef {Object} Attributes
 * @property {number} acousticness - \>= 0 <= 1
 * @property {number} danceability - \>= 0 <= 1
 * @property {number} duration_ms
 * @property {number} energy - \>= 0 <= 1
 * @property {number} instrumentalness - \>= 0 <= 1
 * @property {number} key - \>= 0 <= 11
 * @property {number} liveness - \>= 0 <= 1
 * @property {number} loudness
 * @property {number} mode - \>= 0 <= 1
 * @property {number} popularity - \>= 0 <= 100
 * @property {number} speachiness - \>= 0 <= 1
 * @property {number} temp
 * @property {number} time_signature
 * @property {number} valence
 */
