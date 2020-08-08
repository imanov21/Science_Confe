var express = require("express");
var router  = express.Router();
var Conf = require("../models/conf");
var Participant = require("../models/participant");
var Test = require("../models/test");
var middleware = require("../middleware");


//INDEX - show all conferences
router.get("/", function(req, res){
    Conf.find({}, function(err, allConfs){
       if(err){
           console.log(err);
       } else {
          res.render("confs/index",{confs:allConfs});
       }
    });
});

//CREATE - add new conference to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    var image = req.body.image;
	var name = req.body.name;
	var website = req.body.website;
	var beginDate = req.body.beginDate;
	var endDate = req.body.endDate;
	var deadlineForDocs = req.body.deadlineForDocs;
	var location = req.body.location;
	var contactPerson = req.body.contactPerson;
	var orgEmailAdress = req.body.orgEmailAdress;
	var orgBy = req.body.orgBy;
	var topics = req.body.topics;
	var linkToExample = req.body.linkToExample;
    var desc = req.body.description;
	
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newConf = {
		image: image,
		name: name,
		website: website,
		// Date & Place
		beginDate: beginDate,
		endDate: endDate,
		deadlineForDocs: deadlineForDocs,
		location: location,
		// Contacts
		contactPerson: contactPerson,
		orgEmailAdress: orgEmailAdress,
		//Additional Info
		orgBy: orgBy,
		topics: topics,
		linkToExample: linkToExample,   
		description: desc,
		author:author
	}
    Conf.create(newConf, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/confs");
        }
    });
});

//NEW - show form to create new conference
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("confs/new"); 
});

// SHOW - shows more info about one confence
router.get("/:id", function(req, res){
    Conf.findById(req.params.id).populate("participants").exec(function(err, foundConf){
        if(err || !foundConf){
            console.log(err);
			req.flash("error", "Конференцію не знайдено");
			res.redirect("back");
        } else {
            console.log(foundConf)
            res.render("confs/show", {conf: foundConf});
        }
    });
});

// EDIT CONFERENCE ROUTE
router.get("/:id/edit", middleware.checkConfOwnership, function(req, res){
    Conf.findById(req.params.id, function(err, foundConf){
		if(err || !foundConf){
		   console.log(err);
		   req.flash("error", "Конференцію не знайдено");
		   res.redirect("back");
	    } else {
            console.log(foundConf)
			req.flash("success","Успішно відредаговано");
			res.render("confs/edit", {conf: foundConf});
        }    
    });
});

// UPDATE CONFERENCE ROUTE
router.put("/:id",middleware.checkConfOwnership, function(req, res){
    Conf.findByIdAndUpdate(req.params.id, req.body.conf, function(err, updatedConf){
       if(err){
           res.redirect("/confs");
       } else {
           res.redirect("/confs/" + req.params.id);
       }
    });
});

// DESTROY CONFERENCE ROUTE
router.delete("/:id",middleware.checkConfOwnership, function(req, res){
   Conf.findByIdAndRemove(req.params.id, function(err){
      if(err){
		  console.log(err);
		  req.flash("error", "Не вдалося відмінити конференцію");
          res.redirect("/confs");
      } else {
		  req.flash("success", "Конференцію успішно скасовано");
          res.redirect("/confs");	  
      }
   });
});


module.exports = router;