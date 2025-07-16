const express = require('express');
const multer = require('multer');
const File = require('../models/Files');
const router = express.Router();
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Upload route
// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     const newFile = new File({
//       filename: req.file.originalname,
//       path: req.file.path
//     });
//     await newFile.save();
//     res.status(200).json({ message: 'File uploaded!', file: newFile });
//   } catch (error) {
//     res.status(500).json({ error: 'Upload failed' });
//   }
// });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const newFile = new File({
      filename: req.file.originalname,
      path: req.file.path.replace(/\\/g, '/') // Ensure consistent path formatting
    });

    // Explicitly wait for save to complete
    const savedFile = await newFile.save();
    
    // Send complete file data including _id
    res.status(200).json({ 
      message: 'File uploaded successfully',
      file: savedFile
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed',
      details: error.message 
    });
  }
});

// Get files route
router.get('/files', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch files' });
  }
});

module.exports = router;
