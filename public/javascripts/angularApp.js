var app = angular.module('flapperNews', ['ui.router']);

app.factory('posts', ['$http', function($http){
    //service body
    var o = {
      posts: [

      ]
    };

    o.getAll = function() {
      return $http.get('/posts').success(function(data){
        angular.copy(data, o.posts);
      });
    };

    o.create = function(post) {
      return $http.post('/posts', post).success(function(data){
        o.posts.push(data);
      });
    };

    o.upvote = function(post) {
      return $http.put('/posts/' + post._id + '/upvote')
        .success(function(data) {
          post.upvotes += 1;
        });
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
      controller: 'MainCtrl' /*,
      resolve: {
        postpromise: ['posts', function(posts) {
          return posts.getAll();
        }]
      } */
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
    '$http',
    function($scope, posts, $http) {
      $scope.test = 'Hello World!';

      $scope.posts = posts.getAll();

      $scope.addPost = function() {
        if (!$scope.title || $scope.title === '') { return; }
        posts.create({
          title: $scope.title,
          link: $scope.link
        });
        $scope.title = '';
        $scope.link = '';
      };

      $scope.incrementUpvotes = function(post) {
        posts.upvote(post);
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
