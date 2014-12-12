var app = angular.module('shan.services', []);
app.constant('ShanConstant', {
	"URL" : {
		"MAIN" : window.location.host,
		"AUTH" : {
			"REGISTER" : "/#/auth/signup",
			"LOGIN" : 	"/#/auth/login"
		},
		"USER" : {
			"PROFILE" : "/#/user/profile"
		},
		"ROOM" : "/#/room",
		"GAME" : "/#/game"
	},

	"USER" : {
		"CURRENT_USER" : "current_user"
	},

	"SERVER" : {
		"LOGIN" : "/auth/login",
		"ROOMS" : "/rooms",
		"SIGNUP" : "/users",
		"USERS" : "/users/"
	}
	
});
app.factory('ShanUtils', ['$window',function ($window) {
	

	return {
		redirectTo : function(url){
			$window.location.href = url;
		} 		
	};
}]);
