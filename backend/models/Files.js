const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    filename: String,
    path: String,
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('File', fileSchema);