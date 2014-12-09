var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');


var UserModel = require("./users.js");
app.use(bodyParser.json());
app.use( express.static(path.join(__dirname,'/')) );

app.set('port',process.env.PORT || 3001);

app.get('/', function(req, res){
  res.sendFile('index.html');
});

app.get('/users',function(req,res){
  UserModel.findAll(function(result){
    res.json(result);
  })
});

app.get('/users/:id',function(req,res){
  if (req.params.id === 'undefined') {
    res.json({error : "bad request or no parameter "});
    return;
  }
  try{
    UserModel.find(req.params.id,function(result){
      res.json(result);
    });

  }catch(err){
    res.json({error:err});
  }
});

app.post('/users',function(req,res){
  var user = req.body.user;
  console.log(user);
  UserModel.save(user,function(result){
    res.json(result);
  });
});

app.put('/users/:id',function(req,res){
  UserModel.update(req.params.id,res.body,function(result){
    res.json(result);
  });
});

app.delete('/users/:id',function(req,res){
  UserModel.remove(req.params.id,function(result){
    res.json(result);
  })
});

//auth
app.post('/login',function(req,res){
  var email = req.body.email;
  var password = req.body.password;

  UserModel.findByEmail(email,function(user){

    if (user == null || user === 'undefined') {
      res.json({"status" : "failed" , "message" : "invalid user"});
      return;
    };
    
    if (user.password !== password) {
      res.json({"status" : "failed" , "message" : "Email and password mismatch"});
      return;
    };
    res.json({"status" : "success" , "user" : user});
  });
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