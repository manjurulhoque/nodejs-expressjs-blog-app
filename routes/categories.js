var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/blog');


router.get('/add', function(req, res, next) {
    res.render('addcategories', {title: 'Add category'});
});

router.post('/add', function(req, res, next) {
    var title = req.body.title;
    
    posts.insert({
        title: title
    }, (err, category) =>{
        if(err){
            res.send('There was some issue');
        }
        else{
            req.flash('success', 'Category created');
            res.location('/');
            res.redirect('/');
        }
    });
    res.render('addcategories', {title: 'Add category'});
});


router.get('/show/:category', function(req, res, next) {
    var posts = db.get('posts');
    posts.find({category: req.params.category}, {}, function(err, posts){
        res.render('index',{
            posts:posts,
            category: req.params.category,
            title: "Title"
        })
    });
});

module.exports = router;
