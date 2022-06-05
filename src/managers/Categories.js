const qs = require('querystring');

const API = 'https://api.spotify.com/v1';
const HTTPError = require('../HTTPError.js');
const ApiError = require('../ApiError.js');

class CategoryManager {
  /**
   * Manages spotify categories.
   * @param {Spotify} Spotify - The spotify client.
   */
  constructor(spotify) {
    /**
     * The spotify client.
     * @type {Spotify}
     */
    this.spotify = spotify;
  }

  /**
   * Get a single category used to tag items in Spotify.
   * @param {string} id - The Spotify category ID for the category.
   * @param {string} country - An ISO 3166-1 alpha-2 country code.
   * @param {string} [locale] - The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX.
   * @returns {Promise<Category>}
   */
  get(id, country, locale) {
    const opts = {};

    if (country) opts['country'] = country;
    if (locale) opts['locale'] = locale;

    const options = qs.stringify(opts);
    const path = API + '/browse/categories/' + id + '?' + options;

    return new Promise((resolve) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response, reject) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                resolve(body);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get a list of categories used to tag items in Spotify.
   * @param {CategoryOptions} options
   * @returns {Promise<Category[]>}
   */
  all({ country, locale, limit = 20, offset = 0 } = {}) {
    const opts = {
      limit,
      offset,
    };

    if (country) opts['country'] = country;
    if (locale) opts['locale'] = locale;

    const options = qs.stringify(opts);
    const path = API + '/browse/categories?' + options;

    return new Promise((resolve) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response, reject) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const categories = body.categories.items;
                resolve(categories);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }
}

module.exports = CategoryManager;

/**
 * @typedef {Object} CategoryOptions
 * @property {string} [country] - An ISO 3166-1 alpha-2 country code.
 * @property {string} [locale] - The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX.
 * @property {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
 * @property {number} [offset=0] - The index of the first item to return.
 */
