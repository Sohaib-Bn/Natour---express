const mongoose = require("mongoose");

const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"]
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"]
  }
});

// Create a Tours model
const Tours = mongoose.model("Tours", toursSchema);

module.exports = Tours;
