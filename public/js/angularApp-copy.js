(function() {











var underscore = angular.module('potatoNews', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});







var app = angular.module('potatoNews', ['underscore']);

var potatoNews = angular.module('potatoNews', ['ui.router'])

potatoNews.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**'
    ]);
});








potatoNews.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {


    $locationProvider.hashPrefix('!');       

        $stateProvider
            .state('trend', { // */*/*/*/   new 
                url: '/trend',
                controller: 'TrendCtrl',                
                templateUrl: 'trend.html',
                resolve: {
                    slow : function() {
                        return false;
                    },
                    postPromise: ['trends', function(trends) {
                        return trends.getAll();
                    }]
                }
            })

            .state('/videos',{
              url: '/videos',                
              controller : 'VideosCtrl',
              templateUrl : 'videos.html',
                resolve: {
                    postPromise: ['trends', function(trends) {
                        return trends.getAll();
                    }]
                }
            })


        .state('trend.detail', {
            url: '/:id',
            // loaded into ui-view of parent's template
            templateUrl: 'yt.detail.html',

            controller: function($scope, $stateParams, ytfac, _) {


                // $scope.person = $scope.contacts[$stateParams.id];
                console.log(" $$$$$$$$$$$  $stateParams.id  =", $stateParams.id); 

                console.log(' ytfac from the factory  !!!!!!!!!!!!!!!!  ytfac.idfac', ytfac.idfac);

                // $scope.ylinks = ['v5Asedlj2cw', 'vRC64LiJdvo', 'p8xUVO74YDU'];

                // grabing the items from response factory 
                $scope.ytfac = ytfac.idfac.data.items;
                console.log('----->>> ytfac from the factory  !!!!!!!!!!!!!!!! returning  ytfac.idfac', $scope.ytfac);
                var pluck =  _.pluck($scope.ytfac, 'id');
                var pluck =  _.pluck(pluck, 'videoId');                

                console.log(' plucked items =', pluck);
                $scope.ylinks = pluck;
                $scope.product = {
                    medium: $scope.ylinks
                };

                $scope.getIframeSrc = function(src) {
                    return 'https://www.youtube.com/embed/' + src;
                };

                $scope.searchquery = $stateParams.id; 
                console.log(" $$$$$$$$$$$  $scope.searchquery =", $scope.searchquery);  

                $scope.ready();

            },
            resolve: {

                ytPromise: ['$stateParams','ytfac', function($stateParams, ytfac) {
                    return ytfac.get($stateParams.id);
                }]
            }
        })




        $urlRouterProvider.otherwise('trend');
    }
]);




// var app = angular.module('potatoNews', []);


potatoNews.run(function($rootScope) {
  // you can inject any instance here
   $rootScope.test = 'stuff hidden';  

    
    var _getTopScope = function() {
      return $rootScope;
      //return angular.element(document).scope();
    };

    $rootScope.ready = function() {
      var $scope = _getTopScope();
      $scope.status = 'ready';
      if(!$scope.$$phase) $scope.$apply();
    };
    $rootScope.loading = function() {
      var $scope = _getTopScope();
      $scope.status = 'loading';
      if(!$scope.$$phase) $scope.$apply();
    };
    $rootScope.$on('$routeChangeStart', function() {
      _getTopScope().loading();
    });


});


// VIDEOS CONTROLLER

potatoNews.controller('VideosCtrl', ['$scope', '$http', 'trends', function($scope, $http, trends) {
   
    $scope.trends = trends.trends;

    console.log(' $scope.trends  =  ', $scope.trends);

      var timeout = 2000;

      setTimeout(function() {

        $scope.ready();
      }, timeout);

  }]);





// new TRENDS CONTROLLER

potatoNews.controller('TrendCtrl', ['$scope', '$http', 'slow', 'trends', '$rootScope', function($scope, $http, isSlow, trends, $rootScope) {
    
// set your variables here

        console.log(' ~~~~~~~ $rootScope.test  =', $rootScope.test); 
        $scope.trends = trends.trends;
        $scope.title = '';

  
        var timeout = isSlow ? 2000 : 1;

          setTimeout(function() {
            var feed = data['feed'];
            var entries = feed['entry'];
            $scope.videos = [];

            $scope.ready();
          }, timeout);


  }]);




