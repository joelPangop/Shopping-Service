const mongoose = require('mongoose'), Schema = mongoose.Schema;
const User = require("./User").schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    pictures: {
        type: [],
        items: String,
        require: true
    },
    averageStar: {
        type: Number,
        require: false
    },
    state: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    owner: {
        type: String,
        require: false
    },
    availability: {
        type: Object,
        require: false
    },
    utilisateurId: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model('Article', ArticleSchema);
