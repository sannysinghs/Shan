var app = angular.module('Shan', ['socket.io']);
app.config(['$socketProvider',function ($socketProvider) {
	$socketProvider.setConnectionUrl('http://localhost:3001');
}]);
app.run(['$rootScope','Game', function ($rootScope,Game) {
	$rootScope.cards = Game.getCards();
	$rootScope.users = [];
}]);

app.controller('AppCtrl', ['$rootScope','$scope','$socket','Game','$log', function ($rootScope,$scope,$socket,Game,$log) {
	
	
	$socket.on('echo',function(data,msg){
		console.log('Echo event '+msg);
	});

	$socket.on('newbee',function(data,msg){
		$rootScope.users.push(JSON.parse(msg['user']));
	});

	$socket.on('drawcard',function(socket,data){
		$rootScope.users[data.id].card.push(data.card);
		$rootScope.users[data.id].draw = true;
	});

	$socket.on('start game',function(socket,data){
		$rootScope.users[data.id].card = data.card;
	});

	$scope.DrawCard = function(index){
		$socket.emit('drawcard',{ id : index , card : Game.drawOneCard()  },function(socket,data){});
	}

	$scope.TakeNewSeat = function (user) {
		
		$scope.user.email = "newmail@gmail.com";
		$scope.user.cash = 3000;
		$scope.user.draw = false;
		$scope.user.card = [];
		$rootScope.users.push(user);
		$socket.emit('newbee',{user : JSON.stringify($scope.user)},function(socket,data){});
		$scope.user = {};
	}

	$scope.StartGame = function(){
		for (var i = 0; i < $rootScope.users.length; i++) {
			$rootScope.users[i].card = $rootScope.cards.splice(0,2);
			$socket.emit('start game',{ id : i , card : $rootScope.users[i].card },function(socket,data){});
		};
	}

}]);

app.factory('Game', ['$rootScope',function ($rootScope) {
	

	return {
		getCards : function(){
			var j_arr = [];
			for (var i = 0; i < 52; i++) {
				j_arr.push(i);
			};
			
			var counter = j_arr.length;
			while(counter > 0){
				var j = Math.floor( ( Math.random() * 10) );
				counter--;
				var temp = j_arr[counter]
				j_arr[counter] = j_arr[j];
				j_arr[j] = temp;

			}
			return j_arr;
		},
		drawOneCard : function(){
			return $rootScope.cards[0];
		}
	};
}])