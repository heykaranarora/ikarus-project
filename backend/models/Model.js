const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema({
  name: String,
  description: String,
  url: String, // Stores file path
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Model", ModelSchema);
