const express = require("express");
const {
  getTours,
  createTour,
  getTour,
  updatedTour,
  deleteTour,
  setTopTours,
  getToursStats,
  getMonthlyPlan
} = require("../controllers/toursControllers");

const router = express.Router();

router.route("/top-5-tours").get(setTopTours, getTours);

router.route("/tours-stats").get(getToursStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);

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
