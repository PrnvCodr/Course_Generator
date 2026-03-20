const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  creator: { type: String, required: true, default: 'anonymous' },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  tags: [{ type: String, trim: true }],
  prompt: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
