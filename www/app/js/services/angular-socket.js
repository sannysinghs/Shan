//angular-socket.js

var module = angular.module('socket.io', []);
module.provider('$socket', [function $socketProvider () {
	var ioUrl = '';
	var ioConfig = {};

	this.setConnectionUrl = function(url){
		if (typeof(url) === 'string') {
			ioUrl = url;
		}else{
			throw new TypeError("Url must be type of String");
		}
	}

	function setOption (name,vale,type) {
		if (typeof(value) !== type) {
			throw new TypeError(name +" must be type of "+type);
		}
		ioConfig[name] = value;
	}

	this.$get = function $socketFactory($rootScope){
		var socket = io(ioUrl,ioConfig);
		return {
			on : function(event,callback) {
				socket.on(event,function(arguments){
					var args = arguments;
					$rootScope.$apply(function(){
						callback(socket, args);
					});
				})
			},
			emit : function(event,data,callback){
				if (typeof(callback) === 'function') {
					socket.emit(event,data,function(arguments){
						var args = arguments;
						
						$rootScope.$apply(function(){
							console.log("Rootscope");
							callback(socket,args);
						});
					});
				}
			}
		}
	}

}])