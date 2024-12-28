const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Connect to MongoDB
const DB = process.env.DATABASEURL.replace(
  "<db_password>",
  process.env.DATABASEPASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then()
  .catch(err => console.log("Database connection error:", err));

// Import router modules
const toursRouter = require("./routers/toursRouter");
const usersRouter = require("./routers/usersRouter");

// Create an Express application
const app = express();

if (process.env.NODE_ENV === "development") {
  // Morgan middleware
  app.use(morgan("dev"));
}

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the tours router on the "/api/v1/tours" path
app.use("/api/v1/tours", toursRouter);

// Mount the users router on the "/api/v1/users" path
app.use("/api/v1/users", usersRouter);

// Export the Express application for use in other files
module.exports = app;
