var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use( express.static(path.join(__dirname,'/')) );

app.set('port',process.env.PORT || 3001);

app.set('models',path.join(__dirname , 'www/server/models'));
app.set('routes',path.join(__dirname , 'www/server/routes'));
app.set('app',path.join(__dirname , "www/app"));


var user_routes = require( path.join(app.get('routes') , "user_routes.js" ))(app);
var auth_routes = require( path.join(app.get('routes') , "auth_routes.js"))(app);

app.get('/', function(req, res){
  res.sendFile(path.join(app.get('app'),'index.html'));
});

app.get('/users',user_routes);
app.get('/auth',auth_routes);

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

http.listen(app.get('port'), function(){
  console.log('listening on *: '+app.get('port'));
});