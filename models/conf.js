var mongoose = require("mongoose");

var confSchema = new mongoose.Schema({
	// Main info
	image: String,
	name: String,
	website: String,
	// Date & Place
	beginDate: String,
	endDate: String,
	deadlineForDocs: String,
	location: String,
	// Contacts
	contactPerson: String,
	orgEmailAdress: String,
	//Additional Info
	orgBy: String,
	topics: String,
	linkToExample: String,   
   	description: String,
   	author: {
      	id: {
         	type: mongoose.Schema.Types.ObjectId,
         	ref: "User"
      	},
      	username: String
   	},
   	participants: [
      	{
         	type: mongoose.Schema.Types.ObjectId,
         	ref: "Participant"
      	}
   	],
	testResults: [
      	{
         	type: mongoose.Schema.Types.ObjectId,
         	ref: "Test"
      	}
   	],
});

module.exports = mongoose.model("Conf", confSchema);