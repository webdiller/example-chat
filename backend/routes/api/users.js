const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Initialize User Model
const User = require("../../models/User");

// * @route   GET http://localhost:5000/api/users/test
// * @desc    User route testing
// * @access  Public
router.get("/test", (req, res) => {
  try {
    res.status(200).json({ message: "User route testing was successfully!" });
  } catch (err) {
    res
      .status(400)
      .json({ message: `Something went wrong, please try again! ${err}` });
  }
});

// * @route   POST http://localhost:5000/api/users/registration
// * @desc    User registration
// * @access  Public
router.post("/registration", (req, res) => {
  const errors = {};
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        errors.email = "Email already exists!";
        return res.status(400).json(errors);
      } else {
        const newUser = new User({
          email: req.body.email,
          password: req.body.password,
          username: req.body.username,
        });

        newUser
          .save()
          .then((user) => {
            res.json(user);
          })
          .catch((err) =>
            res.status(400).json({ message: "Something went wrong!" })
          );
      }
    })
    .catch((err) => res.json({ error: "Error!" }));
});

// * @route   POST http://localhost:5000/api/users/login
// * @desc    User login / Returning JWT Token
// * @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check for user
    if (!user) {
      errors.email = "User not found!";
      return res.status(400).json(errors);
    }

    if (password !== user.password) {
      errors.password = "Password incorrect!";
      return res.status(400).json(errors);
    } else {
      // User Matched
      const payload = { id: user._id, name: user.name }; // Create JWT Payload

      // Sign Token
      jwt.sign(
        payload,
        process.env.SECRET_OR_KEY,
        { expiresIn: 3600 },
        (err, token) => {
          // req.io.sockets.emit("users", user.name);
          res.json({
            success: true,
            token: "Bearer " + token,
            user,
          });
        }
      );
    }
  });
});

// * @route   GET http://localhost:5000/api/users/profile
// * @desc    Getting your user profile
// * @access  Private
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    const user = req.user._id;

    User.findOne(user)
      .populate("user", ["username", "avatar"])
      .then((userProfile) => {
        if (!userProfile) {
          errors.noUserProfile = "There is no profile for this user";
          return res.status(400).json(errors);
        }

        res.json(userProfile);
      })
      .catch((err) => res.status(400).json(err));
  }
);

module.exports = router;
