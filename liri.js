require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var moment = require("moment");

var action = process.argv[2];
var nodeArg = process.argv.splice(3).join(" ");

function initialize() {
    switch (action) {
        case "concert-this":
            bandInTown();
            break;

        case "spotify-this-song":
            spotifyApi();
            break;

        case "movie-this":
            ombdApi();
            break;

        case "do-what-it-says":
            randomText();
            break;
    }
};
initialize();
// call the spotify api when argv[2] = "spotify-this-song"
function spotifyApi() {
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: "track", query: nodeArg, limit: 1 }, function (error, response) {
        if (error) {
            console.log(error);
        }
        if (search) {
            console.log("---------------------")
            // this will display the artist name.
            console.log("Artist(s) name: " + response.tracks.items[0].artists[0].name);
            // this will display the songs name
            console.log("Song name: " + response.tracks.items[0].name);
            // this will display the name of the album
            console.log("Album name: " + response.tracks.items[0].album.name);
            // this will display the preview url 
            console.log("Preview URL: " + response.tracks.items[0].preview_url);
        } else {
            nodeArg = "The Sign";
        }
    })
};
// call the bandInTown Api when argv[2] = "concert-this"
function bandInTown() {
    const url = "https://rest.bandsintown.com/artists/" + nodeArg + "/events?app_id=codingbootcamp";
    request(url, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            const obj = JSON.parse(response.body);
            console.log("-----------------------");
            // this will display the venue name
            console.log("Venue name: " + obj[0].venue.name);
            // this will display the venue location
            console.log("Venue location: " + obj[0].venue.city + ", " + obj[0].venue.region);
            // this will display the date for the event
            console.log("Date of Event: " + moment(obj[0].datetime).format("L"));
        }
    })
};
// call the ombdApi when argv[2] = "movie-this"
function ombdApi() {
    request("http://www.omdbapi.com/?apikey=trilogy&t=" + nodeArg, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            const obj = JSON.parse(response.body);
            console.log("---------------------------");
            // this will display the title of the movie
            console.log("Title: " + obj.Title);
            // this will display the year the movie came out
            console.log("Release Year: " + obj.Released);
            // this will display the IMDB rating
            console.log("IMDB Rating: " + obj.imdbRating);
            // this will display the rotten tomatoes rating
            console.log("Critic Rating: " + obj.Ratings[1].Source + ", " + obj.Ratings[1].Value);
            // this will display country where the movie was produced
            console.log("Country of Production: " + obj.Country);
            // this will display language of the movie
            console.log("Language: " + obj.Language);
            // this will display plot of the movie
            console.log("Movie Plot: " + obj.Plot);
            // this will display actors in the movie.
            console.log("Movie Actors: " + obj.Actors);
        }
    })
};
// call the randomText function when argv[2] = "do-what-it-says"
function randomText() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        } else {
            var newArr = data.split(",");
            for (var i = 0; i < newArr.length; i++) {
                console.log(newArr[i]);
                action = newArr[0];
                nodeArg = newArr[1];
                initialize();
            }
        }
    })
};