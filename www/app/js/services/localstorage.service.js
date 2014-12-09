var app = angular.module('shan.services');
app.factory('LocalStorageService', ['$window',function ($window) {
	

	return {
		saveItem : function(key,value){
			$window.localStorage.setItem(key,value);
		},

		getItem : function(key){
			if ( $window.localStorage.getItem(key) === '' || $window.localStorage.getItem(key) === 'undefined'  ) {
				return false;
			}else{
				return $window.localStorage.getItem(key);
			}
		},
		removeItem : function(key){
			$window.localStorage.removeItem(key);
		}
	};
}]);