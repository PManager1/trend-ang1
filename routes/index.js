var colors = require('colors'); 
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

//these models are found in the /models folder
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var Trend = mongoose.model('Trend'); 


var youtube = require('youtube-node');
youtube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');






/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});



// */*/*/********/  // Youtube // */*/*/********/  // */*/*/********/  //

router.get('/youtube', function (req, res, next) {
    console.log(' !!!  callign /youtube  in the router.index   '.red);
    youtube.search('jazzy b', 2, function(resultData) {

        res.json(resultData);
        // console.log('resultData ='.red , resultData);
    });
    
});




router.get('/youtube/:name', function (req, res, next) {
    console.log(' ~~ :id callign /youtube router.index id= '.white, req.params.name); 
    youtube.search(req.params.name, 4, function(resultData) {

        res.json(resultData);
        console.log('resultData ='.red , resultData);
    });
});







// */*/*/********/  // trends // */*/*/********/  // */*/*/********/  //

router.get('/trends', function (req, res, next) {
    Trend.find(function (err, trends) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(trends);
    });
});










// */*/*/********/  //             posts             // */*/*/********/  //

router.get('/posts', function (req, res, next) {
    Post.find(function (err, posts) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(posts);
    });
});




router.post('/posts', function (req, res, next) {
    var post = new Post(req.body);
    
    post.save(function (err, post) {
        if (err) { return next(err); }
        res.json(post);
    });
});


router.param('post', function (req, res, next, id) {
    var query = Post.findById(id);
    query.exec(function (err, post) {
        if (err) { return next(err); }
        if (!post) { return next(new Error("Cannot find post!")); }
        req.post = post;
        return next();
    });
});

//for comment upvotes, I also need a comment param
router.param('comment', function (req, res, next, id) {
    console.log('comment param');
    var query = Comment.findById(id);
    query.exec(function (err, comment) {
        if (err) {return next(err); }
        if (!comment) { return next(new Error("Cannot find comment!")); }
        req.comment = comment;
        return next();
    });
});

router.get('/posts/:post', function (req, res) {
    req.post.populate('comments', function (err, post) {
        res.json(req.post);
    });
});

// 2 route for trend upvotes     // */*/*/*/   =>  new 
router.put('/trends/:trend/upvote', function (req, res, next) {
    console.log('2 calling upvote for route/index  req.trend ~~~~',req.trend);
    req.trend.upvote(function (err, trend) {
        if (err) { return next(err); }
        res.json(trend);
    });
});

//route for post upvotes
router.put('/posts/:post/upvote', function (req, res, next) {
    console.log('1 calling upvote for route/index req.post ~~~~',req.post);
    req.post.upvote(function (err, post) {
        if (err) { return next(err); }
        res.json(post);
    });
});

//route for post downvotes
router.put('/posts/:post/downvote', function (req, res, next) {
    console.log('downvote');
    req.post.downvote(function (err, post) {
        if (err) { return next(err); }
        res.json(post);
    });
});




//comments routing, per post
router.post('/posts/:post/comments', function (req, res, next) {
    //pass the request body into a new Comment mongoose model
    console.log('potato');
    var comment = new Comment(req.body);
    console.log('pajama');
    //check for errors, and save the comment if none
    comment.save(function (err, comment) {
        if (err) { return next(err); }
        //no http errors, add this comment to the comments array
        req.post.comments.push(comment);
        
        req.post.save(function (err, post) {
            if (err) { return next(err); }
            
            res.json(comment);
        });
    });
});

router.get('/posts/:post/comments', function (req, res) {
    res.json(req.post.comments);
});

//comment upvotes
router.put('/posts/:post/comments/:comment/upvote', function (req, res, next) {
    req.comment.upvote(function (err, comment) {
        if (err) { return next(err); }
        res.json(comment);
    });
});

//comment downvotes
router.put('/posts/:post/comments/:comment/downvote', function (req, res, next) {
    req.comment.downvote(function (err, comment) {
        if (err) { return next(err); }
        res.json(comment);
    });
});

module.exports = router;
