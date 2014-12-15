var app = angular.module('shan.controllers');

app.run(['$rootScope','GameService',function ($rootScope,GameService) {
	$rootScope.cards = GameService.getCards();
}]);

app.controller('GameCtrl', ['$rootScope','$scope','LocalStorageService','ShanConstant','GameService','SocketService','$http','ShanUtils',function ($rootScope,$scope,LocalStorageService,ShanConstant,GameService,SocketService,$http,ShanUtils) {
	
	$scope.players = $rootScope.rooms[LocalStorageService.getItem("current_player_room")].players;


	SocketService.on('drawcard',function(socket,data){
		$scope.players[data.id].card.push(data.card);
		$scope.players[data.id].draw = true;
	});

	SocketService.on('start game',function(socket,data){
		$scope.players[data.id].card = data.card;
	});

	$scope.isCurrentUser = function(id){

		return (id === $rootScope.current_user._id );
	};

	$scope.DrawCard = function(index){
		SocketService.emit('drawcard',{ id : index , card : $rootScope.cards.shift()  },function(socket,data){});
	};

	$scope.StartGame = function(){
		for (var i = 0; i < $scope.players.length; i++) {
			$scope.players[i].card = $rootScope.cards.splice(0,2);
			SocketService.emit('start game',{ id : i , card : $scope.players[i].card },function(socket,data){});

		}
	};

	$scope.LeaveGame = function() {
		var user = $rootScope.current_user;

		var pIndex = LocalStorageService.getItem("current_player_index_in_room");
		var rIndex = LocalStorageService.getItem("current_player_room");

		var room = $rootScope.rooms[rIndex];
		
		
		// Simply remove player in backend
		$http.delete('/rooms/players/'+room._id+'/'+user._id,{}).success(function(result){
			// Say everyone including me that i am out 
			SocketService.emit('newbee leave',{"room" : room._id,"rIndex" : rIndex , "pIndex" : pIndex},function(socket,data){});
			//Leave completely from a game and also from current room
			LocalStorageService.removeItem('current_player_index_in_room');
			LocalStorageService.removeItem('current_player_room');
			//go back to room and find another room
			ShanUtils.redirectTo(ShanConstant.URL.ROOM);
		})
		.error(function(result){
			console.log(result);
			
		});
		
	};

}]);