const mongoose = require("mongoose");

const liveLocationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true // creates updatedAt automatically
  }
);

// For fast lookup
liveLocationSchema.index({ userId: 1, updatedAt: -1 });

// TTL: auto delete after 30 minutes
liveLocationSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 1800 }
);

module.exports = mongoose.model("LiveLocation", liveLocationSchema);
