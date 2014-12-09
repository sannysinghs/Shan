var app = angular.module('shan.controllers', []);

app.run(['$rootScope', function ($rootScope) {
	$rootScope.url = "http://localhost:3001";
}])

app.controller('HomeCtrl', ['$scope', function ($scope) {
	$scope.title = "Welcome page";

}]);

app.controller('LoginCtrl', ['$scope','$http','$rootScope', function ($scope,$http,$rootScope) {
	$scope.login = function(user){
		$scope.user = user;
		if ($scope.user.email == null || $scope.user.email == 'undefined' && $scope.user.password == null || $scope.user.password == 'undefined') {
			$scope.err = "error";
			return;
		}
		$http.post($rootScope.url+'/auth/login',{"email" : $scope.user.email , "password" : $scope.user.password })
		.success(function(result){
			if (result.status === 'failed') {
				$scope.err = result.message;
				return;
			}
			console.log(result);
			window.location.href = $rootScope.url+"#/user/profile/";
		})
		.error(function(result){

		});

		$scope.user = {};
	}

}]);

app.controller('SignupCtrl', ['$scope','$http', '$rootScope',function ($scope,$http,$rootScope) {
	

	$scope.signup = function(user){
		$scope.user = user;
		$http.post($rootScope.url+"/users",{'user' : $scope.user}).success(function(success){
			window.location.href = $rootScope.url + "#/login";	
		}).error(function(result){
			$scope.error = result;
		});	
		$scope.user = {};
	}
}]);

