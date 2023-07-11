const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

async function getBooking(req, res, next) {
  try {
    booking = await Booking.findById(req.params.id);
    if (booking == null) {
      return res.status(404).json({ message: "Booking Not Found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.booking = booking;
  next();
}

/**
 *  @swagger
 *  components:
 *   schemas:
 *     Booking:
 *        type: object
 *        required:
 *         - title
 *        properties:
 *          id:
 *            type: string
 *            description: auto generated id
 *          title:
 *            type: string
 *            description: the name of the tour
 *          persons:
 *            type: Array
 *            description: details of number of people for booking
 *        example:
 *            id: d5s8879364
 *            title: pahalgam
 *            persons: [{name:'iqbalwali', age:'23'}]
 */

/**
 * @swagger
 * tags:
 *  name: Bookings
 *  description: The Bookings managing API
 */

/**
 * @swagger
 * /bookings:
 *  get:
 *    summary: returns list of all Bookings
 *    tags: [Bookings]
 *    responses:
 *      200:
 *        description: the list of Booking
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/Booking'
 */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//getting one
/**
 * @swagger
 * /bookings/{id}:
 *  get:
 *    summary: returns list of specific Booking
 *    tags: [Bookings]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the booking id
 *    responses:
 *      200:
 *        description: the specific Booking
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/Booking'
 *      404:
 *        description : The Booking was not Found
 */

router.get("/:id", getBooking, (req, res) => {
  res.status(200).json(booking);
});

/**
 * @swagger
 * /bookings:
 *  post:
 *    summary: Creates a Booking
 *    tags: [Bookings]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/Booking'
 *    responses:
 *      200:
 *        description: Booking was successfully Created
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/Booking'
 *      500:
 *        description : Server Error
 */
router.post("/", async (req, res) => {
  const newBooking = new Booking({
    ...req.body,
  });
  try {
    const booking = await newBooking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /bookings/{id}:
 *  patch:
 *    summary: updates a specific  tour
 *    tags: [Bookings]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the booking id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/Booking'
 *    responses:
 *      200:
 *        description: the updated Booking
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/Booking'
 *      404:
 *        description : Booking Not Found
 *      500:
 *        description : Server Error
 */

//updating
router.patch("/:id", getBooking, async (req, res) => {
  const values = Object.keys(req.body);
  if (req.body.length !== null && Object.keys(req.body).length !== 0) {
    values.map((value) => (res.booking[value] = req.body[value]));
    res.booking.modified_at = Date.now();
  }
  console.log(values);
  try {
    const updatedBooking = await res.booking.save();
    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /bookings/{id}:
 *  delete:
 *    summary: delete a specific  tour
 *    tags: [Bookings]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the booking id
 *    responses:
 *      200:
 *        description: the deleted Booking
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/Bookings'
 */
// deleting one
router.delete("/:id", getBooking, async (req, res) => {
  try {
    await res.booking.remove();
    res.json({ message: "deleted Booking" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
