const Util = require('./Util.js');

const PlayerManager = require('./managers/Player.js');
const TrackManager = require('./managers/Track.js');
const PlaylistManager = require('./managers/Playlist.js');
const EpisodeManager = require('./managers/Episode.js');
const ShowManager = require('./managers/Show.js');
const AlbumManager = require('./managers/Album.js');
const ArtistManager = require('./managers/Artist.js');
const CategoryManager = require('./managers/Categories.js');
const UserManager = require('./managers/User.js');

class Spotify {
  /**
   * Spotify Client.
   * @param {string} access_token - The client's access token.
   */
  constructor(access_token) {
    /**
     * The client's access token.
     * @type {string}
     */
    this.access_token = access_token;

    /**
     * The util for the spotify client.
     * @type {Util}
     */
    this.util = new Util(this);

    /**
     * The Player Manager.
     * @type {PlayerManager}
     */
    this.player = new PlayerManager(this);

    /**
     * The Track Manager.
     * @type {TrackManager}
     */
    this.tracks = new TrackManager(this);

    /**
     * The Playlist Manager.
     * @type {PlaylistManager}
     */
    this.playlists = new PlaylistManager(this);

    /**
     * The Episode Manager.
     * @type {ShowManager}
     */
    this.episodes = new EpisodeManager(this);

    /**
     * The Show Manager.
     * @type {ShowManager}
     */
    this.shows = new ShowManager(this);

    /**
     * The Album Manager.
     * @type {AlbumManager}
     */
    this.albums = new AlbumManager(this);

    /**
     * The Artist Manager.
     * @type {ArtistManager}
     */
    this.artists = new ArtistManager(this);

    /**
     * The Category Manager.
     * @type {CategoryManager}
     */
    this.categories = new CategoryManager(this);

    /**
     * The User Manager.
     * @type {UserManager}
     */
    this.users = new UserManager(this);

    /**
     * The Refresher from node module 'spotify-oauth2'
     * @type {Refresher|null}
     */
    this.refresher = null;
  }

  /**
   * Retrieve a list of available genres seed
   * @returns {Promise<string[]>}
   */
  genres() {
    /* prettier-ignore */
    const path = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';

    return new Promise((resolve) => {
      this.util
        .fetch({
          path,
        })
        .then((response) => {
          this.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const genres = body.genres;
                resolve(genres);
              }
              resolve(body);
            }
            resolve({ status: response.status });
          });
        });
    });
  }

  /**
   * Get the list of markets where Spotify is available.
   * @returns {Promise<string[]>}
   */
  markets() {
    const path = 'https://api.spotify.com/v1/markets ';

    return new Promise((resolve) => {
      this.util
        .fetch({
          path,
        })
        .then((response) => {
          this.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const markets = body.markets;
                resolve(markets);
              }
              resolve(body);
            }
            resolve({ status: response.status });
          });
        });
    });
  }

  /**
   * Set a property of the spotify client.
   * @param {string} key - The key of spotify to set.
   * @param {string} value - The value to set to.
   * @returns {void}
   */
  set(key, value) {
    if (!(key in this)) {
      throw new Error(`${key} is not a key of Spotify.`);
    }

    this[key] = value;
  }
}

module.exports = Spotify;

/**
 * Track, album, artist joined with their id by a colon. eg: spotify:album:5ht7ItJgpBH7W6vJ5BqpPr
 * @typedef {string} ContextURI
 */

/**
 * @typedef {Object} LimitOptions
 * @property {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
 * @property {number} [offset=0] - The index of the first item to return. Use with limit to get the next set of items.
 */

/**
 * @typedef {Object} SearchOptions
 * @property {boolean} [external=false] - If the client can play externally hosted audio content, and marks the content as playable in the response.
 * @param {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
 * @param {number} [offset=0] - The index of the first item to return. Use with limit to get the next set of items.
 */
