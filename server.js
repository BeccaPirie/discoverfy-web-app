const express = require('express');
const app = express()
const SpotifyWebApi = require('spotify-web-api-node')

const scopes = [
  'user-read-private',
  'user-read-email',
  'user-read-recently-played',
  'user-top-read'
]

const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:8888/callback',
    clientId: '1d72037226ee42ecb9d96acb33beb4f5',
    clientSecret: 'fffc78eb81cc440cb93b9c1bcf06c149'
})

app.use(express.static('public'))

app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes))
})

app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
    
    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
      }

      spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];
  
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];
  
          console.log('The access token has been refreshed!');
          console.log('access_token:', access_token);
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);

        res.redirect('/recenttracks');
      })
      .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
      })
})

app.get('/recenttracks', (req, res) => {
  spotifyApi.getMyRecentlyPlayedTracks({
  limit:20
  }).then(data => {
  res.send(data.body.items.forEach(item => console.log(item.track.name)))
  })
  .catch (error => console.log(error))
})

app.get('/toptracks', (req, res) => {
  spotifyApi.getMyTopTracks({
    time_range:'short_term',
    limit: 20
  }).then(data => {
    res.send(data.body.items.forEach(item => console.log(item.name)))
  })
  .catch(error => console.log(error))
})
// TODO top tracks medium_term and long_term

app.get('/recommendations', (req, res) => {
  spotifyApi.getRecommendations({
    limit:20,
    seed_tracks:'0c6xIDDpzE81m2q797ordA' // will come from the song the user clicks
  }).then(data => {
    res.send(data.body.tracks.forEach(track => console.log(track.name)))
  })
  .catch(error => console.log(error))
})

// TODO createplaylist
// TODO addTracksToPlaylkist

app.listen(8888)