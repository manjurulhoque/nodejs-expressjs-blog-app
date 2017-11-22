var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/blog');

/* GET home page. */
router.get('/', function(req, res, next) {
  var posts = db.get('posts');
  posts.find({}, {}, function(err, posts){
  	res.render('index', {title: 'Node blog', posts:posts});
  });	
});

module.exports = router;
