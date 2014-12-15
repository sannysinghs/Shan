module.exports = function(app,log){
    
    var RoomModel = require(app.get("models")+"/rooms.js");

    app.get('/rooms',function(req,res){
      RoomModel.findAll(function(result){
        res.json(result);
      });
    });

    app.get('/rooms/:id',function(req,res){
      if (req.params.id === 'undefined') {
        res.json({error : "bad request or no parameter "});
        return;
      }
      try{
        RoomModel.find(req.params.id,function(result){
          res.json(result);
        });

      }catch(err){
        res.json({error:err});
      }
    });

    app.post('/rooms',function(req,res){
      var room = req.body.room;
      RoomModel.save(room,function(result){
        res.json(result);
      });
    });

    app.post('/rooms/players',function(req,res){
      RoomModel.find(req.body.room_id,function(result){
          if (result !== 'undefined') {
            result.players.push(req.body.player_id);
            RoomModel.update(req.body.room_id,result,function(data){
              res.json(data);
            });
          }
      });
    });

    app.delete('/rooms/players/:room/:user',function(req,res){
      RoomModel.find(req.params.room,function(result){
        if (result !== 'undefinded' || result !== null ) {
          result.players.splice(result.players.indexOf(req.params.user),1);
          RoomModel.update(req.params.room,result,function(data){
              // console.log(data);
              res.json(data);
          });
        }
      });
    });

    app.put('/rooms/:id',function(req,res){
      RoomModel.update(req.params.id,res.body,function(result){
        res.json(result);
      });
    });

    app.delete('/rooms/:id',function(req,res){
      RoomModel.remove(req.params.id,function(result){
        console.log(result);
        res.json(result);
      });
    });

    return app;   

};

