var app = angular.module('shan.services', []);
app.constant('ShanConstant', {
	"URL" : {
		"MAIN" : "http://localhost:3001",
		"AUTH" : {
			"REGISTER" : "http://localhost:3001/#/auth/signup",
			"LOGIN" : 	"http://localhost:3001/#/auth/login"
		},
		"USER" : {
			"PROFILE" : "http://localhost:3001/#/user/profile"
		}
	},

	"USER" : {
		"CURRENT_USER" : "current_user"
	},

	"SERVER" : {
		"LOGIN" : "http://localhost:3001/auth/login"
	}
	
});
app.factory('ShanUtils', ['$window',function ($window) {
	

	return {
		redirectTo : function(url){
			$window.location.href = url;
		} 		
	};
}]);
