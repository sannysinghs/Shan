var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use( express.static(path.join(__dirname,'/')) );

app.set('port',process.env.PORT || 3001);

app.get('/', function(req, res){
  res.sendFile('index.html');
});

io.on('connection', function(socket){

  socket.on('newbee',function(data){
  	console.log('New person request');
  	socket.broadcast.emit('newbee',data);
  });

  socket.on('drawcard',function(data){
    io.sockets.emit('drawcard',data);
  });

  socket.on('start game',function(data){
    socket.broadcast.emit('start game',data);
  });

});	

http.listen(3001, function(){
  console.log('listening on *: '+app.get('port'));
});