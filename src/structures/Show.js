const Base = require('../Base.js');
const Episode = require('./Episode.js');

class Show extends Base {
  /**
   * Represents the show.
   * @param {Spotify} spotify - The spotify client.
   * @param {object} data - The track object data.
   */
  constructor(spotify, data) {
    super(data);

    /**
     * The episdoes of the show.
     * @type {Show[]}
     */
    this.episodes = data.episdoes.items.map((e) => new Episode(spotify, e));

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

  /**
   * Shortcut to check if a shows saved in the current Spotify user's library.
   * @returns {Promise}
   */
  favorited() {
    return this.spotify.tracks.favorited(this.id);
  }
}

module.exports = Show;
