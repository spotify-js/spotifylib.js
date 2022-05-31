const qs = require('querystring');
const Album = require('../structures/Album.js');
const Track = require('../structures/Track.js');

const API = 'https://api.spotify.com/v1/albums';

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
   * @returns {Promise<Album>}
   */
  get(id) {
    const path = API + '/' + id;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) =>
            response.json().then((body) => {
              if (response.status == 200) {
                return new Album(this.spotify, body);
              }

              return body;
            })
          )
      );
    });
  }

  /**
   * Get Spotify catalog information about an album’s tracks.
   * @param {string} id - The Spotify ID of the album.
   * @param {LimitOptions} options
   * @returns {Promise<Track[]>}
   */
  tracks(id, { limit = 20, offset = 0 } = {}) {
    const options = qs.stringify({
      limit,
      offset,
    });

    const path = API + '/' + id + '/tracks?' + options;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) =>
            response.json().then((body) => {
              if (body.items) {
                const tracks = body.items.map(
                  (t) => new Track(this.spotify, t)
                );

                return tracks;
              }

              return body;
            })
          )
      );
    });
  }

  /**
   * Get a list of the albums saved in the current Spotify user's 'Your Music' library.
   * @param {LimitOptions} options
   * @returns {Promise<Album[]>}
   */
  saved({ limit = 20, offset = 0 } = {}) {
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
              if (body.items) {
                const albums = body.items.map(
                  (a) => new Album(this.spotify, a)
                );

                return albums;
              }

              return body;
            })
          )
      );
    });
  }

  /**
   * Save one or more albums to the current user's 'Your Music' library.
   * @param {string|string[]} ids - A list of the Spotify IDs for the albums.
   * @returns {Promise}
   */
  save(ids) {
    const options = qs.stringify({
      ids: typeof ids == 'string' ? [ids] : ids.join(','),
    });

    const path = 'https://api.spotify.com/v1/me/albums?' + options;

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
   * Remove one or more albums to the current user's 'Your Music' library.
   * @param {string|string[]} ids - A list of the Spotify IDs for the albums.
   * @returns {Promise}
   */
  remove(ids) {
    const options = qs.stringify({
      ids: typeof ids == 'string' ? [ids] : ids.join(','),
    });

    const path = 'https://api.spotify.com/v1/me/albums?' + options;

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
   * Check if one or more albums is already saved in the current Spotify user's 'Your Music' library.
   * @param {string} ids - A list of the Spotify IDs for the albums.
   * @returns {Promise<boolean|boolean[]>}
   */
  starred(ids) {
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
          .then((response) =>
            response.json().then((body) => {
              if (Array.isArray(body) && body.length == 0) {
                return body[0];
              }

              return body;
            })
          )
      );
    });
  }

  /**
   * Get a list of new album releases featured in Spotify.
   * @param {LimitOptions} options
   * @returns {Promise<Album[]>}
   */
  releases({ limit = 20, offset = 0 } = {}) {
    const options = qs.stringify({
      limit,
      offset,
    });

    const path = 'https://api.spotify.com/v1/browse/new-releases?' + options;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) =>
            response.json().then((body) => {
              if (body.albums.items) {
                const albums = body.albums.items.map(
                  (a) => new Album(this.spotify, a)
                );

                return albums;
              }

              return body;
            })
          )
      );
    });
  }

  /**
   * Get Spotify catalog information about albums.
   * @param {string} query - Your search query.
   * @param {SearchOptions} options
   * @returns {Promise<Album[]>}
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

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) =>
            response.json().then((body) => {
              if (body.albums) {
                const albums = body.albums.items.map(
                  (a) => new Album(this.spotify, a)
                );

                return albums;
              }

              return body;
            })
          )
      );
    });
  }
}

module.exports = AlbumManager;
