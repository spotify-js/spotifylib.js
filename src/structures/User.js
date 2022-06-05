const Base = require('../Base.js');

class User extends Base {
  /**
   * Represents a user.
   * @param {Spotify} spotify - The spotify client.
   * @param {object} data - The user object data.
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
}

module.exports = User;
