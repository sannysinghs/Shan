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
var room_routes = require( path.join(app.get('routes') , "room_routes.js"))(app,log);

app.get('/', function(req, res){
  res.sendFile(path.join(app.get('app'),'index.html'));
});

app.get('/users',user_routes);
app.get('/auth',auth_routes);
app.get('/rooms',room_routes);

var players = [];
var player = {};

io.on('connection', function(socket){
  console.log(socket.id+' has joined the server');

  socket.on('new room',function(data){
    io.sockets.emit('new room',data);
  });

  socket.on('remove room',function(data){
    io.sockets.emit('remove room',data);
  });

  socket.on('newbee',function(data){
    // players.push(JSON.parse(data.player)._id);
    players[socket.id] = JSON.parse(data.player);
    player = data.player;
    //Join a specific room
    socket.join(data.room);
    //sending alert to everyone else in same room about joining
    //notification
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

  socket.on('newbee leave',function(data){

    //sending everyone to remove me from gloab room 
    io.sockets.emit('newbee leave',data);
    //sending alert to everyone else in same room about leaving
    //notification
    //update index
    socket.broadcast.to(data.room).emit('update index on newbee leave',data);
    //leave room
    socket.leave(data.room);

    delete players[socket.id];
  });

  socket.on('disconnect',function(type){
    console.log(player);
    setTimeout(function(){
        socket.emit("disconnect me",player);
    },1000);
  });

});	

http.listen(app.get('port'), function(){
  console.log('listening on *: '+app.get('port'));
});