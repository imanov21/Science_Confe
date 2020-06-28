var mongoose = require("mongoose");
var Conf = require("./models/conf");
var Users = require("./models/user");
var Participant   = require("./models/participant");
var Test   = require("./models/test");

function seedDB(){
   Users.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed users!")});
   Participant.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed participants!");
   }); 
   Conf.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed conferences!");
	   
   });
	
	Test.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed tests!");
	   
   });
	
}

module.exports = seedDB;