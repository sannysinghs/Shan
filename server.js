var express = require('express');
var app = express();
var log = require('log');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use( express.static(path.join(__dirname,'/')) );
app.use('/app',express.static(path.join(__dirname,'/www/app/')));


app.set('port',process.env.PORT || 3001);
app.set('models',path.join(__dirname , 'www/server/models'));
app.set('routes',path.join(__dirname , 'www/server/routes'));
app.set('app',path.join(__dirname , "www/app"));


var user_routes = require( path.join(app.get('routes') , "user_routes.js" ))(app);
var auth_routes = require( path.join(app.get('routes') , "auth_routes.js"))(app);
var room_routes = require( path.join(app.get('routes') , "room_routes.js"))(app);

app.get('/', function(req, res){
  res.sendFile(path.join(app.get('app'),'index.html'));
});

app.get('/users',user_routes);
app.get('/auth',auth_routes);
app.get('/rooms',room_routes);

var players = {};

io.on('connection', function(socket){
  console.log(socket.id+' has joined the server');

  // socket.join('myroom',function(socket){
  //   console.log('palyer user a room');
  //   io.to('my room').emit('event');
  // });

  socket.on('join room',function(data){
    console.log('Join the room');
    socket.emit('join room',{"players" : players});
  });

  socket.on('new room',function(data){
    io.sockets.emit('new room',data);
  });

  socket.on('newbee',function(data){
  	players[socket.id] = data.player;
    //sending alert to everyone else in same room
    socket.broadcast.to(data.room).emit('update room',data.player);
    //sending to everyone in same room to update players in room
    io.sockets.emit('newbee',data);
  });

  socket.on('drawcard',function(data){
    io.sockets.emit('drawcard',data);
  });

  socket.on('start game',function(data){
    socket.broadcast.emit('start game',data);
  });

  socket.on('disconnect',function(){
    console.log('user has left');
    socket.broadcast.emit('leave room',players[socket.id]);
    delete players[socket.id];
  });

});	

http.listen(app.get('port'), function(){
  console.log('listening on *: '+app.get('port'));
});