const Base = require('../Base.js');

class Artist extends Base {
  /**
   * Represents the an artist.
   * @param {Spotify} spotify - The spotify client.
   * @param {object} data - The artist object data.
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
   * Shortcut to get the albums of an artist.
   * @param {ArtistAlbumsOptions} options
   * @returns {Promise<Album[]|HTTPError|ApiError>}
   */
  albums(options = {}) {
    return this.spotify.artists.albums(this.id, options);
  }

  /**
   * Shortcut to follow the artist.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  follow() {
    return this.spotify.artists.follow(this.id);
  }

  /**
   * Shortcut to unfollow the artist.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  unfollow() {
    return this.spotify.artists.unfollow(this.id);
  }

  /**
   * Shortcut to check if the current user is following the artist.
   * @returns {Promise<boolean[]|HTTPError|ApiError>}
   */
  following() {
    return this.spotify.artists.following(this.id);
  }

  /**
   * Shortcut to get the top tracks of an artist.
   * @param {string} country - An ISO 3166-1 alpha-2 country code.
   * @returns {Promise<Track[]|HTTPError|ApiError>}
   */
  top(country) {
    return this.spotify.artists.top(this.id, country);
  }

  /**
   * Shortcut to get related artists.
   * @returns {Promise<Artist[]|HTTPError|ApiError>}
   */
  related() {
    return this.spotify.artists.related(this.id);
  }
}

module.exports = Artist;
