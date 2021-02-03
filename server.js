const express = require('express');
const app = express()
const SpotifyWebApi = require('spotify-web-api-node')

const scopes = [
  'user-read-private',
  'user-read-email',
  'user-read-recently-played',
  'user-top-read',
  'playlist-modify-public',
  'user-library-modify'
]

const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:8888/callback',
    clientId: '1d72037226ee42ecb9d96acb33beb4f5',
    clientSecret: 'fffc78eb81cc440cb93b9c1bcf06c149'
})

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('pages/index')
})

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

app.get('/recenttracks', (req, res) => {
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
      songs: songs
    })
  })
  .catch (error => console.log(error))
})

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


app.listen(8888)



// *******************************************************

// app.get('/createplaylist', (req, res) => {
//   const uris = req.query.uris
//   spotifyApi.createPlaylist('Discoverfy', {
//     'description': 'test',
//     'public': true
//   }).then(data => {
//     const id =  data.body.id
//     res.redirect(`/addtoplaylist/?id=${id}&uris=${uris}`)
//   }).catch(error => console.log(error))
// })

// app.get('/addtoplaylist', (req, res) => {
//   const playlistId = req.query.id
//   // const uris = req.query.uris
//   spotifyApi.addTracksToPlaylist(playlistId, uris)
//   .then(data => {
//     res.render('pages/')
//   }).catch(error => console.log(error))
// })

// ********************************************************

// app.get('/savetrack', (req, res) => {
//   const id = req.query.id
//   console.log(id)
//   spotifyApi.addToMySavedTracks([id])
//   .then((data) => {
//     res.render('pages/')
//   }).catch(error => console.log(error))
// })

// ********************************************************

