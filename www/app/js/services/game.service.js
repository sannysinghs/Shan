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
		},
		calcScore : function(cards){
			var score = {
				points : 0,
				times : -1
			};
			
			for (var i = 0; i < cards.length; i++) {
				if (cards[i] < 40) {
					score.points += Math.floor(cards[i]/4)  + 1;
				}else{
					score.points += 10;	
				}

				if (i === cards.length -1 ) {
					score.times = (score.times === cards[i] % 4)? cards.length : -1; 
				}else{
					score.times = cards[i] % 4;
				}

			}
			return score;
		}
	};
}]);

