var app = angular.module('shan.controllers');

app.run(['$rootScope','GameService',function ($rootScope,GameService) {
	$rootScope.cards = GameService.getCards();
}]);

app.controller('GameCtrl', ['$rootScope','$scope','LocalStorageService','ShanConstant','GameService','SocketService','$http',function ($rootScope,$scope,LocalStorageService,ShanConstant,GameService,SocketService,$http) {
	
	$scope.players = $rootScope.rooms[0].players;

	var current_user = JSON.parse(LocalStorageService.getItem(ShanConstant.USER.CURRENT_USER));

	SocketService.on('drawcard',function(socket,data){
		$scope.players[data.id].card.push(data.card);
		$scope.players[data.id].draw = true;
	});

	SocketService.on('start game',function(socket,data){
		$scope.players[data.id].card = data.card;
	});

	$scope.isCurrentUser = function(id){

		return (id === current_user._id );
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

	$scope.LeaveGame = function(index){
		var user = $rootScope.current_user;
		var i = LocalStorageService.getItem("current_player_index");
		$rootScope.rooms[LocalStorageService.getItem("current_user_room")].players.splice(i,1);
		// $http.delete('/user/'+user._id,{},function(result){
			
		// });
		console.log($rootScope.rooms);
	};

}]);