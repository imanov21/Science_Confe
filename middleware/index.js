var Conf = require("../models/conf");
var Participant = require("../models/participant");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkConfOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Conf.findById(req.params.id, function(err, foundConf){
           if(err){
               res.redirect("back");
           }  else {
                if(foundConf.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkParticipantOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Participant.findById(req.params.participant_id, function(err, foundParticipant){
           if(err){
               res.redirect("back");
           }  else {
                if(foundParticipant.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;