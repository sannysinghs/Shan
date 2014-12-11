//angular-socket.js
var app = angular.module('shan.services');
app.factory('SocketService', ['$rootScope',function ($rootScope) {
	var ioUrl = '';
	var ioConfig = {};
	var socket = '';

	return {
		setConnectionUrl : function(url){
			if (typeof(url) === 'string') {
				ioUrl = url;
			}else{
				throw new TypeError("Url must be type of String");
			}
		},

		setOptions : function(){

		},
		createInstance : function(url){
			if ( url !== null ) {
				this.setConnectionUrl(url);
				socket = io(url);
			}
		},
		getSocket : function(){
			return socket;
		},

		on : function(event,callback) {
			
				socket.on(event,function(arguments){
					var args = arguments;
					$rootScope.$apply(function(){
						callback(socket, args);
					});
				});
			},
		emit : function(event,data,callback){
			
			if (typeof(callback) === 'function') {
				socket.emit(event,data,function(arguments){
					var args = arguments;
					$rootScope.$apply(function(){
						callback(socket,args);
					});
				});
			}else{
				socket.emit(event,data);
				console.log('without callback');
			}
		}

	};
}]);