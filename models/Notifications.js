const mongoose = require('mongoose'), Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    description: String,
    post_at: String,
    status: Boolean,
    title: String
});

module.exports = mongoose.model('Notification', NotificationSchema);