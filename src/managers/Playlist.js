const qs = require('querystring');
const Playlist = require('../structures/Playlist.js');
const Track = require('../structures/Track.js');

const API = 'https://api.spotify.com/v1/playlists';
const HTTPError = require('../HTTPError.js');
const ApiError = require('../ApiError');

class PlaylistManager {
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
   * Get a playlist owned by a Spotify user.
   * @param {string} id - The Spotify ID of the playlist.
   * @param {PlaylistOptions} options
   * @returns {Promise<Playlist|HTTPError|ApiError>}
   */
  get(id, { types = ['track'], fields } = {}) {
    const options = qs.stringify({
      types: types.join(','),
      fields,
    });

    const path = API + '/' + id + '?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const playlist = new Playlist(this.spotify, body);
                return resolve(playlist);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Change a playlist's name and public/private state. (The user must, of course, own the playlist.)
   * @param {string} id - The Spotify ID of the playlist.
   * @param {ModifyOptions} options
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  modify(id, { name, public: state, collaborative, description } = {}) {
    const body = {
      name,
      public: state,
      collaborative,
      description,
    };

    const path = API + '/' + id;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'put',
          body,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (response.status == 200) {
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
   * Get full details of the items of a playlist owned by a Spotify user.
   * @param {string} id - The Spotify ID of the playlist.
   * @param {PlaylistTracksOptions} options
   * @returns {Promise<Track[]|HTTPError|ApiError>}
   */
  tracks(id, { types = ['track'], fields, limit = 20, offset = 0 } = {}) {
    const options = qs.stringify({
      types: types.join(','),
      fields,
      limit,
      offset,
    });

    const path = API + '/' + id + '/tracks?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const tracks = body.items.map((t) => {
                  const track = new Track(this.spotify, t);
                  Object.assign(track, track.track);
                  delete track.track;
                  return track;
                });
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
   * Add one or more items to a user's playlist.
   * @param {string} id - The Spotify ID of the playlist.
   * @param {string|string[]} uris - A list of Spotify URIs to add, can be track or episode URIs. Maximum: 100
   * @param {number} [position=0] - The position to insert the items, a zero-based index.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  add(id, uris, position = 0) {
    const body = {
      uris: typeof uris == 'string' ? [uris] : uris,
      position,
    };

    const path = API + '/' + id + '/tracks';

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'post',
          body,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 201) {
                resolve({ snapshot: body.snapshot_id });
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Remove one or more items from a user's playlist.
   * @param {string} id - The Spotify ID of the playlist.
   * @param {string|string[]} uris - A list of Spotify URIs to remove, can be track or episode URIs. Maximum: 100
   * @param {string} [snapshot] - The playlist's snapshot ID against which you want to make the changes.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  remove(id, uris, snapshot) {
    const body = {
      uris: typeof uris == 'string' ? [uris] : uris,
      snapshot,
    };

    const path = API + '/' + id + '/tracks';

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'delete',
          body,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                resolve({ snapshot: body.snapshot_id });
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get a list of the playlists owned or followed by the current Spotify user.
   * @param {string} [id] - The user's Spotify user ID - if not provided it will default to the current user.
   * @param {LimitOptions} options
   * @returns {Promise<Playlist[]|HTTPError|ApiError>}
   */
  users(id, { limit = 20, offset = 0 } = {}) {
    const options = qs.stringify({
      limit,
      offset,
    });

    let path;

    if (!id) {
      path = 'https://api.spotify.com/v1/me/playlists?' + options;
    } else {
      path = 'https://api.spotify.com/v1/users/' + id + '/playlists?' + options;
    }

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const playlists = body.items.map(
                  (p) => new Playlist(this.spotify, p)
                );
                return resolve(playlists);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Add the current user as a follower of a playlist.
   * @param {string} id - The Spotify ID of the playlist.
   * @param {boolean} [state=true] -  If the playlist will be included in user's public playlists.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  follow(id, state = true) {
    const path = API + '/' + id + '/followers';

    const body = {
      public: state,
    };

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'put',
          body,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                resolve({ status: response.status });
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Remove the current user as a follower of a playlist.
   * @param {string} id - The Spotify ID of the playlist.
   * @returns {Promise<Status|HTTPError|ApiError>}
   */
  unfollow(id) {
    const path = API + '/' + id + '/followers';

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'delete',
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                resolve({ status: response.status });
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Check to see if one or more Spotify users are following a specified playlist.
   * @param {string} id - The Spotify ID of the playlist.
   * @param {string|string[]} users - A list of Spotify User IDs.
   * @returns {boolean|boolean[]|HTTPError|ApiError}
   */
  followers(id, users) {
    const options = qs.stringify({
      ids: typeof users == 'string' ? [users] : users.join(','),
    });

    const path = API + '/' + id + '/followers/contains?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                if (body.length == 1) {
                  resolve(body[0]);
                }
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Create a playlist for a Spotify user.
   * @param {string} id - The user's Spotify user ID.
   * @param {ModifyOptions} options
   * @returns {Promise<Playlist|HTTPError|ApiError>}
   */
  create(id, { name, public: state, collaborative, description } = {}) {
    const body = {
      name,
      public: state,
      collaborative,
      description,
    };

    const options = qs.stringify({ user_id: id });
    /* prettier-ignore */
    const path = 'https://api.spotify.com/v1/users/' + id + '/playlists?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
          method: 'post',
          body,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 201) {
                const playlist = new Playlist(this.spotify, body);
                return resolve(playlist);
              }
              reject(new ApiError(body.error));
            }

            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get a list of Spotify featured playlists.
   * @param {FeaturedOptions} [options]
   * @returns {Promise<Playlist[]|HTTPError|ApiError>}
   */
  featured({ limit = 20, locale, offset = 0, timestamp } = {}) {
    const opts = {
      limit,
      locale,
      offset,
    };

    if (timestamp) {
      opts['timestamp'] = timestamp;
    }

    const options = qs.stringify(opts);
    /* prettier-ignore */
    const path = 'https://api.spotify.com/v1/browse/featured-playlists?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const playlists = body.playlists.items.map(
                  (p) => new Playlist(this.spotify, p)
                );
                return resolve(playlists);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get a list of Spotify playlists tagged with a particular category.
   * @param {string} id - The Spotify category ID for the category.
   * @param {LimitOptions} options
   * @returns {Promise<Playlist[]|HTTPError|ApiError>}
   */
  categories(id, { limit = 20, offset = 0 } = {}) {
    const options = qs.stringify({
      limit,
      offset,
    });

    /* prettier-ignore */
    const path = 'https://api.spotify.com/v1/browse/categories/' + id + '/playlists?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const playlists = body.playlists.items.map(
                  (p) => new Playlist(this.spotify, p)
                );
                return resolve(playlists);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }

  /**
   * Get the current image associated with a specific playlist.
   * @param {string} id - The Spotify ID of the playlist.
   * @param {string} [image] - The Base64 image encoded to upload as cover art.
   * @returns {Promise<Image|Status|HTTPError|ApiError>}
   */
  cover(id, image) {
    const path = API + '/' + id + '/images';
    let opts = {
      options: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      path,
    };

    if (image) {
      opts.options.headers['Content-Type'] = 'image/jpeg';
      opts['body'] = image;
      opts['method'] = 'put';
    }

    return new Promise((resolve, reject) => {
      this.spotify.util.fetch(opts).then((response) => {
        this.spotify.util.toJson(response).then((body) => {
          if (body) {
            if (response.status == 200) {
              return resolve(body);
            } else if (body.error) {
              reject(new ApiError(body.error));
            }
          } else if (response.status == 200) {
            return resolve({ status: response.status });
          }

          reject(new HTTPError(response));
        });
      });
    });
  }

  /**
   * Get Spotify catalog information about playlists.
   * @param {string} query - Your search query.
   * @param {SearchOptions} options
   * @returns {Promise<Playlist[]|HTTPError|ApiError>}
   */
  search(query, { external = false, limit = 20, offset = 0 } = {}) {
    const opts = {
      q: query,
      type: 'playlist',
      limit,
      offset,
    };

    if (external) {
      opts['include_external'] = 'audio';
    }

    const options = qs.stringify(opts);
    const path = 'https://api.spotify.com/v1/search?' + options;

    return new Promise((resolve, reject) => {
      this.spotify.util
        .fetch({
          path,
        })
        .then((response) => {
          this.spotify.util.toJson(response).then((body) => {
            if (body) {
              if (response.status == 200) {
                const playlists = body.playlists.items.map(
                  (p) => new Playlist(this.spotify, p)
                );
                return resolve(playlists);
              }
              reject(new ApiError(body.error));
            }
            reject(new HTTPError(response));
          });
        });
    });
  }
}

module.exports = PlaylistManager;

/**
 * @typedef {Object} PlaylistOptions
 * @property {string} [types=['track']] - The types that the client supports. (track, episode)
 * @property {string} [fields] - Filters for the query, a list of the fields to return. If omitted, all fields are returned.
 */

/**
 * @typedef {PlaylistOptions} PlaylistTracksOptions
 * @property {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
 * @property {number} [offset=0] - The index of the first item to return.
 */

/**
 * @typedef {Object} FeaturedOptions
 * @property {number} [limit=20] - The maximum number of items to return. Minimum: 1. Maximum: 50.
 * @property {string} [locale] - The desired language, consisting of a lowercase ISO 639-1 language code and an uppercase ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX.
 * @property {number} [offset=0] - The index of the first item to return.
 * @property {string} [timestamp] - A timestamp in ISO 8601 format: yyyy-MM-ddTHH:mm:ss. Use this parameter to specify the user's local time to get results tailored for that specific date and time in the day. If not provided, the response defaults to the current UTC time.
 */

/**
 * @typedef {Object} ModifyOptions
 * @property {string} name - The new name for the playlist.
 * @property {boolean} public - If true the playlist will be public, if false it will be private.
 * @property {boolean} collaborative - If true, the playlist will become collaborative and other users will be able to modify the playlist in their Spotify client.
 * @property {string} description - Value for playlist description.
 */
