const mongoose = require("mongoose");

const schema = mongoose.Schema({
	login: 'String',
	password: 'String',
	tocken: "",
	averageRating: "",
})

module.exports = mongoose.model("User", schema);