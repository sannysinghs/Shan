var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/Shan');

var UserSchema = new mongoose.Schema({
	name : String,
	email : String,
	password : String,
	date : Date
});


var db = mongoose.model("users",UserSchema);
module.exports = {
	findAll : function(callback){
		db.find({},function(err,result){
			if(err){
				callback(null);
			}else{
				callback(result);
			}
		});	
	},
	find : function(id,callback){
		db.findOne({"_id" : id },{},function(err,data){
			if(err){
				callback(err);
			}else{
				callback(data);
			}
		});
	},

	findByEmail : function(email,callback){
		db.findOne({"email" : email },{},function(err,data){
			if(err){
				callback(err);
				return;
			}
			callback(data);
		});
	},
	save : function(user,callback){
		db.create({
			name : user.name,
			email : user.email,
			password : user.password,
			date : new Date()
		},function(err,result){
			if (err) {
				callback(err);
				return;
			}
			callback(result);
		});
	},
	remove : function(id,callback){
		db.findById(id,function(err,result){
			if (err) {
				callback(err);
				return;
			}
			db.remove(result,function(result){
				callback(result);
			})
		})
	},
	update : function(id,user,callback){

		db.update({'_id': id },{
		      $set: {
		        name: user.name,
		        eamil: user.email
		      },
		      $currentDate: { date: true }
		    },function(result){
		    	callback(result);
		    }
		);
	}
}
 