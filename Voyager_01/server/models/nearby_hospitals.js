const mongoose = require("mongoose");

const nearbyHospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: [String],
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
});

nearbyHospitalSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("NearbyHospital", nearbyHospitalSchema);
