const Util = require('./Util.js');

const PlayerManager = require('./managers/Player.js');
const TrackManager = require('./managers/Track.js');
const PlaylistManager = require('./managers/Playlist.js');
const EpisodeManager = require('./managers/Episode.js');
const ShowManager = require('./managers/Show.js');
const AlbumManager = require('./managers/Album.js');

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
