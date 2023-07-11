const express = require("express");
const router = express.Router();
const Tour = require("../models/tour");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname.split(" ").join(""));
  },
});
const uploadImg = multer({ storage: storage });

/**
 *  @swagger
 *  components:
 *   schemas:
 *     Tour:
 *        type: object
 *        required:
 *         - title
 *         - description
 *         - price
 *         - image
 *        properties:
 *          id:
 *            type: string
 *            description: auto generated id
 *          image:
 *            type: string
 *            description: the name of the tour
 *          title:
 *            type: string
 *            description: the name of the tour
 *          description:
 *            type: string
 *            description: the descrioption of the tour
 *          price:
 *            type: string
 *            description: the price of the tour
 *          altitude:
 *            type: string
 *            description: the altitude of the tour
 *          best_time:
 *            type: string
 *            description: the best time of the tour
 *          distance:
 *            type: string
 *            description: the distance of the tour
 *          difficulty:
 *            type: string
 *            description: the difficulty of the tour
 *
 *        example:
 *            id: d5s8879364
 *            title: pahalgam
 *            description: a beautiful meadow
 *            price: 299
 *            best_time: july
 *            distance: 76kms
 *            diffculty: 5
 *            altitude: 1929m
 *            image: 'https://travel-zcxl.onrender.com/abc.png'
 */

/**
 * @swagger
 * tags:
 *  name: Tours
 *  description: The Tours managing API
 */

/**
 * @swagger
 * /tours:
 *  get:
 *    summary: returns list of all tours
 *    tags: [Tours]
 *    responses:
 *      200:
 *        description: the list of tour
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/Tour'
 */

router.get("/", async (req, res) => {
  try {
    const tours = await Tour.find();
    console.log(tours);
    res.status(200).json(tours);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//getting one
/**
 * @swagger
 * /tours/{id}:
 *  get:
 *    summary: returns list of specific tour
 *    tags: [Tours]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the book id
 *    responses:
 *      200:
 *        description: the specific tour
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/Tour'
 *      404:
 *        description : The Book was not Found
 */

router.get("/:id", getTour, (req, res) => {
  res.status(200).json(tour);
});

/**
 * @swagger
 * /tours:
 *  post:
 *    summary: Creates a Tour
 *    tags: [Tours]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/Tour'
 *    responses:
 *      200:
 *        description: Tour was successfully Created
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/Tour'
 *      500:
 *        description : Server Error
 */

//creating one
router.post("/", uploadImg.single("image"), async (req, res) => {
  const url = process.env.SERVER + "/uploads/" + req.file.filename;
  const tour = new Tour({
    ...req.body,
    image: url,
  });
  try {
    const newTour = await tour.save();
    res.status(201).json(newTour);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
router.post("/img", uploadImg.single("image"), async (req, res) => {
  console.log(req.file);
});
/**
 * @swagger
 * /tours/{id}:
 *  patch:
 *    summary: updates a specific  tour
 *    tags: [Tours]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/Tour'
 *    responses:
 *      200:
 *        description: the updated tour
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/Tour'
 *      404:
 *        description : Tour Not Found
 *      500:
 *        description : Server Error
 */

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

/**
 * @swagger
 * /tours/{id}:
 *  delete:
 *    summary: delete a specific  tour
 *    tags: [Tours]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the book id
 *    responses:
 *      200:
 *        description: the deleted tour
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/Tour'
 */
//deleting one
router.delete("/:id", getTour, async (req, res) => {
  try {
    await res.tour.remove();
    res.json({ message: "deleted tour" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
module.exports = router;
