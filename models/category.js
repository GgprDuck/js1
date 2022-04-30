const mongoose = require("mongoose");

const schema = mongoose.Schema({
    category: String
});

module.exports = mongoose.model("Category", schema);