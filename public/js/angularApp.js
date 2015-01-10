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


        $stateProvider
            .state('trend', { // */*/*/*/   new 
                url: '/trend',
                templateUrl: '/trend.html',
                controller: 'TrendCtrl',
                resolve: {
                    postPromise: ['trends', function(trends) {
                        return trends.getAll();
                    }]
                }
            })


        $stateProvider
            .state('robots', { // */*/*/*/   new 
                url: '/robots.txt',
                templateUrl: '/robots.txt'
                    // controller: 'hola'
            })


        .state('trend.detail', {
            url: '/:id',
            // loaded into ui-view of parent's template
            templateUrl: 'yt.detail.html',

            controller: 'idCtrl',
            resolve: {

                ytPromise: ['$stateParams', 'ytfac', function($stateParams, ytfac) {
                    return ytfac.get($stateParams.id);
                }],

                tweetsPromise: ['$stateParams', 'tweets', function($stateParams, tweets) {
                    return tweets.get($stateParams.id);
                    // return tweets.getAll();                    
                }]
            }
        })

        $urlRouterProvider.otherwise('trend');
    }
]);




// id controller


potatoNews.controller('idCtrl', ['$scope', '$state', '$window', '$stateParams', 'ytfac', '_', 'Instagram', '$interval', '$http',

    function($scope, $state, $window, $stateParams, ytfac, _, Instagram, $interval, $http) {

        // $scope.person = $scope.contacts[$stateParams.id];
        console.log("line 80 --- $$$$$$$$$$$  $stateParams.id  =", $stateParams.id);

        // showing tweets
        // console.log('tweets line 89  = ', tweets);
        $scope.tweetArr; 
       
        get_tweets = function(id) {
            console.log('  === callign get tweets');
            // o.trends.length = 0
            console.log(' ~~~~~~~~~ calling  tweets with id  line  94 ~~~~~~~~~~~~  id= ', id);
            return $http.get('/tweets/' + id).success(function(record) {
                console.log(' >>>>>> tweets 95 = ', record.tweetArr);
                $scope.tweetArr = record.tweetArr; 
            });
        };
        get_tweets($stateParams.id); 



        // end showing tweets

        console.log(' ytfac from the factory  !!!!!!!!!!!!!!!!  ytfac.idfac', ytfac.idfac);

        // $scope.ylinks = ['v5Asedlj2cw', 'vRC64LiJdvo', 'p8xUVO74YDU'];

        // grabing the items from response factory 
        $scope.ytfac = ytfac.idfac.data.items;
        console.log('----->>> ytfac from the factory  !!!!!!!!!!!!!!!! returning  ytfac.idfac', $scope.ytfac);
        var pluck = _.pluck($scope.ytfac, 'id');
        var pluck = _.pluck(pluck, 'videoId');

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
        //refresh the view 
        $scope.refreshView = function() {
            console.log(' clicked refresh View');
        };
        // end refresh the view 
        // instagram
        $scope.example1 = {
            hash: $stateParams.id
        };


        var instagramSuccess = function(scope, res) {
            if (res.meta.code !== 200) {
                scope.error = res.meta.error_type + ' | ' + res.meta.error_message;
                return;
            }
            if (res.data.length > 0) {
                scope.items = res.data;
            } else {
                scope.error = "This hashtag has returned no results";
            }
        };


        function loadInstagram() {
            Instagram.get(12, $stateParams.id).success(function(response) {
                console.log(' instagram  response  = ', response);
                console.log(' ~~~~~~~~~~~~~~~ $scope.example1 =', $scope.example1);
                instagramSuccess($scope.example1, response);
                $state.reload();
            });
        };

        loadInstagram();

    }
]);




// //  tweets factory 

var potatoNews = angular.module('potatoNews');

