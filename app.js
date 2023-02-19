require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render("home")
});

app.get('/artist-search', (req, res, next) => {
  
  const {titulo} = req.query;

  spotifyApi
  .searchArtists(titulo)
  .then(data => {

    let dataBD = { data: (data.body.artists.items) }
    res.render("artist-search", dataBD);    
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {

  let {artistId} = req.params
  spotifyApi
  .getArtistAlbums(artistId)
  .then(data => data.body.items )
  .then(result => {
    res.render("albums", {result})
  })
  .catch(err => console.log('The error while get artist albums: ', err));

});

app.get('/albums/tracks/:albumId', (req, res, next) => {
  let {albumId} = req.params
  spotifyApi
  .getAlbumTracks(albumId)
  .then(data => {
    console.log(data.body.items)
    return data.body.items
  })
  .then(result => {
    res.render("tracks", {result})
  })
  .catch(err => console.log('The error while get albums tracks: ', err));

});





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
