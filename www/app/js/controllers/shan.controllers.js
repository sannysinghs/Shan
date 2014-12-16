var app = angular.module('shan.controllers', ['shan.services']);

app.run(['$rootScope','SocketService','ShanConstant','LocalStorageService','$http', function ($rootScope,SocketService,ShanConstant,LocalStorageService,$http) {
	//Initialize the socket on defualt namespace
	SocketService.createInstance(ShanConstant.URL.MAIN);
	//Initialize current_user for globally use
	$rootScope.current_user = JSON.parse(LocalStorageService.getItem(ShanConstant.USER.CURRENT_USER));
	//Initialize the rooms as global var
	$http.get("/rooms").success(function(result){
		$rootScope.rooms = result;
		
	}).error(function(error){
		console.log('Error fetching rooms');
	});
	
}]);

app.controller('HomeCtrl', ['$scope','$rootScope','$window','LocalStorageService','ShanConstant','ShanUtils', function ($scope,$rootScope,$window,LocalStorageService,ShanConstant,ShanUtils) {
	
	if ( !LocalStorageService.getItem('current_user') ) {
		ShanUtils.redirectTo(ShanConstant.URL.AUTH.LOGIN);
		return;
	}
	
	
	ShanUtils.redirectTo(ShanConstant.URL.USER.PROFILE);
}]);

