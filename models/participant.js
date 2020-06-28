var mongoose = require("mongoose");

var participantSchema = mongoose.Schema({
	name: String,
    interests: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Participant", participantSchema);