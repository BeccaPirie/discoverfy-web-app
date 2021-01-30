var express = require('express');
var app = express()
var SpotifyWebApi = require('spotify-web-api-node')

var scopes = ['user-read-private', 'user-read-email']

var spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:8888/callback',
    clientId: '1d72037226ee42ecb9d96acb33beb4f5',
    clientSecret: 'fffc78eb81cc440cb93b9c1bcf06c149'
})

app.use(express.static('public'))

app.get('/', function(req, res) {
    res.send('/')
})

app.get('/login', function(req, res) {
    res.redirect(spotifyApi.createAuthorizeURL(scopes))
})

app.get('/callback', function(req, res) {
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
  
        console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);
  
        console.log(
          `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );
        res.redirect('recent-tracks.html');
  
        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];
  
          console.log('The access token has been refreshed!');
          console.log('access_token:', access_token);
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);

        return spotifyApi.getMe()
      })
      .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
      })  
      .then(data => {
        console.log(data.body['display_name'])
      })
})

app.listen(8888)