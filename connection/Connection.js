const express = require("express");
const app = express();
const mongoose = require('mongoose');

const config = {
    autoIndex: false,
    useNewUrlParser: true,
};

module.exports = {
    connectionDb: mongoose.connect("mongodb://localhost:27017/ShoppingDB", config, (err, db) => {
        if (!err) {
            console.log("Database connected");
        } else
            console.log(err.message);
    })
};
