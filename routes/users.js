var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Post = require('../models/Post');


router.get('/', function(req, res, next) {

    if(!req.session.user){
        res.render('index.pug');
    }else {
        let q = (req.query && req.query.title) ? {title: new RegExp('^' + req.query.title, 'i')} : {};
        Post.find(q, {}).then((posts) => {
            res.render('index.pug', { posts: posts, logado: true} );
        });
    }
});

router.get('/login', (req, res) => {
    res.render('login.pug');
})

router.post('/login', (req, res) => {
    let login = req.body.login,
        password = req.body.password;

        if(login === "" || password === ""){
            res.render('login.pug', {'err': 2});
        } else {
            User.find({login: login, password: password}).then((user) => {
                if(user.length == 0 ) {
                    res.render('login.pug', {err: 1 });
                } else {
                    req.session.user = user[0]._id;
                    res.redirect('/');
                }
            });
        }
})

router.get('/create', function (req, res, next) {
    res.render('users/create.pug');
  });

router.post('/create', function (req, res, next) {
    let user = new User({});
    user.login = req.body.login;
    user.email = req.body.email;
    user.address = req.body.address;
    user.password = req.body.password;
  
    if(req.body.login === "" || req.body.email === "" || req.body.address === "" || req.body.password === "")
        res.render('users/create.pug', {'err': 2});
    else {
        try {
            User.find({ $or: [{login: user.login}, {email: user.email}]}).then((users) => {
                if(users.length > 0 ) {
                    res.render('users/create.pug', {err: 1});
                } else {
                    user.save();
                    res.redirect('/');
                }
            })
        } catch (err){
            console.log(err);
        }
    }
});

module.exports = router;
