var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Post = require('../models/Post');


router.get('/', function(req, res, next) {
    if(!req.session.user){
        res.render('index.pug');
    }else {
        //let q = (req.query && req.query.title) ? {title: new RegExp('^' + req.query.title, 'i')} : {};
        Post.find({}, {}).then((users) => {
            res.render('posts.pug', { posts: users, logado: true} );
        });
    }
});

router.post('/', function(req, res, next) {
    let post = new Post({});
    post.title = req.body.title;
    post.description = req.body.description;
    post.idUser = ""+req.session.user;

    post.save();
    res.redirect('/posts');
});

router.post('/create', function (req, res, next) {
    let user = new User({});
    user.login = req.body.login;
    user.email = req.body.email;
    user.address = req.body.address;
    user.password = req.body.password;
  
    user.save();
    res.redirect('/');
});

module.exports = router;
