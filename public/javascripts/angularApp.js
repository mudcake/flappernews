var app = angular.module('flapperNews', ['ui.router']);

app.factory('postsFactory', ['$http', function($http){
    //service body
    var o = {
      posts: []
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

    o.get = function(id) {
      return $http.get('/posts/' + id).then(function(res){
        return res.data;
      });
    };

    o.addComment = function(id, comment) {
      return $http.post('/posts/' + id + '/comments', comment);
    };

    o.upvoteComment = function(post, comment) {
      return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
        .success(function(data) {
          comment.upvotes += 1;
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
      controller: 'MainCtrl',
      resolve: {
        postpromise: function(postsFactory) {
          return postsFactory.getAll();
        }
      }
    })

    .state('posts', {
      url: '/posts/:id',
      templateUrl: '/views/posts.html',
      controller: 'PostsCtrl',
      resolve: {
        post: function($stateParams, postsFactory) {
          return postsFactory.get($stateParams.id);
        }
      }
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
    'postsFactory',
    function($scope, postsFactory) {
      $scope.test = 'Hello World!';

      $scope.posts = postsFactory.posts;

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
  //'posts',
  function($scope) {
    $scope.test = 'wtf';
  }
]);

// Posts
app.controller('PostsCtrl', [
  '$scope',
  '$stateParams',
  'postsFactory',
  'post',
  function($scope, $stateParams, postsFactory, post) {

    $scope.test = 'Hello?'
    $scope.post = post;

    $scope.addComment = function() {
      if($scope.body === '') { return; }
      postsFactory.addComment(post._id, {
        body: $scope.body,
        author: 'user',
      }).success(function(comment) {
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };

    $scope.incrementUpvotes = function(comment) {
      postsFactory.upvoteComment(post, comment);
    };
  }
]);
