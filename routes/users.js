const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/name", async (req, res) => {
  try {
    User.exists({ username: req.body.username }, async (err, data) => {
      if (err) res.status(501).json({ message: err.message });
      else {
        if (data) {
          res.status(501).json({ message: `Username exists` });
        } else {
          res.status(200).json({ message: "username available" });
        }
      }
    });
  } catch (err) {
    res.json(500).json({ message: err });
  }
});

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

router.get("/login", async (req, res) => {
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
            }
          }
        );
      }
    });
  } catch (err) {}
});

module.exports = router;
