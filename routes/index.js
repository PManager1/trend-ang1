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

        // var pluckedT =  pluckedT.splice(1, 10);      



        var urlArr = [];

        for (var i = 0; i < pluckedT.length; i++) {
            var element = {}; 
            // console.log('line 41 ~~~ pluckedT[i]  ='.red,pluckedT[i]);
            element.url = pluckedT[i];
            element.changefreq = 'daily';
            element.priority = 0.8;
                                    // console.log('line 45 ~~~  element'.white, element);
                                    // console.log('line 46 ~~~  before url Arr  '.blue, urlArr);
            urlArr.push(element);
                                            // console.log('line 48 ~~~  after url Arr  '.blue, urlArr);
        };

        
        console.log( ' urlArr =~~~~~~~~~~~~~~~~ line 51 ~~~ urlArr  = '.white, urlArr);


        console.log( ' urlArr.length =~~~~~~~~~~~~~~~~ line  ~~~ white ==> '.red, urlArr.length);

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


module.exports = router;
