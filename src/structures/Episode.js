const Base = require('../Base.js');

class Episode extends Base {
  /**
   * Represents the episode.
   * @param {Spotify} spotify - The spotify client.
   * @param {object} data - The episode object data.
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
   * Shortcut to save the episode.
   * @returns {Promise}
   */
  save() {
    return this.spotify.episodes.save(this.id);
  }

  /**
   * Shortcut to remove the episode.
   * @returns {Promise}
   */
  remove() {
    return this.spotify.episodes.remove(this.id);
  }
}

module.exports = Episode;
