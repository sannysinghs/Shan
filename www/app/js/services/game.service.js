var app = angular.module('shan.services');
app.factory('GameService', ['$rootScope',function ($rootScope) {
	return {
		getCards : function(){
			var j_arr = [];
			for (var i = 0; i < 52; i++) {
				j_arr.push(i);
			}
			
			var counter = j_arr.length;
			while(counter > 0){
				var j = Math.floor( ( Math.random() * 10) );
				counter--;
				var temp = j_arr[counter];
				j_arr[counter] = j_arr[j];
				j_arr[j] = temp;

			}
			return j_arr;
		},
		drawOneCard : function(){
			return $rootScope.cards[0];
		}
	};
}]);

