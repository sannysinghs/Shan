var app = angular.module('shan.controllers', ['shan.services']);

app.run(['$rootScope','SocketService','ShanConstant', function ($rootScope,SocketService,ShanConstant) {
	SocketService.createInstance(ShanConstant.URL.MAIN);
}]);

app.controller('HomeCtrl', ['$scope','$rootScope','$window','LocalStorageService','ShanConstant','ShanUtils', function ($scope,$rootScope,$window,LocalStorageService,ShanConstant,ShanUtils) {
	
	if ( !LocalStorageService.getItem('current_user') ) {
		ShanUtils.redirectTo(ShanConstant.URL.AUTH.LOGIN);
		return;
	}
	
	
	ShanUtils.redirectTo(ShanConstant.URL.USER.PROFILE);
}]);

