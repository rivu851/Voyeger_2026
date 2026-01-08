const express = require('express');
const router = express.Router();

const {
  createMonument,
  getAllMonuments,
  getMonumentById,
} = require("../controller/monumentController");

// Define routes
router.post("/create", createMonument);
router.get("/getAll", getAllMonuments);
router.get("/getById/:id", getMonumentById);

module.exports = router;
