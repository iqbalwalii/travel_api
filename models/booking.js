const mongoose = require("mongoose");
const User = require("./user");
const Tour = require("./tour");
const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  alternate_phone: {
    type: String,
    required: true,
  },
  address_1: {
    type: String,
    required: true,
  },
  address_2: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },

  pincode: {
    type: String,
    required: true,
  },

  payment_mode: {
    type: String,
    required: false,
  },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  tour: { type: mongoose.Types.ObjectId, ref: "Tour" },
});

module.exports = mongoose.model("bookings", BookingSchema);
