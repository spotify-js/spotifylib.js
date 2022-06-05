const Base = require('../Base.js');
const Episode = require('./Episode.js');

class Show extends Base {
  /**
   * Represents the show.
   * @param {Spotify} spotify - The spotify client.
   * @param {object} data - The show object data.
   * @extends {Base}
   */
  constructor(spotify, data) {
    super(data);

    /**
     * The episdoes of the show.
     * @type {Show[]|undefined}
     */
    if (data.episodes && data.episodes.items) {
      this.episodes = data.episodes.items.map((e) => new Episode(spotify, e));
    }

    /**
     * The spotify client.
     * @type {Spotify}
     */
    this.spotify = spotify;
  }

  /**
   * Shortcut to play the show.
   * @param {StartOptions} options
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  play(options = {}) {
    return this.spotify.player.start(this.uri, options);
  }

  /**
   * Shortcut to save the show.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  save() {
    return this.spotify.shows.save(this.id);
  }

  /**
   * Shortcut to remove the show.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  remove() {
    return this.spotify.shows.remove(this.id);
  }

  /**
   * Shortcut to check if a shows saved in the current Spotify user's library.
   * @returns {Promise<boolean[]|HTTPError|ApiError>}
   */
  starred() {
    return this.spotify.tracks.starred(this.id);
  }
}

module.exports = Show;
