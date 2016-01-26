var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts) {
    if(err) {return next(err); }
    res.json(posts);
  });
});

router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post) {
    if(err){ return next(err); }

    res.json(post);
  });
});

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  console.log("query" + query);
  query.exec(function (err, post) {
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

router.get('/posts/:post', function(req, res) {
  req.post.populate('comments', function(err, post) {
    if(err) { return next(err);}

    res.json(req.post);
  });
});

router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment) {
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});



router.get('/posts/:post/comments/:comment', function(req, res, next) {
  res.json(req.comment)
});

router.get('/posts/:post/comments', function(req, res, next) {
  res.json(req.post.comments);
});

router.post('/posts/:post/comments', function(req, res, next) {
  console.log(req.body);
  var comment = new Comment(req.body);

  console.log("2 " + comment);
  comment.post = req.body.id;
  console.log("hehehe");
  console.log(req.post);
  console.log(comment.post);

  comment.save(function(err, comment){
    console.log("comon");
    if(err){ console.log(err); return next(err); }

    console.log('blah');
    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function (err, comment) {
    if (err) { return next(err); }

    res.json(comment);
  });
});

module.exports = router;
