const objectService = require("../services/object.service");

// CHECK OBJECTS
async function checkExistingObjects(req, res) {
  try {
    const { id } = req.params;
    const { hashes } = req.body;

    if (!hashes || !Array.isArray(hashes)) {
      return res.status(400).json({
        message: "hashes array required",
      });
    }

    const { data, error } = await objectService.checkExistingObjects(
      id,
      hashes,
    );

    if (error) {
      return res.status(400).json({
        message: "Failed to check objects",
        error,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

// UPLOAD OBJECT
async function uploadObject(req, res) {
  try {
    const { id } = req.params;

    const { hash, content } = req.body;

    if (!hash || !content) {
      return res.status(400).json({
        message: "hash and content required",
      });
    }

    const buffer = Buffer.from(content, "base64");

    const { data, error } = await objectService.uploadObject(id, hash, buffer);

    if (error) {
      return res.status(400).json({
        message: "Failed to upload object",
        error,
      });
    }

    res.status(201).json({
      message: "Object uploaded successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

// DOWNLOAD OBJECT
async function getObjectByHash(req, res) {
  try {
    const { id, hash } = req.params;

    const { data, error } = await objectService.getObjectByHash(id, hash);

    if (error || !data) {
      return res.status(404).json({
        message: "Object not found",
      });
    }

    const arrayBuffer = await data.arrayBuffer();

    const base64 = Buffer.from(arrayBuffer).toString("base64");

    res.status(200).json({
      hash,
      content: base64,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

module.exports = {
  checkExistingObjects,
  uploadObject,
  getObjectByHash,
};
