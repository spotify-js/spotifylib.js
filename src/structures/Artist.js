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
   * @returns {Promise<Album[]>}
   */
  albums(options = {}) {
    return this.spotify.artists.albums(this.id, options);
  }

  /**
   * Shortcut to get the top tracks of an artist.
   * @param {string} country - An ISO 3166-1 alpha-2 country code.
   * @returns {Promise<Track[]>}
   */
  top(country) {
    return this.spotify.artists.top(this.id, country);
  }

  /**
   * Shortcut to get related artists.
   * @returns {Promise<Artist[]>}
   */
  related() {
    return this.spotify.artists.related(this.id);
  }
}

module.exports = Artist;
