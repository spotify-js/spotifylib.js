const Base = require('../Base.js');

class Album extends Base {
  /**
   * Represents the an album.
   * @param {Spotify} spotify - The spotify client.
   * @param {object} data - The album object data.
   * @extends {Base}
   */
  constructor(spotify, data) {
    super(data);

    /**
     * The tracks of the album.
     * @type {Track[]|undefined}
     */
    if (data.tracks && data.tracks.items) {
      const Track = require('./Track.js');
      this.tracks = data.tracks.items.map((t) => new Track(spotify, t));
    }

    /**
     * The spotify client.
     * @type {Spotify}
     */
    this.spotify = spotify;
  }

  /**
   * Shortcut to play the album.
   * @param {StartOptions} options
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  play(options = {}) {
    return this.spotify.player.start(this.uri, options);
  }

  /**
   * Shortcut to save the album.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  save() {
    return this.spotify.albums.save(this.id);
  }

  /**
   * Shortcut to remove the album.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  remove() {
    return this.spotify.albums.remove(this.id);
  }

  /**
   * Shortcut to check if a albums saved in the current Spotify user's library.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  starred() {
    return this.spotify.albums.starred(this.id);
  }
}

module.exports = Album;
