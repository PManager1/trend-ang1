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


        $stateProvider
            .state('trend', {    // */*/*/*/   new 
                url: '/trend',
                templateUrl: '/trend.html',
                controller: 'TrendCtrl',
                resolve: {
                    postPromise: ['trends', function(trends) {
                        return trends.getAll();
                    }]
                }
            })


            // .state('trend.yt', {
            //   url: "/yt",
            //   templateUrl: "yt.list.html",
            //   controller: 'youtubeCtrl',
            //     resolve: {
            //         postPromise: ['ytfac', function(ytfac) {
            //             return ytfac.getAll();
            //         }]
            //     }
            // })

            .state('trend.yt', {
              url: "youtube/:id",
              templateUrl: "yt.list.html",
              controller: 'youtubeCtrl',
                     resolve: {
                        post: ['$stateParams', 'ytfac', function ($stateParams, ytfac) {
                            return ytfac.get($stateParams.id);
                    }]
                }
            })

        $urlRouterProvider.otherwise('trend');
    }
]);


// yt CONTROLLER

potatoNews.controller('youtubeCtrl', ['$scope', 'ytfac',
    function($scope, ytfac) {
        $scope.items = ytfac.ytfac.items;
        console.log(' ~~~ inside the   youtubeCtrl  Controller');
        // console.log(' controller $scope.things = ', $scope.things);        
        // console.log('  $scope.items = ', $scope.items);
    $scope.ylinks =  ['v5Asedlj2cw','vRC64LiJdvo','p8xUVO74YDU'];
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
    console.log(' inside the ycfac factory  ~~~~~~~~~~~~~');
    // debugger;
    var o = {
        ytfac: []
    };

    o.getAll = function() {
            console.log( 'calling  yt  getAll ');
           return $http.get('/youtube').success(function(data) {
            angular.copy(data, o.ytfac);
        });
    };
    o.get = function (id) {
            id = 'nba';
            console.log(' ~~~~~~~~~ calling  yt.get with id  --- line  122 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            return $http.get('/youtube/' + id).then(function (data) {
            angular.copy(data, o.ytfac);
            console.log(' !!!!!! get copied data = ', data);
        });
    };

    return o;
}]);






// TRENDS CONTROLLER

potatoNews.controller('TrendCtrl', ['$scope', 'trends',
    function($scope, trends) {

        $scope.trends = trends.trends;
        $scope.title = '';

        $scope.contacts = [{
              id: 0,
              name: "Alice"
            }, {
              id: 1,
              name: "Bob"
            }];

            console.log(' $scope contacts = ',$scope.contacts);
    }
]);



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
        });
    };
        //grab a single post from the server
    return o;
}]);




// MAIN / POSTS  CONTROLLER

potatoNews.controller('MainCtrl', [
    '$scope',
    'posts',
    function($scope, posts) {

        $scope.posts = posts.posts;
        //setting title to blank here to prevent empty posts
        $scope.title = '';

        $scope.addPost = function() {
            if ($scope.title === '') {
                return;
            }
            posts.create({
                title: $scope.title,
                link: $scope.link,
            });
            //clear the values
            $scope.title = '';
            $scope.link = '';
        };

        $scope.upvote = function(post) {
            //our post factory has an upvote() function in it
            //we're just calling this using the post we have
            console.log(' calling upvote for post');
            posts.upvote(post);
        }
        $scope.downvote = function(post) {
            posts.downvote(post);
        };

    }
]);


// COMMENTS  CONTROLLER 

potatoNews.controller('PostsCtrl', [
    '$scope',
    'posts',
    'post',
    function($scope, posts, post) {
        //used to need $stateRouterProvider to figure out what
        //specific post we're grabbing.  Since we used the resolve object to
        //refer to the posts.get() function and assigned it to the post value
        //then injected that here, we now have the specific post from the db
        //we also inject 'posts' so we can screw with the comments
        $scope.post = post;

        $scope.addComment = function() {
            if ($scope.body === '') {
                return;
            }
            posts.addComment(post._id, {
                body: $scope.body,
                author: 'user',
            }).success(function(comment) {
                $scope.post.comments.push(comment);
            });
            $scope.body = '';
        };

        $scope.upvote = function(comment) {
            posts.upvoteComment(post, comment);
        };

        $scope.downvote = function(comment) {
            posts.downvoteComment(post, comment);
        };

    }
]);





// POSTS FACTORY 

potatoNews.factory('posts', ['$http', function($http) {
    var o = {
        posts: []
    };
    //query the '/posts' route and, with .success(),
    //bind a function for when that request returns
    //the posts route returns a list, so we just copy that into the
    //client side posts object
    //using angular.copy() makes ui update properly
    o.getAll = function() {
        return $http.get('/posts').success(function(data) {
            angular.copy(data, o.posts);
        });
    };
    //now we'll need to create new posts
    //uses the router.post in index.js to post a new Post mongoose model to mongodb
    //when $http gets a success back, it adds this post to the posts object in
    //this local factory, so the mongodb and angular data is the same
    //sweet!
    o.create = function(post) {
        return $http.post('/posts', post).success(function(data) {
            o.posts.push(data);
        });
    };
    //upvotes
    o.upvote = function(post) {
        //use the express route for this post's id to add an upvote to it in the mongo model
        return $http.put('/posts/' + post._id + '/upvote')
            .success(function(data) {
                //if we know it worked on the backend, update frontend
                console.log(' inside o update posts ');
                post.votes += 1;
            });
    };
    //downvotes
    o.downvote = function(post) {
        return $http.put('/posts/' + post._id + '/downvote')
            .success(function(data) {
                post.votes -= 1;
            });
    };
    //grab a single post from the server
    o.get = function(id) {
        //use the express route to grab this post and return the response
        //from that route, which is a json of the post data
        //.then is a promise, a kind of newly native thing in JS that upon cursory research
        //looks friggin sweet; TODO Learn to use them like a boss.  First, this.
        return $http.get('/posts/' + id).then(function(res) {
            return res.data;
        });
    };
    //comments, once again using express
    o.addComment = function(id, comment) {
        return $http.post('/posts/' + id + '/comments', comment);
    };
    //upvote comments
    o.upvoteComment = function(post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
            .success(function(data) {
                comment.votes += 1;
            });
    };
    //downvote comments
    //I should really consolidate these into one voteHandler function
    o.downvoteComment = function(post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote')
            .success(function(data) {
                comment.votes -= 1;
            });
    };
    return o;
}]);














