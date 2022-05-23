const API = 'https://api.spotify.com/v1';

class AudioManager {
  /**
   * Manages spotify tracks.
   * @param {Spotify} Spotify - The spotify client.
   */
  constructor(spotify) {
    /**
     * The spotify client.
     * @type {Spotify}
     */
    this.spotify = spotify;
  }

  /**
   * Get audio feature information for a single track identified by its unique Spotify ID.
   * @param {string} id - The Spotify ID for the track.
   * @returns {Promise}
   */
  features(id) {
    const path = API + '/audio-features/' + id;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) => response.json())
      );
    });
  }

  /**
   * Get a low-level audio analysis for a track in the Spotify catalog. The audio analysis describes the track’s structure and musical content, including rhythm, pitch, and timbre.
   * @param {string} id - The Spotify ID for the track.
   * @returns {Promise}
   */
  analysis(id) {
    const path = API + '/audio-analysis/' + id;

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
          })
          .then((response) => response.json())
      );
    });
  }
}

module.exports = AudioManager;
