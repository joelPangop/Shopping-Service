const mongoose = require('mongoose'), Schema = mongoose.Schema;

const MessageSchema = new Schema({
    id: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    picture: {
        type: String,
        require: true
    },
    utilisateurId: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    read: {
        type: Boolean,
        require: true
    },
    messageTo: {
        type: String,
        require: true
    }
},{timestamps:true});
module.exports = mongoose.model('Message', MessageSchema);
