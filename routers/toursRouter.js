const express = require("express");
const {
  getTours,
  createTour,
  getTour,
  updatedTour,
  deleteTour
} = require("../controllers/toursControllers");

const router = express.Router();

router
  .route("/")
  .get(getTours)
  .post(createTour);

router
  .route("/:id")
  .get(getTour)
  .patch(updatedTour)
  .delete(deleteTour);

module.exports = router;
