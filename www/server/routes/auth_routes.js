//auth
module.exports = function(app){

var UserModel = require(app.get("models")+"/users.js");

app.post('/auth/login',function(req,res){
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

return app;
};
