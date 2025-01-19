const mongoose = require("mongoose");
const slugify = require("slugify");

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      maxLength: [40, "A tour must have at most 40 characters"],
      minLength: [10, "A tour must have at least 10 characters"]
    },
    slug: String,
    secretTour: Boolean,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"]
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "A tour must have a rating average value between 1.0 and 5.0"],
      max: [5, "A tour must have a rating average value between 1.0 and 5.0"]
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be either easy, medium, or difficult"
      }
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"]
    },
    priceDiscout: {
      type: Number,
      validate: {
        validator: function(value) {
          return value < this.price;
        },
        message: "Price discount must be below the regular price"
      }
    },
    summary: {
      type: String,
      required: [true, "A tour must have a summary"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "A tour must have a description"],
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"]
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    startDates: {
      type: [Date]
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

toursSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7;
});

toursSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

toursSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

toursSchema.pre("aggregate", function(next) {
  // Unshift adds the $match stage to the beginning of the pipeline
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// Create a Tours model
const Tours = mongoose.model("Tours", toursSchema);

module.exports = Tours;
