const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    goal: { type: String, default: '' },
    analyses: [
      {
        inputType: String,
        title: String,
        score: Number,
        classification: String,
        timestamp: { type: Date, default: Date.now },
        feedback: { useful: Boolean, learned: String },
      },
    ],
    totalTimeAnalyzed: { type: Number, default: 0 },
    usefulCount: { type: Number, default: 0 },
    wasteCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
