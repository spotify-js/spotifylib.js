const qs = require('querystring');
const Artist = require('../structures/Artist.js');
const Track = require('../structures/Track.js');

const API = 'https://api.spotify.com/v1/artists';

class ArtistManager {
  /**
   * Manages spotify artist.
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
   * Get Spotify catalog information for a single artist identified by their unique Spotify ID.
   * @param {string} id - The Spotify ID of the artist.
   * @returns {Promise<Artist>}
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
                return new Artist(this.spotify, body);
              }

              return body;
            })
          )
      );
    });
  }

  /**
   * Get Spotify catalog information about an artist's albums.
   * @param {string} id - The Spotify ID of the artist.
   * @param {ArtistAlbumsOptions} options
   * @returns {Promise<Album[]>}
   */
  /* prettier-ignore */
  albums(id, {
    groups = ['album', 'single', 'appears_on', 'compilation'],
    limit = 20,
    offset = 0,
  } = {}) {
    const options = qs.stringify({
      include_groups: typeof groups == 'string' ? [groups] : groups.join(','),
      limit,
      offset,
    });

    const path = API + '/' + id + '/albums?' + options;

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
                  (a) => new Artist(this.spotify, a)
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
   * Get Spotify catalog information about an artist's top tracks by country.
   * @param {string} id - The Spotify ID of the artist.
   * @param {string} country - An ISO 3166-1 alpha-2 country code.
   * @returns {Promise<Track[]>}
   */
  top(id, country) {
    const options = qs.stringify({
      country,
    });

    const path = API + '/' + id + '/top-tracks?' + options;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) =>
            response.json().then((body) => {
              if (body.tracks) {
                const tracks = body.tracks.map(
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
   * Get Spotify catalog information about artists similar to a given artist.
   * @param {string} id - The Spotify ID of the artist.
   * @returns {Promise<Artist[]>}
   */
  related(id) {
    const path = API + '/' + id + '/related-artists';

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) =>
            response.json().then((body) => {
              if (body.artists) {
                const artists = body.artists.map(
                  (a) => new Artist(this.spotify, a)
                );

                return artists;
              }

              return body;
            })
          )
      );
    });
  }

  /**
   * Get Spotify catalog information about artists.
   * @param {string} query - Your search query.
   * @param {SearchOptions} options
   * @returns {Promise<Artist[]>}
   */
  search(query, { external = false, limit = 20, offset = 0 } = {}) {
    const opts = {
      q: query,
      type: 'artist',
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
              if (body.artists) {
                const artists = body.artists.items.map(
                  (a) => new Artist(this.spotify, a)
                );

                return artists;
              }

              return body;
            })
          )
      );
    });
  }
}

module.exports = ArtistManager;

/**
 * The list of groups for an album by default all are supplied.
 * - album
 * - single
 * - appears_on
 * - compilation
 * @typedef {string} AlbumGroups
 */

/**
 * @typedef {Object} ArtistAlbumsOptions
 * @param {AlbumGroups[]} [groups] - A list of keywords that will be used to filter the response.
 * @param {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
 * @param {number} [offset=0] - The index of the first item to return. Use with limit to get the next set of items.
 */
