const express = require("express");
const router = express.Router();
const Tour = require("../models/tour");

let tour;

async function getTour(req, res, next) {
  try {
    tour = await Tour.findById(req.params.id);
    if (tour == null) {
      return res.status(404).json({ message: "Tour Not Found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.tour = tour;
  next();
}
//getting one
router.get("/:id", getTour, (req, res) => {
  res.status(200).json(tour);
});

//getting all
router.get("/", async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json(tours);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.send("hii");
});

//creating one
router.post("/", async (req, res) => {
  const tour = new Tour({
    ...req.body,
  });
  try {
    const newTour = await tour.save();
    res.status(201).json(newTour);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

//updating
router.patch("/:id", getTour, async (req, res) => {
  const values = Object.keys(req.body);
  if (req.body.length !== null && Object.keys(req.body).length !== 0) {
    values.map((value) => (res.tour[value] = req.body[value]));
    res.tour.modified_at = Date.now();
  }
  console.log(values);
  try {
    const updatedTour = await res.tour.save();
    res.status(200).json(updatedTour);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//deleting one
router.delete("/:id", getTour, async (req, res) => {
  try {
    await res.tour.remove();
    res.json({ message: "deleted tour" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
