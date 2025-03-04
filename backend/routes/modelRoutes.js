const express = require("express");
const Model = require("../models/Model");

const router = express.Router();

// Upload 3D Model via URL
router.post("/upload", async (req, res) => {
  try {
    const { name, description, modelUrl } = req.body;

    if (!modelUrl) {
      return res.status(400).json({ error: "Model URL is required" });
    }

    const newModel = new Model({
      name,
      description,
      url: modelUrl, // Store the direct online URL
    });

    await newModel.save();
    res.status(201).json({ message: "Model uploaded successfully", model: newModel });
  } catch (error) {
    res.status(500).json({ error: "Error uploading model" });
  }
});

// Get All 3D Models
router.get("/models", async (req, res) => {
  try {
    const models = await Model.find();
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: "Error fetching models" });
  }
});

// Delete a Model
router.delete("/models/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedModel = await Model.findByIdAndDelete(id);

    if (!deletedModel) {
      return res.status(404).json({ message: "Model not found" });
    }

    res.status(200).json({ message: "Model deleted successfully" });
  } catch (error) {
    console.error("Error deleting model:", error);
    res.status(500).json({ message: "Server error: Unable to delete model" });
  }
});

module.exports = router;