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

  /**
   * Shortcut to follow the user.
   * @returns {Promise}
   */
  follow() {
    return this.spotify.users.follow(this.id);
  }

  /**
   * Shortcut to unfollow the user.
   * @returns {Promise}
   */
  unfollow() {
    return this.spotify.users.unfollow(this.id);
  }

  /**
   * Shortcut to check if the current user is following the user.
   * @returns {Promise}
   */
  following() {
    return this.spotify.users.following(this.id);
  }
}

module.exports = User;
