const qs = require('querystring');
const Album = require('../structures/Album.js');
const Track = require('../structures/Track.js');

const API = 'https://api.spotify.com/v1/albums';
const HTTPError = require('../HTTPError.js');
const ApiError = require('../ApiError.js');

class AlbumManager {
  /**
   * Manages spotify albums.
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
   * Get Spotify catalog information for a single album.
   * @param {string} id - The Spotify ID of the album.
   * @returns {Promise<Album|HTTPError|ApiError>}
   */
  get(id) {
    const path = API + '/' + id;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const album = new Album(this.spotify, body);
                return resolve(album);
              }
              reject(new ApiError(response));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get Spotify catalog information about an album’s tracks.
   * @param {string} id - The Spotify ID of the album.
   * @param {LimitOptions} options
   * @returns {Promise<Track[]|HTTPError|ApiError>}
   */
  tracks(id, { limit = 20, offset = 0 } = {}) {
    const options = qs.stringify({
      limit,
      offset,
    });

    const path = API + '/' + id + '/tracks?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const tracks = body.items.map(
                  (t) => new Track(this.spotify, t)
                );
                return resolve(tracks);
              }
              reject(new ApiError(response));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get a list of the albums saved in the current Spotify user's 'Your Music' library.
   * @param {LimitOptions} options
   * @returns {Promise<Album[]|HTTPError|ApiError>}
   */
  saved({ limit = 20, offset = 0 } = {}) {
    const options = qs.stringify({
      limit,
      offset,
    });

    const path = 'https://api.spotify.com/v1/me/albums?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const albums = body.items.map(
                  (a) => new Album(this.spotify, a)
                );
                return resolve(albums);
              }
              reject(new ApiError(response));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Save one or more albums to the current user's 'Your Music' library.
   * @param {string|string[]} ids - A list of the Spotify IDs for the albums.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  save(ids) {
    const options = qs.stringify({
      ids: Array.isArray(ids) ? ids.join(',') : ids,
    });

    const path = 'https://api.spotify.com/v1/me/albums?' + options;

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
   * Remove one or more albums to the current user's 'Your Music' library.
   * @param {string|string[]} ids - A list of the Spotify IDs for the albums.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  remove(ids) {
    const options = qs.stringify({
      ids: Array.isArray(ids) ? ids.join(',') : ids,
    });

    const path = 'https://api.spotify.com/v1/me/albums?' + options;

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
   * Check if one or more albums is already saved in the current Spotify user's 'Your Music' library.
   * @param {string} ids - A list of the Spotify IDs for the albums.
   * @returns {Promise<boolean[]|HTTPError|ApiError>}
   */
  starred(ids) {
    const options = qs.stringify({
      ids: Array.isArray(ids) ? ids.join(',') : ids,
    });

    const path = 'https://api.spotify.com/v1/me/albums/contains?' + options;

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
   * Get a list of new album releases featured in Spotify.
   * @param {LimitOptions} options
   * @returns {Promise<Album[]|HTTPError|ApiError>}
   */
  releases({ limit = 20, offset = 0 } = {}) {
    const options = qs.stringify({
      limit,
      offset,
    });

    const path = 'https://api.spotify.com/v1/browse/new-releases?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const albums = body.albums.items.map(
                  (a) => new Album(this.spotify, a)
                );
                return resolve(albums);
              }
              reject(new ApiError(response));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get Spotify catalog information about albums.
   * @param {string} query - Your search query.
   * @param {SearchOptions} options
   * @returns {Promise<Album[]|HTTPError|ApiError>}
   */
  search(query, { external = false, limit = 20, offset = 0 } = {}) {
    const opts = {
      q: query,
      type: 'album',
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
                const albums = body.albums.items.map(
                  (a) => new Album(this.spotify, a)
                );
                return resolve(albums);
              }
              reject(new ApiError(response));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }
}

module.exports = AlbumManager;
