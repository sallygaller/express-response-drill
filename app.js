const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("common"));

const apps = require("./app-data.js");

app.get("/apps", (req, res) => {
  const { genres, sort } = req.query;
  console.log(sort);
  if (sort) {
    if (!["rating", "app"].includes(sort)) {
      return res.status(400).send("Sort must be either rating or app");
    }
  }
  if (genres) {
    results = apps.filter((app) =>
      app.Genres.toLowerCase().includes(genres.toLowerCase())
    );
    console.log(results);
  } else results = apps;
  if (sort) {
    let capitalizeSort = sort.charAt(0).toUpperCase() + sort.slice(1);
    if ((capitalizeSort = "App")) {
      results.sort((a, b) => {
        return a[capitalizeSort] > b[capitalizeSort]
          ? 1
          : a[capitalizeSort] < b[capitalizeSort]
          ? -1
          : 0;
      });
    }
    if ((capitalizeSort = "Rating")) {
      results.sort((a, b) => {
        return a[capitalizeSort] > b[capitalizeSort]
          ? -1
          : a[capitalizeSort] < b[capitalizeSort]
          ? 1
          : 0;
      });
    }
  }
  res.json(results);
});

module.exports = app;
