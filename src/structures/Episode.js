const Base = require('../Base.js');

class Episode extends Base {
  /**
   * Represents the episode.
   * @param {Spotify} spotify - The spotify client.
   * @param {object} data - The episode object data.
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
   * Shortcut to save the episode.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  save() {
    return this.spotify.episodes.save(this.id);
  }

  /**
   * Shortcut to remove the episode.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  remove() {
    return this.spotify.episodes.remove(this.id);
  }

  /**
   * Shortcut to check if a episodes saved in the current Spotify user's library.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  starred() {
    return this.spotify.episodes.starred(this.id);
  }

  /**
   * Shortcut to queue an episode.
   * @param {string} device - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  queue(device) {
    return this.spotify.player.queue(this.uri, device);
  }
}

module.exports = Episode;
