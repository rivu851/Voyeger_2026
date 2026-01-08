const mongoose = require("mongoose");
const Monument = require("../models/monumentSchema");
const Frame = require("../models/frameSchema");

// Create a new frame by monument ID
const createFrameByMonumentId = async (req, res) => {
  const { monumentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(monumentId)) {
    return res.status(400).json({ message: "Invalid monument ID" });
  }
  const frameData = req.body;

  try {
    // Check if the monument exists
    const monument = await Monument.findById(monumentId);
    if (!monument) {
      return res.status(404).json({ message: "Monument not found" });
    }

    //validate req body()
    if (!req.body.title) {
     return res.status(400).json({ message: "Title required" });
}

    // Create the frame
    const newFrame = new Frame({
      ...frameData,
      monumentId: monument._id,
    });

    await newFrame.save();

    if (newFrame.type === "ENTRY") {
      if (monument.entryFrameId) {
        return res.status(400).json({
          message: "Entry frame already exists for this monument",
        });
      }
      monument.entryFrameId = newFrame._id;
      await monument.save();
    }

    res.status(201).json(newFrame);
  } catch (error) {
    console.error("Error creating frame:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get frame by Frame id
const getFrameById = async (req, res) => {
  const { frameId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(frameId)) {
    return res.status(400).json({ message: "Invalid frame ID" });
  }

  try {
    const frame = await Frame.findById(frameId);
    if (!frame) {
      return res.status(404).json({ message: "Frame not found" });
    }
    res.status(200).json(frame);
  } catch (error) {
    console.error("Error fetching frame:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get next frame ids by current frame id
const getNextFramesIds = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid frame ID" });
    }
    const frame = await Frame.findById(id);

    if (!frame) {
      return res.status(404).json({ message: "Frame not found" });
    }

    if (frame.type === "EXIT") {
      return res.status(200).json([]); // No next frames for EXIT type
    }

    const nextFrameIdsArr = frame.pathsForward.map((path) => path.nextFrameId);

    res.status(200).json(nextFrameIdsArr);
  } catch (error) {
    console.error("Error fetching next frames:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get full entry frame document by monument id
const getEntryFrameByMonumentId = async (req, res) => {
  const { monumentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(monumentId)) {
    return res.status(400).json({ message: "Invalid monument ID" });
  }

  try {
    const monument = await Monument.findById(monumentId);
    if (!monument) {
      return res.status(404).json({ message: "Monument not found" });
    }
    const entryFrameId = monument.entryFrameId;
    const entryFrame = await Frame.findById(entryFrameId);
    if (!entryFrame) {
      return res.status(404).json({ message: "Entry frame not found" });
    }
    res.status(200).json(entryFrame);
  } catch (error) {
    console.error("Error fetching entry frames:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all next frame documents by current frame id
const getAllNextFramesByCurrentFrameId = async (req, res) => {
  const { currentFrameId } = req.params;

  // Validate that an ID was provided and it is a valid Mongo ObjectId
  if (!currentFrameId || !mongoose.Types.ObjectId.isValid(currentFrameId)) {
    return res.status(400).json({ message: "Invalid frame ID" });
  }

  try {
    // Fetch the current frame document by its ID
    const frame = await Frame.findById(currentFrameId);
    if (!frame) {
      return res.status(404).json({ message: "Frame not found" });
    }

    // If the current frame is an EXIT, there are no forward paths
    if (frame.type === "EXIT") {
      return res.status(200).json([]);
    }

    // Collect the IDs of all forward (next) frames from the current frame's paths
    const nextFrameIds = frame.pathsForward.map((p) => p.nextFrameId);

    // Retrieve the full documents for the collected next frame IDs
    const nextFrames = await Frame.find({ _id: { $in: nextFrameIds } });

    // Preserve the original order of pathsForward and attach the user-facing label to each next frame
    const enrichedNextFrames = frame.pathsForward
      .map((path) => {
        // Find the corresponding next frame document for this path
        const f = nextFrames.find((nf) => nf._id.equals(path.nextFrameId));
        if (!f) return null; // In case a referenced frame was not found
        return {
          ...f.toObject(), // Convert Mongoose document to plain object
          choiceLabel: path.nextFrameLabel, // Add the label shown for this choice/path
        };
      })
      .filter(Boolean); // Remove any nulls where a referenced frame was missing

    // Respond with the ordered and labeled next frames
    res.status(200).json(enrichedNextFrames);
  } catch (error) {
    console.error("Error fetching next frames:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//update the pathForward.nextFrameId and pathForward.nextFrameLabel of a frame with given frame id
const updateFramePathsForward = async (req, res) => {
  const { frameId } = req.params;
  const { pathsForward } = req.body;

  // Validate frameId
  if (!frameId || !mongoose.Types.ObjectId.isValid(frameId)) {
    return res.status(400).json({ message: "Invalid frame ID" });
  }

  // Validate request body
  if (!Array.isArray(pathsForward) || pathsForward.length === 0) {
    return res.status(400).json({
      message: "pathsForward must be a non-empty array",
    });
  }

  // Validate each path
  for (const path of pathsForward) {
    if (
      !path.nextFrameId ||
      !mongoose.Types.ObjectId.isValid(path.nextFrameId) ||
      !path.nextFrameLabel
    ) {
      return res.status(400).json({
        message:
          "Each path must have a valid nextFrameId and nextFrameLabel",
      });
    }
  }

  try {
    const frame = await Frame.findById(frameId);
    if (!frame) {
      return res.status(404).json({ message: "Frame not found" });
    }

    // Optional sanity check: ensure all nextFrameIds exist
    const nextFrameIds = pathsForward.map((p) => p.nextFrameId);
    const existingFrames = await Frame.find({
      _id: { $in: nextFrameIds },
    });

    if (existingFrames.length !== nextFrameIds.length) {
      return res.status(400).json({
        message: "One or more nextFrameIds do not exist",
      });
    }

    // Replace pathsForward completely (clean & predictable)
    frame.pathsForward = pathsForward;

    await frame.save();

    res.status(200).json({
      message: "pathsForward updated successfully",
      frame,
    });
  } catch (error) {
    console.error("Error updating pathsForward:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  createFrameByMonumentId,
  getFrameById,
  getNextFramesIds,
  getEntryFrameByMonumentId,
  getAllNextFramesByCurrentFrameId,
  updateFramePathsForward,
};
