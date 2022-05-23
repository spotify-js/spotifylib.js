const Base = require('../Base.js');

class Audio extends Base {
  /**
   * Represents the a track audio.
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
  }

  /**
   * Shortcut to the tracks audio features.
   * @returns {Promise}
   */
  features() {
    return this.spotify.tracks.audio.features(this.id);
  }

  /**
   * Shortcut to the tracks audio analysis.
   * @returns {Promise}
   */
  analysis() {
    return this.spotify.tracks.audio.analysis(this.id);
  }
}

module.exports = Audio;
