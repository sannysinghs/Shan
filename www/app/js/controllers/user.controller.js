var app = angular.module('shan.controllers');
app.run(['$rootScope', '$window','LocalStorageService' ,'ShanConstant','ShanUtils',function ($rootScope,$window,LocalStorageService,ShanConstant,ShanUtils) {
	if (!LocalStorageService.getItem(ShanConstant.USER.CURRENT_USER)) {
		ShanUtils.redirectTo(ShanConstant.URL.AUTH.LOGIN);
		return;
	}
	
}]);

app.controller('UserCtrl', ['$scope','LocalStorageService','ShanConstant','ShanUtils', function ($scope,LocalStorageService,ShanConstant,ShanUtils) {
	
	$scope.user = JSON.parse(LocalStorageService.getItem(ShanConstant.USER.CURRENT_USER));

	$scope.logout = function(){
		LocalStorageService.removeItem(ShanConstant.USER.CURRENT_USER);
		ShanUtils.redirectTo(ShanConstant.URL.AUTH.LOGIN);
	};



}]);
