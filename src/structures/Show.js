const Base = require('../Base.js');

class Show extends Base {
  /**
   * Represents the show.
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
   * Shortcut to play the show.
   * @param {StartOptions} options
   */
  play(options = {}) {
    return this.spotify.player.start(this.uri, options);
  }

  /**
   * Shortcut to save the show.
   * @returns {Promise}
   */
  save() {
    return this.spotify.shows.save(this.id);
  }

  /**
   * Shortcut to remove the show.
   * @returns {Promise}
   */
  remove() {
    return this.spotify.shows.remove(this.id);
  }
}

module.exports = Show;
