const Base = require('../Base.js');
const Album = require('./Album.js');
const Audio = require('./Audio.js');

class Track extends Base {
  /**
   * Represents the track.
   * @param {Spotify} spotify - The spotify client.
   * @param {object} data - The track object data.
   * @extends {Base}
   */
  constructor(spotify, data) {
    super(data);

    /**
     * The spotify client.
     * @type {Spotify}
     */
    this.spotify = spotify;

    /**
     * The album of the track.
     * @type {Album|undefined}
     */
    if (data.album) {
      this.album = new Album(spotify, data.album);
    }

    /**
     * Shortcut to the tracks audio.
     * @type {Audio}
     */
    this.audio = new Audio(spotify, data);
  }

  /**
   * Shortcut to save the track.
   * @returns {Promise}
   */
  save() {
    return this.spotify.tracks.save(this.id);
  }

  /**
   * Shortcut to remove the track.
   * @returns {Promise}
   */
  remove() {
    return this.spotify.tracks.remove(this.id);
  }

  /**
   * Shortcut to check if a songs saved in the current Spotify user's 'Your Music' library.
   * @returns {Promise}
   */
  starred() {
    return this.spotify.tracks.starred(this.id);
  }

  /**
   * Shortcut to queue a track.
   * @param {string} device - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise}
   */
  queue(device) {
    return this.spotify.player.queue(this.uri, device);
  }
}

module.exports = Track;
