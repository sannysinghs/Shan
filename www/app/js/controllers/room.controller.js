var app = angular.module('shan.controllers');
app.run(['$rootScope','GameService',function ($rootScope,GameService) {
	$rootScope.rooms = [
		{
			"name" : "Room 1",
			"user" : "Niko",
			"level" : "pro",
			"players" : []
		}
	];
}]);

app.controller('RoomCtrl', ['$rootScope','$scope','ShanConstant', 'SocketService','LocalStorageService','ShanUtils' , function ($rootScope,$scope,ShanConstant,SocketService,LocalStorageService,ShanUtils) {

	$scope.join = function(index){
		var user = JSON.parse(LocalStorageService.getItem(ShanConstant.USER.CURRENT_USER));
		var player = {
			"_id" : user._id,
			"name" : user.name,
			"email" : user.email,
			"draw" : false,
			"card" : []
		};
		SocketService.emit('newbee',{ player : JSON.stringify(player), room : index},function(socket,data){});
		ShanUtils.redirectTo(ShanConstant.URL.GAME);

	};

	SocketService.on('newbee',function(socket,data){
		$rootScope.rooms[data.room].players.push(JSON.parse(data.player));
	});


}]);
