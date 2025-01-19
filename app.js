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
  .then(() => console.log("Connecting to the database was successful"))
  .catch(() => console.log("Failed to connect to the database!😢"));

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

app.all("*", (req, res) => {
  res.status(404).json({ status: "fail", message: "Page not found" });
});

// Export the Express application for use in other files
module.exports = app;
