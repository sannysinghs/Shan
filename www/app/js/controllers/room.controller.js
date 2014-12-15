var app = angular.module('shan.controllers');

app.controller('RoomCtrl', ['$rootScope','$scope','ShanConstant', 'SocketService','LocalStorageService','ShanUtils','$http' , function ($rootScope,$scope,ShanConstant,SocketService,LocalStorageService,ShanUtils,$http) {

	$http.get("/rooms").success(function(result){
		$rootScope.rooms = result;
		
	}).error(function(error){
		console.log('Error fetching rooms');
	});

	// SocketService.emit('join room',{},function(socket,data){});
	
	// SocketService.on('join room',function(socket,data){
	// 	// console.log(data);
	// });

	$scope.JoinRoom = function(index){
		var room = $rootScope.rooms[index];
		
		var player = {
			"_id" : $rootScope.current_user._id,
			"name" : $rootScope.current_user.name,
			"email" : $rootScope.current_user.email,
			"cash" :  $rootScope.current_user.cash || 0,
			"draw" : false,
			"card" : []
		};

		//update players array in server
		$http.post("/rooms/players",{'player_id' : player._id , 'room_id' : room._id}).success(function(result){
			
			//Save player_index in room and room_index 
			LocalStorageService.saveItem(ShanConstant.USER.ROOM_INDEX,index);
			LocalStorageService.saveItem(ShanConstant.USER.PLAYER_INDEX,$rootScope.rooms[index].players.length);

			//sending message to everyone eles in same room 
			//Server will broadcast back two messsage 
			SocketService.emit('newbee',{ "player" : JSON.stringify(player), "room" : room._id , "index" : index},function(socket,data){});
			//Start play
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

	//notify the everyone else in same room about new player 
	SocketService.on('update room',function(socket,data){
		console.log(JSON.parse(data));
	});

	//update global room's players in everyone including sender
	SocketService.on('newbee',function(socket,data){
		console.log('Received new bee');
		$rootScope.rooms[data.index].players.push(JSON.parse(data.player));
		
	});

	SocketService.on('newbee leave',function(socket,data){
		console.log('newbee leave');
		$rootScope.rooms[data.rIndex].players.splice(data.pIndex,1);
	});

	SocketService.on('update index on newbee leave',function(socket,data){
		var cIndex = parseInt(LocalStorageService.getItem(ShanConstant.USER.PLAYER_INDEX));
		if (cIndex > data.pIndex  ) {
			LocalStorageService.saveItem(ShanConstant.USER.PLAYER_INDEX,cIndex-1);
		}
	});

}]);
