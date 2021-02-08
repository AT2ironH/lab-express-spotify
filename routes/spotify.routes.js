const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const hbs = require("hbs");

router.get(`/`, (req, res) => {
  res.render("artists-search.hbs");
});

router.get(`/artist-search-results`, (req, res) => {
  res.render("artist-search-results.hbs");
});

router.get(`/tracks/:albumsId`, (req, res) => {
  let albumsId = req.params.albumsId;

  //         spotifyApi
  //           .getAlbumTracks(albumsId, { limit: 5, offset: 1 })
  //           .then(
  //             function (data) {
  //                     res.render("tracks.hbs", {
  //                       track: data.body.items,
  //                     });
  //                     }

  //             function (err) {
  //               console.log("Something went wrong!", err);
  //             });
  spotifyApi.getAlbumTracks("albumsId", { limit: 5, offset: 1 }).then(
    function (data) {
      res.render("tracks.hbs", {
        track: data.body.items,
      });

      console.log(data.body);
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

router.get(`/albums/:artistId`, (req, res) => {
  let albumId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(albumId)
    .then((data) => {
      res.render("albums.hbs", { albums: data.body.items });
      console.log(data.body.items[0]);

      // res.render(`albums`, )
    })
    .catch((err) => {
      console.log(`err while getting an album ID`, err);
    });
});

router.get("/artists-search", (req, res) => {
  let myQuery = req.query.artist;

  spotifyApi
    .searchArtists(myQuery)
    .then((data) => {
      res.render("artist-search-results.hbs", {
        artists: data.body.artists.items,
      });
      // console.log(data.body.artists.items)
      //   console.log("The received data from the API: ", {artists: data.body.artists.items});

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

module.exports = router;
