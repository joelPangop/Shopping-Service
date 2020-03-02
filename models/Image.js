const mongoose = require('mongoose'), Schema = mongoose.Schema;

// Actual DB model
const ImageSchema = new mongoose.Schema({
    filename: String,
    originalName: String,
    desc: String,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', ImageSchema);
