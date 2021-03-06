/**
 * @typedef TourModel
 * @property {string} name - Name of tour.
 * @property {number} duration - Duration of tour.
 * @property {number} maxGroupSize - Maximum group size that the tour can take.
 * @property {string} difficulty - Difficulty of tour.
 * @property {number} price - Price of Tour.
 * @property {String} summary - Summary of tour.
 * @property {string} imageCover - Cover image of tour
 */

const authController = require("../controllers/authController");
const reviewRouter = require("../routes/reviewRoutes");

const express = require("express");
const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

const tourController = require("../controllers/tourController");

/**
 * @route GET /tours/top-5-cheap
 * @summary Get top 5 cheapest tours.
 * @returns {string} - 200 - Successfully returned all tour data.
 * @returns {string} - 404 - Invalid Data sent. Cannot get tour with uri.
 * @group Tours
 */
router.get(
  "/top-5-cheap",
  tourController.aliasTopTours,
  tourController.getAllTours
);

/**
 * @route GET /tours/tour-stats
 * @summary Get tour statistics.
 * @returns {string} - 200 - Successfully returned all tour data.
 * @returns {string} - 400 - Invalid Data sent. Cannot get tour with uri.
 * @group Tours
 */
router.get("/tour-stats", tourController.getTourStats);

/**
 * @route GET /tours/monthly-plan/{year}
 * @summary Get monthly plan of tour.
 * @param {string} year.path - year of tour
 * @returns {string} - 200 - Successfully returned all tour data.
 * @returns {string} - 400 - Invalid Data sent. Cannot get tour with uri.
 * @group Tours
 */


router.route("/tours-within/:distance/center/:latlng/unit/:unit").get( tourController.getToursWithin);
//tours-distance?distance=233,center=-40,45&unit=miles
//tours-distance/233/center/-40,45/unit/mi

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan
  );

/**
 * @route GET /tours
 * @summary Get all tours.
 * @returns {string} - 200 - Successfully returned all tour data.
 * @returns {string} - 404 - Invalid Data sent. Cannot get tour with uri.
 * @group Tours
 */
router.route("/").get(tourController.getAllTours);

/**
 * @route POST /tours
 * @summary Inserts new tour.
 * @param {TourModel.model} TourModel.body.required
 * @returns {string} - 201 - Tour Successfully created.
 * @returns {string} - 400 - Bad request. Invalid request body
 * @group Tours
 */
router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour
  );

/**
 * @route GET /tours/{id}
 * @summary Get a tour.
 * @param {string} id.path - id of tour
 * @returns {string} - 200 - Successfully returned tour data.
 * @returns {string} - 400 - Invalid Data sent. Cannot get tour with uri.
 * @group Tours
 */
router.get("/:id", tourController.getTour);

/**
 * @route PATCH /tours/{id}
 * @summary Update a tour.
 * @param {string} id.path - id of tour
 * @param {TourModel.model} TourModel.body
 * @returns {string} - 200 - Successfully updated tour.
 * @returns {string} - 400 - Failed to Update. Cannot get tour with uri.
 * @group Tours
 */
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages, 
    tourController.updateTour
  );

/**
 * @route DELETE /tours/{id}
 * @summary Delete a tour.
 * @param {string} id.path - id of tour
 * @returns {string} - 204 - Successfully deleted data.
 * @returns {string} - 404 - Failed To Delete Data. Cannot get tour with uri.
 * @group Tours
 */
router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
