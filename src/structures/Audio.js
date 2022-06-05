const Base = require('../Base.js');

class Audio extends Base {
  /**
   * Represents the a track's audio.
   * @param {Spotify} spotify - The spotify client.
   * @param {object} data - The track's audio object data.
   * @extends {Base}
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
   * Shortcut to the track's audio features.
   * @returns {Promise<Audio>}
   */
  features() {
    return this.spotify.tracks.audio.features(this.id);
  }

  /**
   * Shortcut to the track's audio analysis.
   * @returns {Promise<Audio>}
   */
  analysis() {
    return this.spotify.tracks.audio.analysis(this.id);
  }
}

module.exports = Audio;
