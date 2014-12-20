var app = angular.module('shan.controllers');
app.controller('GameCtrl', ['$rootScope','$scope','LocalStorageService','ShanConstant','GameService','SocketService','$http','ShanUtils',
	function ($rootScope,$scope,LocalStorageService,ShanConstant,GameService,SocketService,$http,ShanUtils) {

	
	if(!LocalStorageService.getItem(ShanConstant.USER.ROOM_INDEX)){
		ShanUtils.redirectTo(ShanConstant.URL.ROOM);
		return;
	}

	$rootScope.cards = GameService.getCards();
	$scope.players = GameService.giveMeListOfPlayers(ShanConstant.USER.ROOM_INDEX);

	SocketService.on('drawcard',function(socket,data){
		$scope.players[data.id].card.push(data.card);
		$scope.players[data.id].score = GameService.calcScore($scope.players[data.id].card); //duplicate 
		$scope.players[data.id].draw = true;
	});

	SocketService.on('hold',function(socket,data){
		$scope.players[data.id].hold = true;
	});

	SocketService.on('start game',function(socket,data){
		// $scope.players[data.id].card = data.card;
		// $scope.players[data.id].score = GameService.calcScore(data.card); //duplicate 
		$scope.players = data.players;
		// $scope.banker = GameService.iniBanker($scope.players);
	});
 
	SocketService.on('disconnect me',function(socket,data){
		console.log('Left');
		// $scope.PlayerLeave(data.player);
	});

	$scope.isCurrentUser = function(id){
		return (id === $rootScope.current_user._id );
	};

	$scope.DrawCard = function(index){
		SocketService.emit('drawcard',{ id : index , card : $rootScope.cards.shift() },function(socket,data){});
	};

	$scope.Hold = function(index){
		SocketService.emit('hold',{ id : index  , room_id :  GameService.myRoomID() },function(socket,data){});	
	};

	$scope.StartGame = function(){
		for (var i = 0; i < $scope.players.length; i++) {
			$scope.players[i].card = $rootScope.cards.splice(0,2);
			$scope.players[i].score = GameService.calcScore($scope.players[i].card);
		}
		SocketService.emit('start game',{ "players" :  $scope.players },function(socket,data){});
	};


	$scope.initBanker = function(){
		$scope.players_copy = $scope.players;		
		$scope.banker = $scope.players_copy.pop();
		
	};

	$scope.LeaveGame = function() {
		
		var user   = $rootScope.current_user;
		var pIndex = LocalStorageService.getItem(ShanConstant.USER.PLAYER_INDEX);
		var rIndex = LocalStorageService.getItem(ShanConstant.USER.ROOM_INDEX);

		var room = $rootScope.rooms[rIndex];
		
		
		// Simply remove player in backend
		$http.delete('/rooms/players/'+room._id+'/'+user._id,{}).success(function(result){
			// Say everyone including me that i am out 
			SocketService.emit('newbee leave',{"room" : room._id,"player" : user._id,"rIndex" : rIndex , "pIndex" : pIndex},function(socket,data){});
			//Leave completely from a game and also from current room
			LocalStorageService.removeItem(ShanConstant.USER.PLAYER_INDEX);
			LocalStorageService.removeItem(ShanConstant.USER.ROOM_INDEX);
			//go back to room and find another room
			ShanUtils.redirectTo(ShanConstant.URL.ROOM);
		})
		.error(function(result){
			console.log("err");
			
		});
		
	};

}]);