potatoNews.factory('tweets', ['$http', function($http) { // new trend factory

    console.log(' inside the tweets factory  ~~~~~~~~~~~~~ line 31567 ');
    var o = {
        trends: []
    };

    o.getAll = function() {
        $http.get('/trends').success(function(data) {
            angular.copy(data, o.trends);

            console.log(' !!!!!! get 175 ~~ o.trends = ', o.trends);
        });
    };


    o.get = function(id) {
        o.trends.length = 0
        console.log(' ~~~~~~~~~ calling  tweets with id  line  177 ~~~~~~~~~~~~~~~~~~~~  id= ', id);
        return $http.get('/youtube/' + id).then(function(data) {
            angular.copy(data, o.idfac);
            console.log(' !!!!!! get tweets 180 = ', data);
            console.log(' !!!!!! get tweets  181 ~~ o.tweet = ', o.trends);
        });
    };




    //grab a single post from the server
    return o;
}]);





// // Trends FACTORY 
// var potatoNews = angular.module('potatoNews');

// potatoNews.factory('trends', ['$http', function($http) { // new trend factory
//     // debugger;
//     var o = {
//         trends: []
//     };

//     o.getAll = function() {
//         $http.get('/trends_2').success(function(data) {
//             angular.copy(data, o.trends);

//             console.log(' !!!!!! get 385 ~~ o.trends = ',  o.trends);             
//         });
//     };
//     //grab a single post from the server
//     return o;
// }]);









// wiki FACTORY 
var potatoNews = angular.module('potatoNews');

potatoNews.factory('wiki', ['$http', function($http) { // new trend factory
    console.log(' inside the ycfac factory  ~~~~~~~~~~~~~ line 167 ');
    // debugger;
    var o = {
        ytfac: [],
        idfac: []
    };


    o.get = function(id) {
        o.idfac.length = 0
        console.log(' ~~~~~~~~~ calling  yt.get with id  --- line  185 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  id= ', id);
        return $http.get('/youtube/' + id).then(function(data) {
            angular.copy(data, o.idfac);
            console.log(' !!!!!! get copied data 239 = ', data);
            console.log(' !!!!!! get 240 wiki ~~ o.idfac = ', o.idfac);
        });
    };

    return o;
}]);







//  insta factory 
var potatoNews = angular.module('potatoNews');

potatoNews.factory('Instagram', ['$http',

    function($http) {
        var base = "https://api.instagram.com/v1";
        // get your own client id http://instagram.com/developer/
        var clientId = '1596378b366a469b90c50096477ac00c';
        return {
            'get': function(count, hashtag) {
                var request = '/tags/' + hashtag + '/media/recent';
                var url = base + request;
                var config = {
                    'params': {
                        'client_id': clientId,
                        'count': count,
                        'callback': 'JSON_CALLBACK'
                    }
                };
                return $http.jsonp(url, config);
            }
        };
    }
]);









// TRENDS CONTROLLER

potatoNews.controller('TrendCtrl', ['$scope', 'trends',
    function($scope, trends) {

        $scope.trends = trends.trends;


        $('.nobullets').on("click", ".trendli", function(e) {
            var text = ($(this).text());
            $('#searchInput').val(text);
            $scope.$apply(function() {
                // console.log(' inside the click trend li 1st ');
            });
        });

        $('.form-group').on("change", ".searchInput", function(e) {
            var text = ($(this).text());
            $('#searchInput').val(text);
            $scope.$apply(function() {
                console.log(' inside the search bar ');
            });
        });


    }
]);


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
        console.log(' ~~~~~~~~~ calling  yt.get with id  --- line  185 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  id= ', id);
        return $http.get('/youtube/' + id).then(function(data) {
            angular.copy(data, o.idfac);
            console.log(' !!!!!! get copied data  378  ytfac = ', data);
            console.log(' !!!!!! get 379 ytfac ~~ o.idfac = ', o.idfac);
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

            console.log(' !!!!!! get 385 ~~ o.trends = ', o.trends);
        });
    };
    //grab a single post from the server
    return o;
}]);









// Underscore FACTORY 
var potatoNews = angular.module('potatoNews');

potatoNews.factory('_', ['$http', function($http) { // new trend factory
    // debugger;
    return window._;

}]);
