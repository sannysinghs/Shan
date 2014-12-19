var app = angular.module('shan.controllers', ['shan.services']);

app.run(['$rootScope','SocketService','ShanConstant','LocalStorageService','$http','GameService','ShanUtils',function ($rootScope,SocketService,ShanConstant,LocalStorageService,$http,GameService,ShanUtils) {
	//Initialize the socket on defualt namespace
	SocketService.createInstance(ShanConstant.URL.MAIN);
	//Initialize current_user for globally use
	$rootScope.current_user = JSON.parse(LocalStorageService.getItem(ShanConstant.USER.CURRENT_USER));
}]);

app.controller('HomeCtrl', ['$scope','$rootScope','$window','LocalStorageService','ShanConstant','ShanUtils', function ($scope,$rootScope,$window,LocalStorageService,ShanConstant,ShanUtils) {
	
	if ( !LocalStorageService.getItem('current_user') ) {
		ShanUtils.redirectTo(ShanConstant.URL.AUTH.LOGIN);
		return;
	}
	
	
	ShanUtils.redirectTo(ShanConstant.URL.USER.PROFILE);
}]);

