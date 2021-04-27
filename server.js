const express = require('express');
const app = express()
const SpotifyWebApi = require('spotify-web-api-node')

const scopes = [
  'user-read-private',
  'user-read-email',
  'user-read-recently-played',
  'user-top-read',
]

const spotifyApi = new SpotifyWebApi({
    redirectUri: 'https://discoverfy-app.herokuapp.com/callback',
    clientId: 'CLIENTID',
    clientSecret: 'CLIENTSECRET'
})

app.use(express.static('public'))

app.set('view engine', 'ejs')


// render index page
app.get('/', (req, res) => {
  res.render('pages/index')
})

// allow user to sign in to Spotify
app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes))
})

// get auth token when user signs in
app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    
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
        console.log('access_token:', access_token)
        console.log('refresh_token:', refresh_token)

        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];
  
          console.log('new access_token:', access_token);
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);

        res.redirect('/recenttracks');
      })
      .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
      })
})

// get users recently played tracks and render recenttracks page
app.get('/recenttracks', (req, res) => {
  const token = req.query.token
  spotifyApi.getMyRecentlyPlayedTracks({
  limit: 50
  }).then(data => {
    const songs = []
    data.body.items.forEach(item => {
      const id = item.track.id
      const name = item.track.name
      let artists = ""
      item.track.artists.forEach(artist => {
        artists += `${artist.name}, `
      })
      artists = artists.substring(0, artists.length-2)
      songs.push({
        id: id,
        name: name,
        artists: artists
      })
    })
    res.render('pages/recent-tracks', {
      songs: songs,
      token: token
    })
  })
  .catch (error => console.log(error))
})

// get users top tracks for time_range specified in parameter and render toptracks page
app.get('/toptracks/p', (req, res) => {
  const timeRange = req.query.time_range
  spotifyApi.getMyTopTracks({
    time_range: timeRange,
    limit: 50
  }).then(data => {
    const songs = []
    data.body.items.forEach(item => {
      const id = item.id
      const name = item.name
      let artists = ""
      item.artists.forEach(artist => {
        artists += `${artist.name}, `
      })
      artists = artists.substring(0, artists.length-2)
      songs.push({
        id: id,
        name: name,
        artists: artists
      })
    })
    res.render('pages/top-tracks', {
      songs: songs
    })
  })
  .catch(error => console.log(error))
})

// get recommendations for selected track and render recommendations page
app.get('/recommendations/p', (req, res) => {
  const songId = req.query.id
  const songName = req.query.name
  spotifyApi.getRecommendations({
    limit:50,
    seed_tracks: songId
  }).then(data => {
    const songs = []
    data.body.tracks.forEach(track => {
      const id = track.id
      const name = track.name
      let artists = ""
      track.artists.forEach(artist => {
        artists += `${artist.name}, `
      })
      artists = artists.substring(0, artists.length-2)
      const preview = track.preview_url
      const uri = track.uri
      songs.push({
        id: id,
        name: name,
        artists: artists,
        preview: preview,
        uri: uri
      })
    })
    res.render('pages/recommendations', {
      songs: songs,
      name: songName
    })
  })
  .catch(error => console.log(error))
})


app.listen(process.env.PORT || 8888)
