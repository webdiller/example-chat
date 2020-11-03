const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessangerSchema = new Schema(
  {
    userSender: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    userReciever: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    textMessage: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

module.exports = Messanger = mongoose.model("messangers", MessangerSchema);
