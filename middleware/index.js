var Conf = require("../models/conf");
var Participant = require("../models/participant");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkConfOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Conf.findById(req.params.id, function(err, foundConf){
           if(err || !foundConf){
			   req.flash("error", err);
               res.redirect("back");
           }  else {
                if(foundConf.author.id.equals(req.user._id)) {
                    next();
                } else {
					req.flesh("error", "Ви не маєте дозволу на це");
                    res.redirect("back");
                }
           }
        });
    } else {
		req.flash("error", "Щоб зробити це, вам потрібно увійти до системи");
        res.redirect("back");
    }
}

middlewareObj.checkParticipantOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Participant.findById(req.params.participant_id, function(err, foundParticipant){
           if(err || !foundParticipant){
			   console.log(err);
			   req.flash("error","Не знайдено такого учасника");
               res.redirect("back");
           }  else {
                if(foundParticipant.author.id.equals(req.user._id)) {
                    next();
                } else {
					req.flesh("error", "Ви не маєте дозволу на це");
                    res.redirect("back");
                }
           }
        });
    } else {
		req.flash("error", "Щоб зробити це, вам потрібно увійти до системи");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "Щоб зробити це, вам потрібно увійти до системи");
    res.redirect("/login");
}

module.exports = middlewareObj;