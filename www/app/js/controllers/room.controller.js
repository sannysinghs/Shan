var app = angular.module('shan.controllers');

app.run(['$rootScope','$http','GameService','ShanConstant',function ($rootScope,$http,GameService,ShanConstant) {
	
	$http.get("/rooms").success(function(result){
		$rootScope.rooms = result;
	
	}).error(function(error){
		console.log('Error fetching rooms');
	});
}]);

app.controller('RoomCtrl', ['$rootScope','$scope','ShanConstant', 'SocketService','LocalStorageService','ShanUtils','$http' , function ($rootScope,$scope,ShanConstant,SocketService,LocalStorageService,ShanUtils,$http) {


	// SocketService.emit('join room',{},function(socket,data){});
	
	// SocketService.on('join room',function(socket,data){
	// 	// console.log(data);
	// });

		console.log($rootScope.current_user);
	$scope.JoinRoom = function(index){
		var room = $rootScope.rooms[index];

		var player = {
			"_id" : $rootScope.current_user._id,
			"name" : $rootScope.current_user.name,
			"email" : $rootScope.current_user.email,
			"cash" : $rootScope.current_user.cash || 0,
			"draw" : false,
			"card" : []
		};

		//update players array in server
		$http.post("/rooms/players",{'player_id' : player._id , 'room_id' : room._id}).success(function(result){
			
			//sending message to everyone eles in same room 
			//Server will broadcast two messsage 
			SocketService.emit('newbee',{ "player" : JSON.stringify(player), "room" : room._id , "index" : index},function(socket,data){});
			LocalStorageService.saveItem("current_user_room",index);
			// Redirect to game.html and start play game
			ShanUtils.redirectTo(ShanConstant.URL.GAME);

		}).error(function(result){
			$scope.error = result;
		});

		
	};

	$scope.AddRoom = function(room){
		$scope.room = room;
		$scope.room.players = [];

		$http.post("/rooms",{'room' : $scope.room }).success(function(success){
			SocketService.emit('new room',{"room" : success},function(){});
		}).error(function(result){
			$scope.error = result;
		});	
		$scope.room = {};

	};

	$scope.RemoveRoom = function(index){
		var room = $rootScope.rooms[index];
		$http.delete('/rooms/'+room._id,{}).success(function(result){
			$rootScope.rooms.splice(index,1);
		}).error(function(result){

		});	
	};

	
	SocketService.on('new room',function(socket,data){
		$rootScope.rooms.push(data.room);
	});
	//update global room's players in everyone including sender
	SocketService.on('newbee',function(socket,data){
		var current_player_index = $rootScope.rooms[data.index].players.push(JSON.parse(data.player));
		LocalStorageService.saveItem('current_player_index',current_player_index-1);

	});

	//notify the everyone else in same room about new player 
	SocketService.on('update room',function(socket,data){
		console.log(JSON.parse(data));
	});

	// SocketService.on('leave room',function(socket,data){
	// 	// console.log('left user ');
	// 	var rPlayer = JSON.parse(data);
	// 	for (var i = 0; i < $rootScope.rooms[0].players.length; i++) {
	// 		var player =  $rootScope.rooms[0].players[i];
	// 		if (player._id == rPlayer._id) {
	// 			$rootScope.rooms[0].players.splice(i,1);
	// 			break;
	// 		}
	// 	}

	// });


}]);
