const Base = require('../Base.js');

class Playlist extends Base {
  /**
   * Represents the a playlist.
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
   * Shortcut to play the playlist.
   * @param {StartOptions} options
   */
  play(options = {}) {
    return this.spotify.player.start(this.uri, options);
  }

  /**
   * Shortcut to modify the playlist.
   * @param {ModifyOptions} options
   */
  modify(options = {}) {
    return this.spotify.playlist.modify(this.id, options);
  }

  /**
   * Shortcut to the playlist's tracks.
   * @param {PlaylistTracksOptions} options
   */
  tracks(options = {}) {
    return this.spotify.playlists.tracks(this.id, options);
  }

  /**
   * Shortcut to add tracks to a playlist.
   * @param {string|string[]} uris - A list of Spotify URIs to add, can be track or episode URIs.
   * @param {number} [position=0] - The position to insert the items, a zero-based index.
   */
  add(uris, position = 0) {
    return this.spotify.playlists.add(this.id, uris, position);
  }

  /**
   * Shortcut to remove a track from a playlist.
   * @param {string|string[]} uris - A list of Spotify URIs to remove, can be track or episode URIs. Maximum: 100
   * @param {string} [snapshot] - The playlist's snapshot ID against which you want to make the changes.
   */
  remove(uris, snapshot) {
    return this.spotify.playlists.remove(this.id, uris, snapshot);
  }

  /**
   * Shortcut to upload cover art to a playlist.
   * @param {string} [image] - The Base64 image encoded to upload as cover art.
   */
  cover(image) {
    return this.spotify.playlists.cover(this.id, image);
  }
}

module.exports = Playlist;
