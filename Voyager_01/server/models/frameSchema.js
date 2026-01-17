const mongoose = require("mongoose");
const Monument = require("./monumentSchema");

const frameSchema = new mongoose.Schema({
  monumentId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monument",
    required: true,
    index: true,
  },

  title: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["ENTRY", "NORMAL", "EXIT", "SECRET"], /// always check if its entry or exit
    default: "NORMAL",
  },

  // Narration by personality
  narration: {
    professor: String,
    local: String,
    fun: String,
    cynical: String,
  },
  narrationAudioUrl: {
    professor: String,
    local: String,
    fun: String,
    cynical: String,
  },

  // Outgoing choices (edges embedded here)
  pathsForward: [
    {
      nextFrameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Frame",
        default: null
      },
      nextFrameLabel: {
        type: String,
      },
    },
  ],

  //   for later use if needed
  //   pathsBackward: [
  //     {
  //       prevFrameId: {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: "Frame",
  //         required: true,
  //       },
  //     },
  //   ],

  estimatedTimeMin: Number, // time left

  // Physical presence validation hooks
  validation: {
    gpsRadiusMeters: {
      type: Number,
      default: 30,
    },
    minTimeSpentSec: {
      type: Number,
      default: 30,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Frame = mongoose.model.Frame || mongoose.model("Frame", frameSchema);
module.exports = Frame;
