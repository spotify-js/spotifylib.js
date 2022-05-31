<div align="center">
  <p>
    <a href="https://www.npmjs.com/package/spotifylib.js"><img src="https://img.shields.io/npm/v/spotifylib.js.svg?maxAge=3600" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/spotifylib.js"><img src="https://img.shields.io/npm/dt/spotifylib.js.svg?maxAge=3600" alt="npm downloads" /></a>
  </p>
</div>

> Spotify.js is a node.js module allowing you to make requests easily to spotify api.

## Install

```
npm install spotifylib.js
yarn install spotifylib.js
```

## Usage

Here is one exmaple of what can be done with spotifylib.js

```js
const { Spotify } = require('spotifylib.js');
/* Paremeters here are the client id and the client secret */
const spotify = new Spotify('xxx', 'xxx');

/* Replace 'xxx' with your access token */
spotify.set('access_token', 'xxx');

/* Fetching the data on a spotify album */
spotify.albums.get('5ht7ItJgpBH7W6vJ5BqpPr').then((album) => {
  console.log(album);

  /* You can also start a new playback of the album */
  album.play();
});
```

## Oauth2

For oauth with spotify's api I would recommend using my other package [spotify-oauth2](https://www.npmjs.com/package/spotify-oauth2) whichs allows for managaing your access token and refresh tokens easily.
[View here](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/) to find out how to get your hands on a refresh token.

```js
const Refresher = require('spotify-oauth2');
/* Paremeters here are the client id and the client secret */
const refresher = new Refresher('xxx', 'xxx');

/* Set your refresh token to the spotify oauth2 refresher */
refresher.set('refresh_token', 'xxx');

/* Setting your refresher to the spotify client */
spotify.set('refresher', refresher);

/* spotifylib.js handles refreshing your access token automatically
 * However is it recommended that you save your latest access token
 * so it can be passed into 'spotify#set('access_token', 'xxx');' when it's initialized
 */
refresher.on('token', (token) => {
  /* This will give the tokens retrived on the refresh - save them however you wish */
});

/* When the spotify client is first initialized you need to set the access_token */
spotify.set('access_token', 'xxx');
/* This is where you get the most recent access token and pass it into the set method */
```

## Links

- [Documentation](https://spotify-js.github.io/#/)
- [Github](https://github.com/spotify-js)
- [npm](https://www.npmjs.com/package/spotifylib.js)
