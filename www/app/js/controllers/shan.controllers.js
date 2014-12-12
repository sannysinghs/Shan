var app = angular.module('shan.controllers', ['shan.services']);

app.run(['$rootScope','SocketService','ShanConstant','LocalStorageService', function ($rootScope,SocketService,ShanConstant,LocalStorageService) {
	SocketService.createInstance(ShanConstant.URL.MAIN);
	$rootScope.current_user = JSON.parse(LocalStorageService.getItem(ShanConstant.USER.CURRENT_USER));
}]);

app.controller('HomeCtrl', ['$scope','$rootScope','$window','LocalStorageService','ShanConstant','ShanUtils', function ($scope,$rootScope,$window,LocalStorageService,ShanConstant,ShanUtils) {
	
	if ( !LocalStorageService.getItem('current_user') ) {
		ShanUtils.redirectTo(ShanConstant.URL.AUTH.LOGIN);
		return;
	}
	
	
	ShanUtils.redirectTo(ShanConstant.URL.USER.PROFILE);
}]);

