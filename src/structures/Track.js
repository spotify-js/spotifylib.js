const Base = require('../Base.js');
const Audio = require('./Audio.js');

class Track extends Base {
  /**
   * Represents the track.
   * @param {Spotify} spotify - The spotify client.
   * @param {object} data - The track object data.
   */
  constructor(spotify, data) {
    super(data);

    /**
     * The spotify client.
     * @type {Spotify}
     */
    this.spotify = spotify;

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
}

module.exports = Track;