// TRENDS CONTROLLER

// potatoNews.controller('TrendCtrl', ['$scope', 'trends', '$rootScope', 
//     function($scope, trends, $rootScope) {

//         console.log(' ~~~~~~~ $rootScope.test  =', $rootScope.test); 
//         $scope.trends = trends.trends;
//         $scope.title = '';
//         // console.log(' $scope contacts = ', $scope.contacts);

//         $scope.ready();

//         $('.nobullets').on("click", ".trendli", function(e) {
//             var text = ($(this).text());
//             $('#searchInput').val(text);
//             $scope.$apply(function() {
//                 // console.log(' inside the click trend li 1st ');
//             });
//         });
//         $('.form-group').on("change", ".searchInput", function(e) {
//             var text = ($(this).text());
//             $('#searchInput').val(text);
//             $scope.$apply(function() {
//                 console.log(' inside the search bar ');
//             });
//         });
//     }
// ]);







// yt CONTROLLER
potatoNews.controller('youtubeCtrl', ['$scope', 'ytfac',
    function($scope, ytfac) {
        $scope.items = ytfac.ytfac.items;
        console.log(' ~~~ inside the   youtubeCtrl  Controller');
        // console.log(' controller $scope.things = ', $scope.things);        
        // console.log('  $scope.items = ', $scope.items);
        $scope.ylinks = ['v5Asedlj2cw', 'vRC64LiJdvo', 'p8xUVO74YDU'];
        $scope.product = {
            medium: $scope.ylinks
        };
        $scope.getIframeSrc = function(src) {
            // console.log(' ~~~~~ callign getIframe Scr = ~~~~ ',src);
            return 'https://www.youtube.com/embed/' + src;
        };
        $scope.grablink = function() {
            console.log(' ~~~~~ callign grablink = ~~~~ ');
        };
    }
]);



// yt FACTORY 
var potatoNews = angular.module('potatoNews');

potatoNews.factory('ytfac', ['$http', function($http) { // new trend factory
    console.log(' inside the ycfac factory  ~~~~~~~~~~~~~ line 167 ');
    // debugger;
    var o = {
        ytfac: [],
        idfac: []
    };

    o.getAll = function() {
        console.log('calling  yt  getAll ');
        return $http.get('/youtube').success(function(data) {
            console.log('/youtube   data = ', data);            
            angular.copy(data, o.ytfac);
        });
    };



    o.get = function(id) {
         o.idfac.length = 0
        console.log(' ~~~~~~~~~ calling  yt.get with id  --- line  185 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  id= ',id);
        return $http.get('/youtube/' + id).then(function(data) {
            angular.copy(data, o.idfac);
            console.log(' !!!!!! get copied data = ', data);
            console.log(' !!!!!! get 186 ~~ o.idfac = ',  o.idfac);            
        });
    };

    return o;
}]);







// Trends FACTORY 
var potatoNews = angular.module('potatoNews');

potatoNews.factory('trends', ['$http', function($http) { // new trend factory
    // debugger;
    var o = {
        trends: []
    };

    o.getAll = function() {
        $http.get('/trends').success(function(data) {
            angular.copy(data, o.trends);

            // console.log(' !!!!!! get 212 ~~ o.trends = ',  o.trends);             
        });
    };
    //grab a single post from the server
    return o;
}]);




// MAIN / POSTS  CONTROLLER

// potatoNews.controller('MainCtrl', [
//     '$scope',
//     'posts',
//     function($scope, posts) {

//         $scope.posts = posts.posts;
//         //setting title to blank here to prevent empty posts
//         $scope.title = '';

//         $scope.addPost = function() {
//             if ($scope.title === '') {
//                 return;
//             }
//             posts.create({
//                 title: $scope.title,
//                 link: $scope.link,
//             });
//             //clear the values
//             $scope.title = '';
//             $scope.link = '';
//         };

//         $scope.upvote = function(post) {
//             //our post factory has an upvote() function in it
//             //we're just calling this using the post we have
//             console.log(' calling upvote for post');
//             posts.upvote(post);
//         }
//         $scope.downvote = function(post) {
//             posts.downvote(post);
//         };

//     }
// ]);


// COMMENTS  CONTROLLER 

