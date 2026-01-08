const mongoose = require("mongoose");
const Frame = require("./frameSchema");

const monumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  imgUrl: {
    type: String,
  },

  location: {
    lat: Number,
    lng: Number,
    address: String,
  },

  timings: {
    open: String,
    close: String,
    closedDays: [String],
  },

  description: {
    //text deacription
    type: String,
  },

  overview: {
    professor: String,
    local: String,
    fun: String,
    cynical: String,
  },

  overviewAudioUrl: {
    professor: String,
    local: String,
    fun: String,
    cynical: String,
  },
  /*
  cynical example:
  eg: What do humans do to defeat death?
We build. We pray. We preserve. We lie to ourselves in stone and gold.
Every civilization here is obsessed with the same impossible goal: don’t disappear.
Some trusted gods, some trusted monuments, some trusted their own names to survive them.
Tombs, rituals, weapons, mummies—different strategies, same fear.
This isn’t a museum of history. It’s a record of how far humans go when “forever” is on the line.
Walk in knowing this: everything you’re about to see exists because someone refused to accept the end.
*/

  // Entry points into the experience
  entryFrameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Frame",
  },

  // All frames that belong to this monument (reference only)
  //   frameIds: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Frame",
  //     },
  //   ],

  estimatedTourDurationMin: {
    // total time
    type: Number,
  },

  isWheelchairAccessible: Boolean,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Monument =
  mongoose.model.Monument || mongoose.model("Monument", monumentSchema);

module.exports = Monument;
