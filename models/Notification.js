const mongoose = require('mongoose'), Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    id: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    avatar: {
        type: String,
        require: true
    },
    utilisateurId: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    read: {
        type: Boolean,
        require: true
    },
    sender: {
        type: String,
        require: true
    }
},{timestamps:true});
module.exports = mongoose.model('Notification', NotificationSchema);

