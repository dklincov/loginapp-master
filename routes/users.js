var express = require('express');
var mongo = require('mongodb')
var assert = require('assert');;
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');

var User = require('../models/user');
var Project = require('../models/project');


var url = 'mongodb://localhost:27017/castdb'

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Projects
router.get('/projects',ensureAuthenticated, function(req, res){
	Project.getProject();
	res.render('projects');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

//Nico Start

//Navi
//dashboard
router.get('/', function(req, res) {
    res.render('index');
});

//Calender
router.get('/calendar',ensureAuthenticated, function(req, res) {

   // res.render('calendar');
   fs.readFile('./views/calendar.html', null, function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write('File not found!');
        } else {

            res.write(data);
        }
        res.end();
    });

});

//mail
router.get('/mail',ensureAuthenticated, function(req, res) {

    res.render('mail');
   /* fs.readFile('./views/mail.html', null, function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write('File not found!');
        } else {
            res.write(data);
        }
        res.end();
    });*/

});

//project
router.get('/project',ensureAuthenticated, function(req, res) {
    var resultArray = [];
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('project').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function() {
            db.close();
            res.render('project', {items: resultArray});
        });
    });
});

//Calender
router.get('/leads',ensureAuthenticated, function(req, res) {

    // res.render('calendar');
    fs.readFile('./views/calendar.html', null, function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write('File not found!');
        } else {
            res.write(data);
        }
        res.end();
    });

});



//option
router.get('/option',ensureAuthenticated, function(req, res){
	res.render('option');
});

//Option User
router.post('/option',ensureAuthenticated, function(req, res){
	var userId = req.body.userId;
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var newpassword = req.body.newpassword;
	var newpassword2 = req.body.newpassword2;
	var oldpassword = req.body.oldpassword;

	console.log(name);
	console.log(username);

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('newpassword', 'Password is required').notEmpty();
	req.checkBody('newpassword2', 'NewPasswords do not match').equals(req.body.newpassword);
	//req.checkBody('newpassword', 'NewPasswords equals Oldpassword').equals(!req.body.oldpassword); problem
	req.checkBody('oldpassword', 'Oldpassword is required').notEmpty();
	/*User.comparePassword(oldpassword,User.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
*/
	var errors = req.validationErrors();

	if(errors){
		res.render('option',{
			errors:errors
		});
	} else {
		//info Ändern
		var upUser = new User({
			name: name,
			email:email,
			username: username,
			password: newpassword
		});

		User.updateUser(upUser,userId, function(err, user){
			if(err) throw err;
			console.log(user);
		});
		

		req.flash('success_msg', 'Optionen save');

		res.redirect('/users/option');
	}
});

//Nico end

// Register User
router.post('/register', function(req, res){
	var name = req.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}



module.exports = router;