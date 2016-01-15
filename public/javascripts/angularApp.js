var app = angular.module('flapperNews', ['ui.router']);

app.factory('posts', [function(){
    //service body
    var o = {
      posts: [
        {
          title: 'First Title',
          link: 'First Link',
          upvotes: 0,
          comments: [
            {author: 'joe', body: 'Cool post', upvotes: 0},
            {author: 'bob', body: 'Nice!', upvotes: 0}
          ]
        }
      ]
    };
    return o;
}]);


app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/views/home.html',
      controller: 'MainCtrl'
    })

    .state('posts', {
      url: '/posts/:id',
      templateUrl: '/views/posts.html',
      controller: 'PostsCtrl'
    })

    .state('test', {
      url: '/test',
      templateUrl: '/views/test.html',
      controller: 'TestCtrl'
    });

  $urlRouterProvider.otherwise('home');
}]);

// Home
app.controller('MainCtrl', [
    '$scope',
    'posts',
    function($scope, posts) {
      $scope.test = 'Hello World!';

      $scope.posts = posts.posts;

      $scope.addPost = function() {
        if (!$scope.title || $scope.title === '') { return; }
        $scope.posts.push({
          title: $scope.title,
          link: $scope.link,
          upvotes: 0,
          comments: [
            {author: 'joe', body: 'Cool post', upvotes: 0},
            {author: 'bob', body: 'idiot', upvotes: 1}
          ]
        });
        $scope.title = '';
        $scope.link = '';
      };

      $scope.incrementUpvotes = function(post) {
        post.upvotes += 1;
      };
    }
]);

app.controller('TestCtrl', [
  '$scope',
  'posts',
  function($scope, posts) {
    $scope.test = 'wtf';
  }
]);

// Posts
app.controller('PostsCtrl', [
  '$scope',
  '$stateParams',
  'posts',
  function($scope, $stateParams, posts) {

    $scope.test = 'Hello?'
    $scope.post = posts.posts[$stateParams.id];

    $scope.addComment = function() {
      if($scope.body === '') { return; }
      $scope.post.comments.push({
        author: 'user',
        body: $scope.body,
        upvotes: 0
      });
      $scope.body = '';
    };

    $scope.incrementUpvotes = function(comment) {
      comment.upvotes += 1;
    };
  }
]);
