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
		"GAME" : "/#/room/play"
	},

	"USER" : {
		"CURRENT_USER" : "current_user",
		"PLAYER_INDEX" : "current_player_index_in_room",
		"ROOM_INDEX" : "current_player_room"
	},

	"SERVER" : {
		"LOGIN" : "/auth/login",
		"ROOMS" : "/rooms",
		"SIGNUP" : "/users",
		"USERS" : "/users/"
	}
	
});
app.factory('ShanUtils', ['$window','$http','$q',function ($window,$http,$q) {
	

	return {
		redirectTo : function(url){
			$window.location.href = url;
		}
	};
}]);
