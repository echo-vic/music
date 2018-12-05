const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
// var MongoStore = require('connect-mongo')(session);
const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();

var User = require("../models/user")

const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());


// get access token spotify api
var SpotifyWebApi = require('spotify-web-api-node');
var clientId = 'c9ae0984242a44f98d383c1bd47d781f',
  clientSecret = '53166a61c5354306b71b88ae8062ed64';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

app.get('/spotify-secret', (req, res) => {
	var access_token
	spotifyApi.clientCredentialsGrant().then(
		function(data) {
			console.log('The access token expires in ' + data.body['expires_in']);
			console.log('The access token is ' + data.body['access_token']);
			access_token = data.body['access_token']

			res.send({
				secret: access_token
			})
	
			// Save the access token so that it's used in future calls
			// spotifyApi.setAccessToken(data.body['access_token']);
		},
		function(err) {
			console.log('Something went wrong when retrieving an access token', err);
		}
	);
})

var Repet = require("../models/repet")

app.get('/repet', (req, res) => {
	Repet.find({}, 'date songs', function (error, repet) {
		if (error) { console.error(error); }
		res.send({
			repet: repet
		})
	})
})

app.post('/add_repet', (req, res) => {
	var db = req.db;
	var new_repet = new Repet({
		date: req.body.date,
		songs: []
	})

	new_repet.save(function (error) {
		if (error) {
			console.log(error)
		}
		res.send({
			success: true
		})
	})
})

app.put('/new_repet_song/:repet_id', (req, res) => {
	var db = req.db;
	Repet.findById(req.params.repet_id, function (err, repet) {
		if (err) {
			res.send(err);
		}
		repet.songs.push(req.body.songId)
		repet.save(function (err) {
			if (err) {
				res.send(err);
			}
			res.send({
				success: true
			})
		})
	})
})

var Selection = require("../models/selection")

app.get('/selection', (req, res) => {
	Selection.find({}, 'creationDate track userId vote', function (error, selection) {
		if (error) { console.error(error); }
		res.send({
			selection: selection
		})
	})
})

app.put('/vote/:track_id', (req, res) => {
	var db = req.db;
	Selection.findById(req.params.track_id, function (err, track) {
		if (err) {
			res.send(err);
		}
		track.vote.push({
			'value': req.body.value,
			'userId': req.body.userId
		})
		track.save(function (err) {
			if (err) {
				res.send(err);
			}
			res.send({
				success: true
			})
		})
	})
})

app.post('/add_track', (req, res) => {
	var db = req.db;
	var date = new Date()

	var new_track = new Selection({
		track: req.body.track,
		userId: req.body.userId,
		creationDate: date
	})
	new_track.save(function (error) {
		if (error) {
			console.log(error)
		}
		res.send({
			success: true
		})
	})
})

// var User = require("../models/user")

var User = require("../models/user")

app.get('/users', (req, res) => {
	User.find({}, 'name instrument avatar', function (error, users) {
		if (error) { console.error(error); }
		res.send({
			users: users
		})
	})
})

app.post('/add_user', (req, res) => {
	var db = req.db;
	var new_user = new User({
		name: req.body.name,
		instrument: req.body.instrument,
		avatar: req.body.avatar
	})

	new_user.save(function (error) {
		if (error) {
			console.log(error)
		}
		res.send({
			success: true
		})
	})
})



var Post = require("../models/post");

app.get('/posts', (req, res) => {
  Post.find({}, 'title description', function (error, posts) {
	  if (error) { console.error(error); }
	  res.send({
			posts: posts
		})
	}).sort({_id:-1})
})

app.post('/add_post', (req, res) => {
	var db = req.db;
	var title = req.body.title;
	var description = req.body.description;
	var new_post = new Post({
		title: title,
		description: description
	})

	new_post.save(function (error) {
		if (error) {
			console.log(error)
		}
		res.send({
			success: true
		})
	})
})

app.put('/posts/:id', (req, res) => {
	var db = req.db;
	Post.findById(req.params.id, 'title description', function (error, post) {
	  if (error) { console.error(error); }

	  post.title = req.body.title
	  post.description = req.body.description
	  post.save(function (error) {
			if (error) {
				console.log(error)
			}
			res.send({
				success: true
			})
		})
	})
})

app.delete('/posts/:id', (req, res) => {
	var db = req.db;
	Post.remove({
		_id: req.params.id
	}, function(err, post){
		if (err)
			res.send(err)
		res.send({
			success: true
		})
	})
})

app.get('/post/:id', (req, res) => {
	var db = req.db;
	Post.findById(req.params.id, 'title description', function (error, post) {
	  if (error) { console.error(error); }
	  res.send(post)
	})
})

app.listen(process.env.PORT || 3001)
