const mongoose = require("mongoose");
const User = require("./user");
const Tour = require("./tour");
const BookingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  persons: {
    type: Array,
    required: true,
    default: [],
  },
  User: { type: mongoose.Types.ObjectId, ref: "User" },
  Tour: { type: mongoose.Types.ObjectId, ref: "Tour" },
});

module.exports = mongoose.model("bookings", BookingSchema);
