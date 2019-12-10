var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var ObjectId = require('mongodb').ObjectId;


router.get('/', function(req, res, next) {
    if(!req.session.user){
        res.render('index.pug');
    }else {
        res.render('posts.pug');
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

router.delete('/delete/:id', function(req, res) {
    let id = ObjectId(req.params.id)
    Post.delete({_id: id})
        .then((result) => {
            console.log('another:'+result)
            res.json(result)
        }).catch((err) => {
            console.log(err)})
});

module.exports = router;
