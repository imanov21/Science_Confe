var express = require("express");
var router  = express.Router({mergeParams: true});
var Conf = require("../models/conf");
var Participant = require("../models/participant");
var Test = require("../models/test");
var middleware = require("../middleware");

// New participation page
router.get("/new",middleware.isLoggedIn, function(req, res){
    console.log(req.params.id);
    Conf.findById(req.params.id, function(err, conf){
        if(err){
            console.log(err);
        } else {
             res.render("participant/new", {conf: conf});
        }
    })
});

// Create participation
router.post("/",middleware.isLoggedIn,function(req, res){
   Conf.findById(req.params.id, function(err, conf){
		   //info about participant
		var name = req.body.participant.name;
		var interests = req.body.participant.interests;
		   //For test
	   	var testName = req.body.participant.name;
		var confDate = req.body.test.confDate;
		var confDuration = req.body.test.confDuration;
		var condLocation = req.body.test.condLocation;
		var confDonate = req.body.test.confDonate;
		var confProgram = req.body.test.confProgram;
		var opinion = req.body.test.opinion;

		var testSender = {
			id: req.user._id,
			username: req.user.username
		}
		
		var testConf = {
			id: conf._id,
			name: conf.name
		}

		var testOwner = {
			id: conf.author.id,
			username: conf.author.username
		}

		var newTest = {
			name: testName,
			confDate: confDate,
			confDuration: confDuration,
			condLocation: condLocation,
			confDonate: confDonate,
			confProgram: confProgram,
			opinion: opinion,
			
			conf: testConf,

			confOwner: testOwner,

			sender: testSender
		}

		var participationAuthor = {
			id: req.user._id,
			username: req.user.username
		}

		var newParticipant = {
			name: name,
			interests: interests,
			author:participationAuthor
		}

		if(err){
		   console.log(err);
		   res.redirect("/confs");
		} else {
		   Participant.create(newParticipant, function(err, participant){
			   if(err){
				    req.flash("error", "Щось пішло не так");
					console.log(err);
			   } else {
				  //add username and id to participation
					participant.author.id = req.user._id;
					participant.author.username = req.user.username;
					participant.save();
					conf.participants.push(participant);
					conf.save();
					console.log(participant);
					Test.create(newTest, function(err, test){
						if(err){
							console.log(err);
						} else {
							test.save();
							conf.testResults.push(test);
							conf.save();
							console.log(test);
						}
					});
				  req.flash("success", "Вас успішно зареєстровано як учасника");
				  res.redirect('/confs/' + conf._id);
				}
			});
		}
	});
});

// PARTICIPATION EDIT ROUTE
router.get("/:participant_id/edit", middleware.checkParticipantOwnership, function(req, res){
   Conf.findById(req.params.id, function(err, foundConf){
	   if(err || !foundConf){
		   req.flash("error", "Не знайдено такої конференції");
		   return res.redirect("back");
	   }
	   
	   Participant.findById(req.params.participant_id, function(err, foundParticipant){
		  if(err){
			  res.redirect("back");
		  } else {
			res.render("participant/edit", {conf_id: req.params.id, participant: foundParticipant});
		  }
	   });
   }); 
});

// PARTICIPATION UPDATE
router.put("/:participant_id", middleware.checkParticipantOwnership, function(req, res){
   Participant.findByIdAndUpdate(req.params.participant_id, req.body.participant, function(err, updatedParticipant){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/confs/" + req.params.id );
      }
   });
});

// PARTICIPATION DESTROY ROUTE
router.delete("/:participant_id", middleware.checkParticipantOwnership, function(req, res){
    Participant.findByIdAndRemove(req.params.participant_id, function(err){
       if(err){
		   console.log(err);
           res.redirect("back");
       } else {
		   req.flash("success", "Вас успішно знято з участі у конференції");
           res.redirect("/confs/" + req.params.id);
       }
    });
});

module.exports = router;