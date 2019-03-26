var express = require('express');
var router = express.Router();
let mongo = require('mongodb');
let db = require('monk')('localhost/blog-system');
/* GET home page. */
router.get('/', function(req, res, next) {
  let db = req.db;
  let posts = db.get('posts');
  posts.find((posts, err) => {
    res.render('index', { posts: posts });
  });

});

module.exports = router;
