const Tours = require("../models/toursModel");

exports.getTours = async (req, res) => {
  try {
    const tours = await Tours.find();
    res.status(200).json({
      message: "success",
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
