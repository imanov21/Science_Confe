var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Conf = require("../models/conf");
var Test = require("../models/test");

//root route
router.get("/", function(req, res){
    res.render("home");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

router.get("/test", function(req, res){
	
	Conf.find().populate("testResults").exec(function(err, allConfs){
       if(err){
           console.log(err);
       } else {
          res.render("test/index",{confs:allConfs});
       }
    });
});


// show info about test
router.get("/test/:id", function(req, res){
    Test.findById(req.params.id, function(err, foundTest){
        if(err){
            console.log(err);
        } else {
            console.log(foundTest);
            res.render("test/show", {test: foundTest});
        }
    });
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
		   req.flash("success", "Ласкаво просимо " + user.username + ", вас успішно зареєстровано");
           res.redirect("/confs"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/confs",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Успішно вийшли з системи.");
   res.redirect("/confs");
});

module.exports = router;