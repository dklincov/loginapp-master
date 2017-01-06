var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//mongodb
// User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index:true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
});

var User = module.exports = mongoose.model('user', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.updateUser = function(newUser,userId, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        User.findById(userId, function(err, p) {
  				if (!p){
  					console.log(userId);
    				console.log('Could not load Document');
  				}else {
    				// do your updates here
    				p.username  = newUser.username;
    				p.password  = newUser.password;
    				p.email 	= newUser.email;
	
    				p.save(function(err) {
     					if (err)
       			 			console.log('error')
      					else
        					console.log('success')
    				});
 				}
			});
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

