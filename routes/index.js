var colors = require('colors'); 
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var sm = require('sitemap');
var _ = require('underscore');

//these models are found in the /models folder
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');



// var Trend = mongoose.model('Trend'); 


var youtube = require('youtube-node');
youtube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');






//~~~~~~~~~~~~~/~~~~~~~~~~~~~~~~~~~~~~/ DB retrieval ~~~~~~~~~~~~~~~~~/~~~~~~~~~~~~~~~~~~~~~~/

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
  console.log(' db opened');
});

mongoose.connect('mongodb://localhost/news');

var trendSchema = mongoose.Schema({
    tName: String,
    tName_h: String,    
    region: String
  });

var Trend = mongoose.model('Trend', trendSchema);





function getTrends(req, res, next) {

     Trend.find(function(err, trends) {
      if (err) return console.error(err);
        
        var pluckedT = _.pluck(trends, 'tName_h');

        var pluckedT =  _.uniq(pluckedT);


        var changefreq_value = 'daily';
        var priority_value = '0.3';  

        var urlArr = [];

        for (var i = 0; i < pluckedT.length; i++) {
            var element = {}; 
            // console.log('line 41 ~~~ pluckedT[i]  ='.red,pluckedT[i]);
            element.url = pluckedT[i];
            element.changefreq = 'daily';
            element.priority = 0.3 ;
                                    // console.log('line 45 ~~~  element'.white, element);
                                    // console.log('line 46 ~~~  before url Arr  '.blue, urlArr);
            urlArr.push(element);
                                            // console.log('line 48 ~~~  after url Arr  '.blue, urlArr);
        };

        
        // console.log( ' urlArr =~~~~~~~~~~~~~~~~ line 51 ~~~ white '.white, urlArr);


        console.log( ' urlArr.length =~~~~~~~~~~~~~~~~ line 51 ~~~ white '.white, urlArr.length);

        req.trends = urlArr;
        // console.log(' req, trends  ==', req.trends);

        req.newurl = {url: '/page-6/', changefreq: 'monthly', priority: 0.7}


        next();// No need to return anything.
    }); 
}


//~~~~~~~~~~~~~/~~~~~~~~~~~~~~~~~~~~~~/ DB retrieval  ends ~~~~~~~~~~~~~~~~~/~~~~~~~~~~~~~~~~~~~~~~/



var sitemap = sm.createSitemap ({
      hostname: 'http://rushnwash.com/#/trend/',
      cacheTime: 600000,        // 600 sec - cache purge period
      urls: [
        // { url: '/page-1/',  changefreq: 'daily', priority: 0.3 },
        // { url: '/page-2/',  changefreq: 'monthly',  priority: 0.7 },
        // { url: '/page-3/' }     // changefreq: 'weekly',  priority: 0.5
      ]
    });


//~~~~~~~~~~~~~~~~~~/~~~~~~~~~~~~~~~~~~~~~~/ ROUTES ~~~~~~~~~~~~~~~~~~~~~~/~~~~~~~~~~~~~~~~~~~~~~/


router.get('/sitemap.xml', getTrends, function(req, res) {
    // console.log(' req .trends  = '.blue, req.trends); 
    // console.log(' req. newurl  = '.blue, req.newurl); 

    // var db = req.db;
    // var collection = db.get('usercollection');
    // collection.find({},{},function(e,docs){
    // // console.log('docs  = '.red,docs);

    // });

    sitemap.toXML( function (xml) {
      res.header('Content-Type', 'application/xml');
      res.send( xml );
  });



  var users = req.trends;


    _.each(users, function(user){
        sitemap.add(user); 
        // console.log('user line 110 ='.white,user);
    });

  // sitemap.add({url: '/page-4/', changefreq: 'monthly', priority: 0.7});
  // sitemap.add({url: '/page-5/'});
  // sitemap.add(req.newurl); 
  // console.log('sitemap.urls ======'.white, sitemap.urls);

});



//~~~~~~~~~~~~~~~~~~/~~~~~~~~~~~~~~~~~~~~~~/ Rest of the ROUTES ~~~~~~~~~~~~~~~~~~~~~~/~~~~~~~~~~~~~~~~~~~~~~/
















// ~~~~~~~~~~~~~~~~~~~


/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});



// */*/*/********/  // Youtube // */*/*/********/  // */*/*/********/  //

router.get('/youtube', function (req, res, next) {
    // console.log(' !!!  callign /youtube  in the router.index   '.red);
    youtube.search('jazzy b', 2, function(resultData) {

        res.json(resultData);
                                             // console.log('resultData ='.red , resultData);
    });
    
});




router.get('/youtube/:name', function (req, res, next) {
    // console.log(' ~~ :id callign /youtube router.index id= '.white, req.params.name); 
    youtube.search(req.params.name, 4, function(resultData) {

        res.json(resultData);
                                      // console.log('resultData ='.red , resultData);
    });
});







// */*/*/********/  // trends // */*/*/********/  // */*/*/********/  //

router.get('/trends', function (req, res, next) {
    Trend.find(function (err, trends) {
        if (err) {
            // console.log(err);
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
