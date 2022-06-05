const qs = require('querystring');
const Artist = require('../structures/Artist.js');
const Track = require('../structures/Track.js');
const User = require('../structures/User.js');

const API = 'https://api.spotify.com/v1/me';

class UserManager {
  /**
   * Manages spotify users.
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
   * Get public profile information about a Spotify user.
   * @param {string} id - The Spotify ID for the user.
   * @returns {Promise<User>}
   */
  get(id) {
    const path = 'https://api.spotify.com/v1/users/' + id;

    return new Promise((resolve) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const user = new User(this.spotify, body);
                resolve(user);
              }
              resolve(body);
            }
            resolve({ status: response.status });
          });
        });
    });
  }

  /**
   * Get the current user's top artists or tracks based on calculated affinity.
   * @param {string} type - The type of entity to return. Valid values: artists or tracks
   * @param {UserTopOptions} options
   * @returns {Promise<Artist[]|Track[]>}
   */
  top(type, { limit = 20, offset = 20, range = 'medium' } = {}) {
    const options = qs.stringify({
      time_range: range + '_term',
      limit,
      offset,
    });

    const path = API + '/top/' + type + '?' + options;

    return new Promise((resolve) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                let result;

                if (type == 'artists') {
                  result = body.items.map((a) => new Artist(this.spotify, a));
                } else {
                  result = body.items.map((t) => new Track(this.spotify, t));
                }

                resolve(result);
              }
              resolve(body);
            }
            resolve({ status: response.status });
          });
        });
    });
  }

  /**
   * Get the current user's followed artists.
   * @param {FollowingArtistOptions} options
   * @returns {Artist[]}
   */
  following({ after, limit = 20 } = {}) {
    const opts = {
      type: 'artist',
      limit,
    };

    if (after) {
      opts['after'] = after;
    }

    const options = qs.stringify(opts);
    const path = API + '/following?' + options;

    return new Promise((resolve) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            console.log(body);
            if (body) {
              if (response.status == 200) {
                const artists = body.artists.items.map(
                  (a) => new Artist(this.spotify, a)
                );
                resolve(artists);
              }
              resolve(body);
            }
            resolve({ status: response.status });
          });
        });
    });
  }

  /**
   * Get detailed profile information about the current user (including the current user's username).
   * @returns {Promise<User>}
   */
  me() {
    return new Promise((resolve) => {
      this.spotify.util
        .fetch({
          path: API,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const user = new User(this.spotify, body);
                resolve(user);
              }
              resolve(body);
            }
            resolve({ status: response.status });
          });
        });
    });
  }
}

module.exports = UserManager;

/**
 * @typedef {Object} UserTopOptions
 * @property {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
 * @property {number} [offset=0] - The index of the first item to return. Use with limit to get the next set of items.
 * @property {TimeRange} [range='medium'] - Over what time frame the affinities are computed.
 */

/**
 * @typedef {Object} FollowingArtistOptions
 * @property {string} [after] - The last artist ID retrieved from the previous request.
 * @property {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
 */

/**
 * short - Approximately last 4 weeks
 * medium - Approximately last 6 months
 * long - Calculated from serveral years of data.
 * @typedef {string} TimeRange
 */
