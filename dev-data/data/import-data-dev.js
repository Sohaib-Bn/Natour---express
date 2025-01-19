const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tours = require("../../models/toursModel");

dotenv.config({ path: "./config.env" });

// Connect to MongoDB
const DB = process.env.DATABASEURL.replace(
  "<db_password>",
  process.env.DATABASEPASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf8")
);

const importToursData = async () => {
  try {
    await Tours.create(tours);
    console.log("Data successfully uploaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteToursData = async () => {
  try {
    await Tours.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importToursData();
} else if (process.argv[2] === "--delete") {
  deleteToursData();
}
