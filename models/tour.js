const mongoose = require("mongoose");
const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  altitude: {
    type: String,
    required: false,
  },
  duration: {
    type: String,
    required: false,
  },
  difficulty: {
    type: String,
    required: false,
  },
  distance: {
    type: String,
    required: false,
  },
  best_time: {
    type: String,
    required: false,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  modified_at: {
    type: Date,
  },
});
module.exports = mongoose.model("tours", tourSchema);
