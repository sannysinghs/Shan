var mongoose = require("mongoose");
// mongoose.connect('mongodb://localhost/Shan');
mongoose.createConnection('mongodb://localhost/Shan');

var RoomSchema = new mongoose.Schema({
	name : String,
	level : String,
	visibility : String,
	max : String,
	players : [String],
	created_at : Date
});


var db = mongoose.model("rooms",RoomSchema);

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

	save : function(room,callback){
		db.create({
			name : room.name,
			level : room.level || '',
			visibility : room.visibility || '',
			max : room.max,
			players : [],
			created_at : new Date()
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
			});
		});
	},
	update : function(id,room,callback){
		db.update({'_id': id },{
		      $set: {
		        name: room.name,
				level : room.level,
				visibility : room.visibility,
				max : room.max,
				players : room.players
		      },
		      $currentDate: { created_at: true }
		    },function(result){
		    	callback(result);
		    }
		);
	},
	push : function(id,player,callback){
		db.update({'_id': id },{
		      $set: {
		      	players : room.players 	
		      },
		      $currentDate: { created_at: true }
		    },function(result){
		    	callback(result);
		    }
		);
	}


};
 