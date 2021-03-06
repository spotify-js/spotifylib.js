const API = 'https://api.spotify.com/v1';
const HTTPError = require('../HTTPError.js');
const ApiError = require('../ApiError.js');

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
   * @returns {Promise<Audio|HTTPError|ApiError>}
   */
  features(id) {
    const path = API + '/audio-features/' + id;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                return resolve(body);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get a low-level audio analysis for a track in the Spotify catalog. The audio analysis describes the track’s structure and musical content, including rhythm, pitch, and timbre.
   * @param {string} id - The Spotify ID for the track.
   * @returns {Promise<Audio|HTTPError|ApiError>}
   */
  analysis(id) {
    const path = API + '/audio-analysis/' + id;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                return resolve(body);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }
}

module.exports = AudioManager;
