const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, requried: true },
  description: { type: Array, required: true },
});

module.exports = mongoose.model("blogs", blogSchema);
