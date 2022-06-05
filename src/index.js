module.exports = {
  /* Spotify Client */
  Spotify: require('./Spotify.js'),

  /* Managers */
  AlbumManager: require('./managers/Album.js'),
  ArtistManager: require('./managers/Artist.js'),
  AudioManager: require('./managers/Audio.js'),
  CategoryManager: require('./managers/Categories.js'),
  EpisodeManager: require('./managers/Episode.js'),
  PlayerManager: require('./managers/Player.js'),
  PlaylistManager: require('./managers/Playlist.js'),
  ShowManager: require('./managers/Show.js'),
  TrackManager: require('./managers/Show.js'),
  UserManager: require('./managers/User.js'),

  /* Structures */
  Album: require('./structures/Album.js'),
  Artist: require('./structures/Artist.js'),
  Audio: require('./structures/Audio.js'),
  Episode: require('./structures/Episode.js'),
  Playlist: require('./structures/Playlist.js'),
  Show: require('./structures/Show.js'),
  Track: require('./structures/Track.js'),
  User: require('./structures/User.js'),
};
