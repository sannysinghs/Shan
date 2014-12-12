var app = angular.module('shan.controllers');
app.run(['$rootScope','$http','GameService','ShanConstant',function ($rootScope,$http,GameService,ShanConstant) {
	$rootScope.rooms = [];
	$http.get("/rooms").success(function(result){
		$rootScope.rooms = result;
		// for (var i = 0; i < result.length; i++) {
		// 	$rootScope.rooms[result[i]._id] = result[i];
		// }
		console.log($rootScope.rooms);
	}).error(function(error){
		console.log('Error');
	});
}]);

app.controller('RoomCtrl', ['$rootScope','$scope','ShanConstant', 'SocketService','LocalStorageService','ShanUtils','$http' , function ($rootScope,$scope,ShanConstant,SocketService,LocalStorageService,ShanUtils,$http) {
	SocketService.emit('join room',{},function(socket,data){});
	SocketService.on('join room',function(socket,data){
		// console.log(data);
	});


	$scope.JoinRoom = function(index){
		var user = JSON.parse(LocalStorageService.getItem(ShanConstant.USER.CURRENT_USER));
		var room = $rootScope.rooms[index];
		var player = {
			"_id" : user._id,
			"name" : user.name,
			"email" : user.email,
			"draw" : false,
			"card" : []
		};
		//emit an event 
		SocketService.emit('newbee',{ "player" : JSON.stringify(player), "room" : room._id , "index" : index},function(socket,data){});
		//update players array in server

		$http.post("/rooms/players",{'player_id' : player._id , 'room_id' : room._id}).success(function(result){
			// Redirect to game.html
			ShanUtils.redirectTo(ShanConstant.URL.GAME);
			console.log(result);
		}).error(function(result){
			$scope.error = result;
		});	

		
	};

	$scope.AddRoom = function(room){
		$scope.room = room;
		$scope.room.players = [];

		$http.post("/rooms",{'room' : $scope.room }).success(function(success){
			$rootScope.rooms.push(success);
			console.log(success);
		}).error(function(result){
			$scope.error = result;
		});	
		$scope.room = {};
	};

	$scope.RemoveRoom = function(index){
		var room = $rootScope.rooms[index];
		$http.delete('/rooms/'+room._id,{}).success(function(result){
			console.log(result);
			$rootScope.rooms.spice(index,1);
		}).error(function(result){

		});	
	};

	SocketService.on('newbee',function(socket,data){
		$rootScope.rooms[data.index].players.push(JSON.parse(data.player));
	});

	SocketService.on('update room',function(socket,data){
		// console.log(JSON.parse(data));
	});

	SocketService.on('leave room',function(socket,data){
		// console.log('left user ');
		var rPlayer = JSON.parse(data);
		for (var i = 0; i < $rootScope.rooms[0].players.length; i++) {
			var player =  $rootScope.rooms[0].players[i];
			if (player._id == rPlayer._id) {
				$rootScope.rooms[0].players.splice(i,1);
				break;
			}
		}

	});


}]);
