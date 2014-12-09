var app = angular.module('shan.controllers', ['shan.services']);

app.run(['$rootScope', function ($rootScope) {
	
}]);

app.controller('HomeCtrl', ['$scope','$rootScope','$window','LocalStorageService','ShanConstant','ShanUtils', function ($scope,$rootScope,$window,LocalStorageService,ShanConstant,ShanUtils) {
	
	if ( !LocalStorageService.getItem('current_user') ) {
		// $window.location.href = $rootScope.url + "/#/auth/login";
		// 
		ShanUtils.redirectTo(ShanConstant.URL.AUTH.LOGIN);
		return;
	}
	// $window.location.href = $rootScope.url + "/#/user/profile";	
	ShanUtils.redirectTo(ShanConstant.URL.USER.PROFILE);
}]);

