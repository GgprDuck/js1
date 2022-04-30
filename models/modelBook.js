const mongoose = require("mongoose");

const schema = mongoose.Schema({
	title: String,
    authorId: String,
    rate: Number,
    coments: Array,
})

module.exports = mongoose.model("Book", schema);