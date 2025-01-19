const Tours = require("../models/toursModel");
const ApiFeatures = require("../utils/apiFeatures");

exports.setTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage, price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getToursStats = async (req, res) => {
  try {
    const toursStats = await Tours.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingAverage" },
          avgRating: { $avg: "$ratingAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      },
      {
        $sort: { avgRating: -1 }
      }
    ]);
    res.status(200).json({
      message: "success",
      results: toursStats.length,
      data: {
        toursStats
      }
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const { year } = req.params;
    const monthlyPlan = await Tours.aggregate([
      {
        $unwind: "$startDates"
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${+year.slice(1)}-01-01T00:00:00.000Z`),
            $lte: new Date(`${+year.slice(1)}-12-31T23:59:59.999Z`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTours: { $sum: 1 }
        }
      },
      {
        $addFields: { month: "$_id" }
      },
      {
        $project: { _id: 0 }
      },
      {
        $sort: { month: 1 }
      }
    ]);
    res.status(200).json({
      message: "success",
      data: {
        monthlyPlan
      }
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

exports.getTours = async (req, res) => {
  try {
    // AWAITE THE QUERY
    const Features = new ApiFeatures(Tours.find(), req.query)
      .fitler()
      .sort()
      .limitFields()
      .pagination();

    const tours = await Features.query;

    // SEND THE RESPONSE
    res.status(200).json({
      message: "success",
      results: tours.length,
      data: {
        tours: tours
      }
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tours.findById(req.params.id);
    res.status(200).json({
      message: "success",
      data: {
        tours: tour
      }
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tours.create(req.body);
    res.status(201).json({
      message: "success",
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

exports.updatedTour = async (req, res) => {
  try {
    const updatedTour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(201).json({
      message: "success",
      data: {
        tour: updatedTour
      }
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tours.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Tour deleted", status: 204 });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err.message });
  }
};
