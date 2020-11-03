// mongodb+srv://admin:question@cluster0-sblke.mongodb.net/messangerClone?retryWrites=true&w=majority
// importing
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const Messages = require("./dbMessages.js");

// app config
const app = express();
const port = process.env.PORT || 5000;
const server = require("http").Server(app);
const socket = require("socket.io")(server);

const messangerRoutes = require('./routes/api/messanger');
const userRoutes = require('./routes/api/users');

// middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);

// DB config
const connectionUrl =
  "mongodb+srv://pandora:rootQwerty@cluster0.kgjvz.mongodb.net/messanger?retryWrites=true&w=majority";
const socketConnection = require("./socket");
mongoose.connect(
  connectionUrl,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, db) => {
    console.log(`Connected to MongoDB...`);

    socket.on("connection", socketConnection);
  }
);

// API ROUTES
app.use('/api/chat', messangerRoutes);
app.use('/api/users', userRoutes);

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));