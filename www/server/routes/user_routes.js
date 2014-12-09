module.exports = function(app){
    
    var UserModel = require(app.get("models")+"/users.js");

    app.get('/users',function(req,res){
      UserModel.findAll(function(result){
        res.json(result);
      });
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
      });
    });

    return app;   

};

