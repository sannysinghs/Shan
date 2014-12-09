var app = angular.module('Shan', ['ui.router','ui.bootstrap','shan.controllers']);

app.config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
      $stateProvider
      	.state('home', {
            url: "/home",
            templateUrl: "templates/home.html",
            controller : "HomeCtrl"
        })
	.state('login',{
		url : "/login",
		templateUrl : "templates/login.html",
		controller : "LoginCtrl"
	})
      .state('signup',{
            url : "/signup",
            templateUrl : "templates/signup.html",
            controller : "SignupCtrl"
      });
      $urlRouterProvider.otherwise("/home");

}]);