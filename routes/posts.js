var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/blog');
var multer  = require('multer');
//var upload = multer({ dest: './public/images/uploads' });
var fs = require("fs");
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: storage
});


router.get('/', function(req, res, next) {
  var posts = db.get('posts');
  posts.find({}, {}, function(err, posts){
  	res.render('index', {title: 'Node blog', posts:posts});
  });
});

router.get('/show/:id', function(req, res, next) {
  var posts = db.get('posts');
  posts.findOne(req.params.id, {}, function(err, post){
    res.render('show', {title: 'Node blog', post:post});
  });
});

router.get('/add', function(req, res, next) {
  var categories = db.get('categories');

  categories.find({}, {}, function(err, categories){
    res.render('addpost', {title: 'Add post', categories: categories});
  });
});

router.post('/add', upload.single('image'), function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  var title = req.body.title;
  var body = req.body.body;
  var author = req.body.author;
  var category = req.body.category;
  var date = new Date();

  var posts = db.get('posts');
  
  posts.insert({
    title: title,
    body: body,
    category: category,
    author: author,
    date: date,
    image: req.file.filename
  }, (err, post) => {
    if(err){
      res.send('There was some issue');
    }else{
      req.flash('success', 'Post submitted');
      res.location('/');
      res.redirect('/');
    }
  });
});

router.post('/addcomment', upload.single('image'), function(req, res, next) {
  var title = req.body.title;
  var id = req.body.id;
  var posts = db.get('posts');

  var comment = { "title": title };

  posts.update({
      "_id": id
    },
    {
      $push:{"comments": comment}
    }, function(err, doc){
      if(err){
        console.log(err);
      }
      else{
        req.flash('success', 'Comment added');
        res.redirect('/');
      }
    }
  )
});

router.get('/delete/:id', function(req, res, next){
  var posts = db.get('posts');
  try {
    posts.remove( { "_id" : req.params.id } );
    res.redirect('/');
  }
  catch(e){
    console.log(e);
  }
});

module.exports = router;
