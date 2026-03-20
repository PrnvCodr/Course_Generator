const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  objectives: [{ type: String }],
  content: { type: [mongoose.Schema.Types.Mixed], required: true, default: [] },
  isEnriched: { type: Boolean, default: false },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
