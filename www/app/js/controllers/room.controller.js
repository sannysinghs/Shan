var app = angular.module('shan.controllers');
app.controller('RoomCtrl', ['$rootScope','$scope','ShanConstant', 'SocketService','LocalStorageService','ShanUtils','$http' ,'RoomPromiseObj', function ($rootScope,$scope,ShanConstant,SocketService,LocalStorageService,ShanUtils,$http,RoomPromiseObj) {
	console.log('Start Game Controller');

	if (RoomPromiseObj.statusText !== 'OK') {
		return ;
	}
	
	// if (LocalStorageService.getItem(ShanConstant.USER.ROOM_INDEX)) {
	// 	return;
	// }


	$rootScope.rooms = RoomPromiseObj.data;

	$scope.JoinRoom = function(index){
		var room = $rootScope.rooms[index];
		
		var player = {
			"_id" : $rootScope.current_user._id,
			"name" : $rootScope.current_user.name,
			"email" : $rootScope.current_user.email,
			"cash" :  $rootScope.current_user.cash || 0,
			"draw" : false,
			"score" : {} //player total pt [pt,double/triple]
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
			SocketService.emit("remove room",{room : index},function(){});
		}).error(function(result){

		});	
	};
	
	SocketService.on('new room',function(socket,data){
		$rootScope.rooms.push(data.room);
	});

	SocketService.on('remove room',function(socket,data){
		$rootScope.rooms.splice(data.room,1);
	});


	//notify the everyone else in same room about new player 
	SocketService.on('update room',function(socket,data){
		console.log(JSON.parse(data));
	});

	//update global room's players in everyone including sender
	SocketService.on('newbee',function(socket,data){
		console.log('Received new bee');
		$rootScope.rooms[data.index].players.push(JSON.parse(data.player));
		console.log($rootScope.rooms);
		
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
