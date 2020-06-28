var mongoose = require("mongoose");

var testSchema = mongoose.Schema({
	name: String,
	confDate: String,
    confDuration: String,
	condLocation: String,
	confDonate: String,
	confProgram: String,
	opinion: String,
	
	conf: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conf"
        },
        name: String
    },
	
	confOwner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
	
    sender: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Test", testSchema);