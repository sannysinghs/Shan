var app = angular.module('shan.services');
app.factory('constant', ['LocalStorageService',function (LocalStorageService) {
	
	
	return {
		whoami : function(){
			return LocalStorageService.getItem("current_user");
		}
	};
}]);