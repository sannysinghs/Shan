var app = angular.module('shan.controllers');

app.controller('AuthCtrl', ['$scope','$http','$rootScope','$window','LocalStorageService','ShanUtils','ShanConstant' ,function ($scope,$http,$rootScope,$window,LocalStorageService,ShanUtils,ShanConstant) {
	
	$scope.login = function(user){
		$scope.user = user;
		if ($scope.user.email == null || $scope.user.email == 'undefined' && $scope.user.password == null || $scope.user.password == 'undefined') {
			$scope.err = "error";
			return;
		}
		$http.post(ShanConstant.SERVER.LOGIN,{"email" : $scope.user.email , "password" : $scope.user.password })
		.success(function(result){
			if (result.status === 'failed') {
				$scope.err = result.message;
				return;
			}
			LocalStorageService.saveItem("current_user",JSON.stringify(result.user));

			//redirect to profile
			ShanUtils.redirectTo(ShanConstant.URL.USER.PROFILE);
			// $window.location.href = $rootScope.url+"#/user/profile/";

		})
		.error(function(result){

		});

		$scope.user = {};
	};

	$scope.signup = function(user){
		$scope.user = user;
		$http.post($rootScope.url+"/users",{'user' : $scope.user}).success(function(success){
			ShanUtils.redirectTo(ShanConstant.URL.AUTH.LOGIN);
			// $window.location.href = $rootScope.url + "#/auth/login";	
		}).error(function(result){
			$scope.error = result;
		});	
		$scope.user = {};
	};

	$scope.logout = function(){
		LocalStorageService.removeItem('current_user');
	};


}]);

