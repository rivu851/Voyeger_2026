const express = require("express");
const router = express.Router();    

const {
  createFrameByMonumentId,
  getFrameById,
  getNextFramesIds,
  getEntryFrameByMonumentId,
  getAllNextFramesByCurrentFrameId,
  updateFramePathsForward
} = require("../controller/frameController");

// Define routes
router.post("/create/:monumentId", createFrameByMonumentId);  //working v1
router.get("/getById/:frameId", getFrameById); //working v1
router.get("/getNextFramesIds/:id", getNextFramesIds); //working v1
router.get("/getEntryFrameByMonumentId/:monumentId", getEntryFrameByMonumentId);  //working v1
router.get("/getAllNextFramesByCurrentFrameId/:currentFrameId", getAllNextFramesByCurrentFrameId);  //working v1
router.put("/updatePathsForward/:frameId", updateFramePathsForward);  //working v1

module.exports = router;