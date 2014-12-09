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
      });

      
      $urlRouterProvider.otherwise("/home");

}]);