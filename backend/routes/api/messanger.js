const express = require("express");
const router = express.Router();
const passport = require("passport");

// Initialize Chats Model
const Chats = require("../../models/Messanger");
const User = require("../../models/User");

// * @route   GET http://localhost:5000/api/chat/test
// * @desc    Categories route testing
// * @access  Public
router.get(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      res
        .status(200)
        .json({ message: "Chats route testing was successfully!" });
    } catch (err) {
      res
        .status(400)
        .json({ message: `Something went wrong, please try again! ${err}` });
    }
  }
);

// * @route   POST http://localhost:5000/api/chat/create/:_id
// * @desc    User created chat
// * @access  Private
router.post(
  "/create/:_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const userReciever = req.params._id;

    const newMessage = new Chats({
      userSender: req.user._id,
      userReciever: userReciever,
      textMessage: req.body.textMessage,
    })
      .populate("userSender", "username email _id")
      .populate("userReciever", "username email _id");

    newMessage
      .save()
      .then((chatMessage) =>
        res
          .status(201)
          .json(
            chatMessage
              .populate("userSender", "username email _id")
              .populate("userReciever", "username email _id")
          )
      );
  }
);

// * @route   GET http://localhost:5000/api/chat/chats
// * @desc    Retrieving user chats in which he participated
// * @access  Private
router.get(
  "/chats",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Chats.find({
      $or: [{ userReciever: req.user._id }, { userSender: req.user._id }],
    })
      .populate("userSender", "username email _id")
      .populate("userReciever", "username email _id")
      .then((chats) => {
        if (!chats) {
          res.status(400).json({ message: "Chats is not defined!" });
        }

        res.json(chats);
      });
  }
);

// * @route   GET http://localhost:5000/api/chat/chat/:_id
// * @desc    Receiving a user chat by ID with another user
// * @access  Private
router.get(
  "/chat/:_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Chats.find({
      $and: [
        {
          $or: [{ userReciever: req.user._id }, { userSender: req.user._id }],
        },
        {
          $or: [
            { userReciever: req.params._id },
            { userSender: req.params._id },
          ],
        },
      ],
    })
      .populate("userSender", "username email _id")
      .populate("userReciever", "username email _id")
      .then((chat) => {
        if (!chat) {
          return res.status(400).json({ message: "Chat is not defined!" });
        }

        // todo if

        res.status(200).json(chat);
      })
      .catch((err) =>
        res.status(500).json({ message: "Something went wrong!" })
      );
  }
);

module.exports = router;
