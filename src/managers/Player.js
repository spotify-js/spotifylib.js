const qs = require('querystring');
const Track = require('../structures/Track.js');

const API = 'https://api.spotify.com/v1/me/player';
const HTTPError = require('../HTTPError.js');
const ApiError = require('../ApiError.js');

class PlayerManager {
  /**
   * Manages spotify playing.
   * @param {Spotify} spotify - The spotify client.
   */
  constructor(spotify) {
    /**
     * The spotify client.
     * @type {Spotify}
     */
    this.spotify = spotify;
  }

  /**
   * Get information about the user's current playback state.
   * @param {AdditionalTypes[]} [types=['track']] - The types that the client supports. (track, episode)
   * @returns {Promise<State|HTTPError|ApiError>}
   */
  state(types = ['track']) {
    const options = qs.stringify({
      additional_types: types.join(','),
    });

    const path = API + '?' + options;

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
   * Transfer playback to a new device and determine if it should start playing.
   * @param {string} id - The id of the device to transfer the playback to.
   * @param {boolean} [play=true] - The playback continues after transfer.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  transfer(id, play = true) {
    const body = {
      device_ids: [id],
      play,
    };

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path: API,
          method: 'put',
          body,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 204) {
              resolve({ status: response.status });
            } else if (body) {
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get information about a user’s available devices.
   * @returns {Promise<Device[]|HTTPError|ApiError>}
   */
  devices() {
    const path = API + '/devices';

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 204) {
              resolve({ status: response.status });
            } else if (body) {
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get the object currently being played on the user's Spotify account.
   * @param {AdditionalTypes[]} [types=['track']] - The types that the client supports.
   * @returns {Promise<Track|HTTPError|ApiError>}
   */
  current(types = ['track']) {
    const options = qs.stringify({
      additional_types: typeof types == 'string' ? [types] : types.join(','),
    });

    const path = API + '/currently-playing?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const track = new Track(this.spotify, body);
                return resolve(track);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Start a new context.
   * @param {ContextURI} uri - The context uri to start playing.
   * @param {StartOptions} [options]
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  start(uri, { device, offset = 0, ms = 0 } = {}) {
    const options = qs.stringify({
      device_id: device,
    });

    const body = {
      context_uri: uri,
      position_ms: ms,
      offset: {
        position: offset,
      },
    };

    const path = API + '/play?' + (device ? options : '');

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'put',
          body,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 204) {
              resolve({ status: response.status });
            } else if (body) {
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Resume current playback on the user's active device.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  resume(device) {
    const options = qs.stringify({
      device_id: device,
    });

    const path = API + '/play?' + (device ? options : '');

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'put',
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 204) {
              resolve({ status: response.status });
            } else if (body) {
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Pause playback on the user's account.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  pause(device) {
    const options = qs.stringify({
      device_id: device,
    });

    const path = API + '/pause?' + (device ? options : '');

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'put',
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 204) {
              resolve({ status: response.status });
            } else if (body) {
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Skips to next track in the user’s queue.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  next(device) {
    const options = qs.stringify({
      device_id: device,
    });

    const path = API + '/next?' + (device ? options : '');

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'post',
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 204) {
              resolve({ status: response.status });
            } else if (body) {
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Skips to previous track in the user’s queue.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  back(device) {
    const options = qs.stringify({
      device_id: device,
    });

    const path = API + '/previous?' + (device ? options : '');

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'post',
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 204) {
              resolve({ status: response.status });
            } else if (body) {
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Seeks to the given position in the user’s currently playing track.
   * @param {number} ms - The position in milliseconds to seek to. Passing in a position that is greater than the length of the track will cause the player to start playing the next song.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  seek(ms, device) {
    const opts = {
      position_ms: ms,
    };

    if (device) {
      opts['device'] = device;
    }

    const options = qs.stringify(opts);
    const path = API + '/seek?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'put',
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 204) {
              resolve({ status: response.status });
            } else if (body) {
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   *Set the repeat mode for the user's playback. Options are repeat-track, repeat-context, and off.
   * @param {RepeatStates} state - The state to set the user's currently active device repeat mode to.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  repeat(state, device) {
    const opts = {
      state,
    };

    if (device) {
      opts['device'] = device;
    }

    const options = qs.stringify(opts);
    const path = API + '/repeat?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'put',
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 204) {
              resolve({ status: response.status });
            } else if (body) {
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Set the volume for the user’s current playback device.
   * @param {number} vol - The volume to set. Must be a value from 0 to 100 inclusive.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  volume(vol, device) {
    const opts = {
      volume_percent: vol,
    };

    if (device) {
      opts['device'] = device;
    }

    const options = qs.stringify(opts);
    const path = API + '/volume?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'put',
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 204) {
              resolve({ status: response.status });
            } else if (body) {
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Toggle shuffle on or off for user’s playback.
   * @param {boolean} state - To shuffle the user's playback.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  shuffle(state, device) {
    const opts = {
      state,
    };

    if (device) {
      opts['device'] = device;
    }

    const options = qs.stringify(opts);
    const path = API + '/shuffle?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'put',
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 204) {
              resolve({ status: response.status });
            } else if (body) {
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get tracks from the current user's recently played tracks. Note: Currently doesn't support podcast episodes.
   * @param {RecentOptions} options
   * @returns {Promise<Track[]|HTTPError|ApiError>}
   */
  recent({ limit = 20, after, before } = {}) {
    if (after && before) {
      throw new Error('Only one of `after` or `before` can be provided.');
    }

    const opts = {
      limit,
    };

    if (after) {
      opts['after'] = after;
    } else if (before) {
      opts['before'] = before;
    }

    const options = qs.stringify(opts);
    const path = API + '/recently-played?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const tracks = body.items.map(
                  (t) => new Track(this.spotify, t.track)
                );
                return resolve(tracks);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Add an item to the end of the user's current playback queue.
   * @param {ContextURI} uri - The uri of the item to add to the queue. Must be a track or an episode uri.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  queue(uri, device) {
    const opts = {
      uri,
    };

    if (device) {
      opts['device'] = device;
    }

    const options = qs.stringify(opts);
    const path = API + '/queue?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'post',
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 204) {
              resolve({ status: response.status });
            } else if (body) {
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }
}

module.exports = PlayerManager;

/**
 * @typedef {Object} StartOptions
 * @property {string} [device] - The device id to start the playback on - by default the current active device.
 * @property {number} [offset=0] - The offset to start the playback.
 * @property {number} [ms=0] - The position to start the playbak in milliseconds.
 */

/**
 * @typedef {Object} RecentOptions
 * @property {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
 * @property {number} [after] - A Unix timestamp in milliseconds. Returns all items before (but not including) this cursor position.
 * @property {number} [before] -A Unix timestamp in milliseconds. Returns all items after (but not including) this cursor position.
 */

/**
 * Additional types for the client to support - by default 'track' is the suppiled type.
 * - track
 * - episode
 * @typedef {string} AdditionalTypes
 */

/**
 * track - will repeat the current track.
 * context - will repeat the current context.
 * off - will turn repeat off.
 * @typedef {string} RepeatStates
 */
