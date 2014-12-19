var app = angular.module('Shan', ['ui.router','ui.bootstrap','shan.controllers']);

app.config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
      $stateProvider
      
      .state('home', {
            url: "/home",
            templateUrl: "/app/templates/home.html",
            controller : "HomeCtrl"
        })

	.state('login',{
		url : "/auth/login",
            templateUrl : "/app/templates/login.html",
		controller : "AuthCtrl"
	})
      .state('signup',{
            url : "/auth/signup",
            templateUrl : "/app/templates/signup.html",
            controller : "AuthCtrl"
      })
      .state('profile',{
            url : "/user/profile",
            templateUrl : "/app/templates/user/profile.html",
            controller : "UserCtrl"
      })
      .state('room',{
            url : "/room",
            resolve :{
                  RoomPromiseObj : function($http){
                    return $http({method: 'GET', url: '/rooms'});
                  }
            },
            templateUrl : "/app/templates/room/room.html",
            controller : "RoomCtrl", 
      })
      .state('room.play',{
            url : "/play",
            templateUrl : "/app/templates/room/game.html",
            controller : "GameCtrl"
      });
      $urlRouterProvider.otherwise("/home");

}]);