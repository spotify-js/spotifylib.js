const qs = require('querystring');

const API = 'https://api.spotify.com/v1';

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
   * @param {string} [country] - An ISO 3166-1 alpha-2 country code.
   * @param {string} [locale] - The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX.
   * @returns {Promise}
   */
  get(id, country, locale) {
    const opts = {};

    if (country) opts['country'] = country;
    if (locale) opts['locale'] = locale;

    const options = qs.stringify(opts);
    const path = API + '/browse/categories/' + id + '?' + options;

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
   * Get a list of categories used to tag items in Spotify.
   * @param {string} [country] - An ISO 3166-1 alpha-2 country code.
   * @param {string} [locale] - The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX.
   * @param {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
   * @param {number} [offset=0] - The index of the first item to return.
   * @returns {Promise}
   */
  all(country, locale, limit = 20, offset = 0) {
    const opts = {
      limit,
      offset,
    };

    if (country) opts['country'] = country;
    if (locale) opts['locale'] = locale;

    const options = qs.stringify(opts);
    const path = API + '/browse/categories?' + options;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) =>
            response.json().then((body) => {
              if (body.categories) {
                const categories = body.categories.items;
                return categories;
              }

              return body;
            })
          )
      );
    });
  }
}

module.exports = CategoryManager;