// potatoNews.controller('PostsCtrl', [
//     '$scope',
//     'posts',
//     'post',
//     function($scope, posts, post) {
//         //used to need $stateRouterProvider to figure out what
//         //specific post we're grabbing.  Since we used the resolve object to
//         //refer to the posts.get() function and assigned it to the post value
//         //then injected that here, we now have the specific post from the db
//         //we also inject 'posts' so we can screw with the comments
//         $scope.post = post;

//         $scope.addComment = function() {
//             if ($scope.body === '') {
//                 return;
//             }
//             posts.addComment(post._id, {
//                 body: $scope.body,
//                 author: 'user',
//             }).success(function(comment) {
//                 $scope.post.comments.push(comment);
//             });
//             $scope.body = '';
//         };

//         $scope.upvote = function(comment) {
//             posts.upvoteComment(post, comment);
//         };

//         $scope.downvote = function(comment) {
//             posts.downvoteComment(post, comment);
//         };

//     }
// ]);


// Underscore FACTORY 
var potatoNews = angular.module('potatoNews');

potatoNews.factory('_', ['$http', function($http) { // new trend factory
    // debugger;
    return window._;

}]);



// POSTS FACTORY 

// potatoNews.factory('posts', ['$http', function($http) {
//     var o = {
//         posts: []
//     };
//     //query the '/posts' route and, with .success(),
//     //bind a function for when that request returns
//     //the posts route returns a list, so we just copy that into the
//     //client side posts object
//     //using angular.copy() makes ui update properly
//     o.getAll = function() {
//         return $http.get('/posts').success(function(data) {
//             angular.copy(data, o.posts);
//         });
//     };
//     //now we'll need to create new posts
//     //uses the router.post in index.js to post a new Post mongoose model to mongodb
//     //when $http gets a success back, it adds this post to the posts object in
//     //this local factory, so the mongodb and angular data is the same
//     //sweet!
//     o.create = function(post) {
//         return $http.post('/posts', post).success(function(data) {
//             o.posts.push(data);
//         });
//     };
//     //upvotes
//     o.upvote = function(post) {
//         //use the express route for this post's id to add an upvote to it in the mongo model
//         return $http.put('/posts/' + post._id + '/upvote')
//             .success(function(data) {
//                 //if we know it worked on the backend, update frontend
//                 console.log(' inside o update posts ');
//                 post.votes += 1;
//             });
//     };
//     //downvotes
//     o.downvote = function(post) {
//         return $http.put('/posts/' + post._id + '/downvote')
//             .success(function(data) {
//                 post.votes -= 1;
//             });
//     };
//     //grab a single post from the server
//     o.get = function(id) {
//         //use the express route to grab this post and return the response
//         //from that route, which is a json of the post data
//         //.then is a promise, a kind of newly native thing in JS that upon cursory research
//         //looks friggin sweet; TODO Learn to use them like a boss.  First, this.
//         return $http.get('/posts/' + id).then(function(res) {
//             return res.data;
//         });
//     };
//     //comments, once again using express
//     o.addComment = function(id, comment) {
//         return $http.post('/posts/' + id + '/comments', comment);
//     };
//     //upvote comments
//     o.upvoteComment = function(post, comment) {
//         return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
//             .success(function(data) {
//                 comment.votes += 1;
//             });
//     };
//     //downvote comments
//     //I should really consolidate these into one voteHandler function
//     o.downvoteComment = function(post, comment) {
//         return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote')
//             .success(function(data) {
//                 comment.votes -= 1;
//             });
//     };
//     return o;
// }]);




//  setting up the snapshot 


  App = angular.module('App', []);



  App.run(['$rootScope', function($rootScope) {
    var _getTopScope = function() {
      return $rootScope;
      //return angular.element(document).scope();
    };

    $rootScope.ready = function() {
      var $scope = _getTopScope();
      $scope.status = 'ready';
      if(!$scope.$$phase) $scope.$apply();
    };
    $rootScope.loading = function() {
      var $scope = _getTopScope();
      $scope.status = 'loading';
      if(!$scope.$$phase) $scope.$apply();
    };
    $rootScope.$on('$routeChangeStart', function() {
      _getTopScope().loading();
    });
  }]);


  

// end of setting up the snapshot 







})();
