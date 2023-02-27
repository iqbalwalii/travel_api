const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 *  @swagger
 *  components:
 *   schemas:
 *     User:
 *        type: object
 *        required:
 *         - username
 *         - first_name
 *         - last_name
 *         - phone
 *         - email
 *         - password
 *        properties:
 *          id:
 *            type: string
 *            description: auto generated id
 *          username:
 *            type: string
 *            description: the name of the tour
 *          first_name:
 *            type: string
 *            description: the descrioption of the tour
 *          last_name:
 *            type: string
 *            description: the price of the tour
 *          email:
 *            type: string
 *            description: the altitude of the tour
 *          phone:
 *            type: string
 *            description: the best time of the tour
 *          password:
 *            type: string
 *            description: the distance of the tour
 *          alternate_phone:
 *            type: string
 *            description: the difficulty of the tour
 *
 *        example:
 *            id: d5s8879364
 *            username: bilya
 *            first_name: iqbal
 *            last_name: wali
 *            phone: 7006886998
 *            email: iqbalwali@dropoutdevs.com
 *            alternate_phone: 9858556429
 *            password: abc123
 *            confirmPassword: abc123
 */
/**
 * @swagger
 * tags:
 *  name: Users
 *  description: The User managing API
 */

/**
 * @swagger
 * /users:
 *  get:
 *    summary: returns list of all users
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: the list of Users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/User'
 */

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//getting one
/**
 * @swagger
 * /users/check/{name}:
 *  get:
 *    summary: returns if username exists or not
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: name
 *        schema:
 *          type: string
 *        required: true
 *        description: username
 *    responses:
 *      200:
 *        description: username available
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/User'
 *      501:
 *        description : Username already Exists
 */
router.get("/check/:username", async (req, res) => {
  try {
    User.exists({ username: req.params.username }, async (err, data) => {
      if (err) res.status(501).json({ message: err.message });
      else {
        if (data) {
          res.status(501).json({ message: `Username already exists` });
        } else {
          res.status(200).json({ message: "username available" });
        }
      }
    });
  } catch (err) {
    res.json(500).json({ message: err });
  }
});
/**
 * @swagger
 * /users/register:
 *  post:
 *    summary: Creates a User
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      201:
 *        description: User was successfully Created
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/Tour'
 *      401:
 *        description : passwords don't match
 *      500:
 *        description : Server Error
 */
router.post("/register", async (req, res) => {
  try {
    User.exists({ username: req.body.username }, async (err, data) => {
      if (err) console.log(err, "na");
      else {
        if (data) {
          res.status(501).json({ message: `Username already exists` });
        } else {
          if (req.body.password === req.body.confirmPassword) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = new User({
              ...req.body,
              password: hashedPassword,
            });
            const newUser = await user.save();
            console.log(newUser.username, newUser._id);
            const token = jwt.sign(
              { username: newUser.username, id: newUser._id },
              process.env.JWT_SECRET
            );
            res.status(201).json({ user: newUser, token: token });
          } else {
            res.status(401).json({ message: "passwords dont match" });
          }
        }
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
/**
 * @swagger
 * /users/login:
 *  post:
 *    summary: login a user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      200:
 *        description: logged in
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/User'
 *      401:
 *        description : Username or Password Incorrect
 */
router.post("/login", async (req, res) => {
  try {
    const user = User.find({ username: req.body.username }, (err, data) => {
      if (err) console.log(err);
      else {
        const requestedUser = data[0];
        bcrypt.compare(
          req.body.password,
          requestedUser.password,
          (err, isMatch) => {
            if (err) {
              return err;
            }

            if (isMatch === true) {
              const token = jwt.sign(
                { username: requestedUser.username, id: requestedUser._id },
                process.env.JWT_SECRET
              );
              res.status(200).json({ user: requestedUser, token: token });
            } else {
              res
                .status(401)
                .json({ message: "password or username is incorrect" });
            }
          }
        );
      }
    });
  } catch (err) {}
});

module.exports = router;
