const mongoose = require("mongoose");
const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  altitude: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  best_time: {
    type: String,
    required: true,
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
