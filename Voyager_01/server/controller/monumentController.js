const mongoose = require("mongoose");
const Monument = require("../models/monumentSchema");
const Frame = require("../models/frameSchema");

// Create a new monument
async function createMonument(req, res) {
  try {
    const { name, overview } = req.body;

    if (!name || !overview) {
      return res.status(400).json({
        error: "Name and overview are required",
      });
    }

    const newMonument = new Monument({
      ...req.body,
      entryFrameId: null, // explicit empty start
    });

    await newMonument.save();
    res.status(201).json(newMonument);
  } catch (error) {
    console.error("Error creating monument:", error);
    res.status(500).json({ error: "Failed to create monument" });
  }
}


// Get all monuments
async function getAllMonuments(req, res) {
  try {
    const monuments = await Monument.find();
    res.status(200).json(monuments);
  } catch (error) {
    console.error("Error fetching monuments:", error);
    res.status(500).json({ error: "Failed to fetch monuments" });
  }
}

// Get monument by ID
async function getMonumentById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid monument ID" });
    }

    const monument = await Monument.findById(id);
    if (!monument) {
      return res.status(404).json({ error: "Monument not found" });
    }

    res.status(200).json(monument);
  } catch (error) {
    console.error("Error fetching monument:", error);
    res.status(500).json({ error: "Failed to fetch monument" });
  }
}

module.exports = {
  createMonument,
  getAllMonuments,
  getMonumentById,
};
