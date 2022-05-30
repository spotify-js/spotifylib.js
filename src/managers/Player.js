const qs = require('querystring');

const API = 'https://api.spotify.com/v1/me/player';

class PlayerManager {
  /**
   * Manages spotify playing.
   * @param {Spotify} Spotify - The spotify client.
   */
  constructor(Spotify) {
    /**
     * The spotify client.
     * @type {Spotify}
     */
    this.spotify = Spotify;
  }

  /**
   * Get information about the user's current playback state.
   * @param {string[]} [types=['track']] - The types that the client supports. (track, episode)
   * @returns {Promise}
   */
  state(types = ['track']) {
    const options = qs.stringify({
      additional_types: types.join(','),
    });

    const path = API + '?' + options;

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
   * Transfer playback to a new device and determine if it should start playing.
   * @param {string} id - The id of the device to transfer the playback to.
   * @param {boolean} [play=true] - The playback continues after transfer.
   * @returns {Promise}
   */
  transfer(id, play = true) {
    const body = {
      device_ids: [id],
      play,
    };

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path: API,
            method: 'put',
            body,
          })
          .then((response) => Object({ status: response.status }))
      );
    });
  }

  /**
   * Get information about a user’s available devices.
   * @returns {Promise}
   */
  devices() {
    const path = API + '/devices';

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
   * Get the object currently being played on the user's Spotify account.
   * @param {string[]} [types=['track']] - The types that the client supports. (track, episode)
   * @returns {Promise}
   */
  current(types = ['track']) {
    const options = qs.stringify({
      additional_types: types,
    });

    const path = API + '/currently-playing?' + options;

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
   * Start a new context.
   * @param {ContextURI} uri - The context uri to start playing.
   * @param {StartOptions} [options]
   * @returns {Promise}
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

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
            method: 'put',
            body,
          })
          .then((response) => Object({ status: response.status }))
      );
    });
  }

  /**
   * Resume current playback on the user's active device.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise}
   */
  resume(device) {
    const options = qs.stringify({
      device_id: device,
    });

    const path = API + '/play?' + (device ? options : '');

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
            method: 'put',
          })
          .then((response) => Object({ status: response.status }))
      );
    });
  }

  /**
   * Pause playback on the user's account.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise}
   */
  pause(device) {
    const options = qs.stringify({
      device_id: device,
    });

    const path = API + '/pause?' + (device ? options : '');

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
            method: 'put',
          })
          .then((response) => Object({ status: response.status }))
      );
    });
  }

  /**
   * Skips to next track in the user’s queue.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise}
   */
  next(device) {
    const options = qs.stringify({
      device_id: device,
    });

    const path = API + '/next?' + (device ? options : '');

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
            method: 'post',
          })
          .then((response) => Object({ status: response.status }))
      );
    });
  }

  /**
   * Skips to previous track in the user’s queue.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise}
   */
  back(device) {
    const options = qs.stringify({
      device_id: device,
    });

    const path = API + '/previous?' + (device ? options : '');

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
            method: 'post',
          })
          .then((response) => Object({ status: response.status }))
      );
    });
  }

  /**
   * Seeks to the given position in the user’s currently playing track.
   * @param {number} ms - The position in milliseconds to seek to. Passing in a position that is greater than the length of the track will cause the player to start playing the next song.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise}
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

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
            method: 'put',
          })
          .then((response) => Object({ status: response.status }))
      );
    });
  }

  /**
   *Set the repeat mode for the user's playback. Options are repeat-track, repeat-context, and off.
   * @param {RepeatStates} state
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise}
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

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
            method: 'put',
          })
          .then((response) => Object({ status: response.status }))
      );
    });
  }

  /**
   * Set the volume for the user’s current playback device.
   * @param {number} vol - The volume to set. Must be a value from 0 to 100 inclusive.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise}
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

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
            method: 'put',
          })
          .then((response) => Object({ status: response.status }))
      );
    });
  }

  /**
   * Toggle shuffle on or off for user’s playback.
   * @param {boolean} state - To shuffle the user's playback.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise}
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

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
            method: 'put',
          })
          .then((response) => Object({ status: response.status }))
      );
    });
  }

  /**
   * Get tracks from the current user's recently played tracks. Note: Currently doesn't support podcast episodes.
   * @param {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
   * @param {number} after - A Unix timestamp in milliseconds. Returns all items before (but not including) this cursor position.
   * @param {number} before -A Unix timestamp in milliseconds. Returns all items after (but not including) this cursor position.
   * @returns {Promise}
   */
  recent(limit = 20, after, before) {
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
   * Add an item to the end of the user's current playback queue.
   * @param {ContextURI} uri - The uri of the item to add to the queue. Must be a track or an episode uri.
   * @param {string} [device] - The id of the device this command is targeting. If not supplied, the user's currently active device is the target.
   * @returns {Promise}
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

    return new Promise((resolve) => {
      resolve(
        this.spotify.util
          .fetch({
            path,
            method: 'post',
          })
          .then((response) => Object({ status: response.status }))
      );
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
 * track - will repeat the current track.
 * context - will repeat the current context.
 * off - will turn repeat off.
 * @typedef {string} RepeatStates
 */
