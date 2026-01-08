const mongoose = require('mongoose');
const User = require('./UserSchema');
const Frame = require('./frameSchema'); 

const userTravelGuideProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  currentFrameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Frame'
  },
  visitedFrames: [
    {
      frameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Frame'
      },
      timestamp: {
        type: Date, 
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('UserTravelGuideProgress', userTravelGuideProgressSchema);
