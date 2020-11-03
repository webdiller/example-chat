// mongodb+srv://admin:question@cluster0-sblke.mongodb.net/messangerClone?retryWrites=true&w=majority
// importing
const express = require("express");
const mongoose = require("mongoose");
const Pusher = require("pusher");
const cors = require("cors");

const Messages = require("./dbMessages.js");

// app config
const app = express();
const port = process.env.PORT || 5000;
const server = require("http").Server(app);
const socket = require("socket.io")(server);

// const pusher = new Pusher({
//   appId: "1096946",
//   key: "2b64eb244e80006c5fb4",
//   secret: "57a750042b859cef9f38",
//   cluster: "eu",
//   encrypted: true,
// });

// middleware
app.use(express.json());
app.use(cors());

// DB config
const connectionUrl =
  "mongodb+srv://pandora:rootQwerty@cluster0.kgjvz.mongodb.net/pandoraEndDEV?retryWrites=true&w=majority";
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
// .catch((err) => console.log(`Database not connected: ${err}`));

// const db = mongoose.connection;

// db.once("open", () => {
//   console.log("DB connected");

//   const msgCollection = db.collection("messagecontents");
//   const changeStream = msgCollection.watch();

//   changeStream.on("change", (change) => {
//     console.log("A Change occured", change);

//     if (change.operationType === "insert") {
//       const messageDeatils = change.fullDocument;
//       pusher.trigger("messages", "inserted", {
//         name: messageDeatils.name,
//         message: messageDeatils.message,
//         timestamp: messageDeatils.timestamp,
//       });
//     } else {
//       console.log("Error triggering Pusher");
//     }
//   });
// });

// ????

// api routes
app.get("/", (req, res) => res.status(200).send("Hello, World!"));

app.get("/api/v1/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/api/v1/messages/new", (req, res) => {
  const dbMessages = req.body;

  Messages.create(dbMessages, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// listen
server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
