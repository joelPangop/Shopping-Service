const mongoose = require("mongoose");
const connection = require('../connection/Connection');

//Create the model entity object
require("../models/User");
const User = mongoose.model("User");

mongoose.Promise = global.Promise;
connection.connectionDb;

const user = {
    "username": "admin",
    "password": "KathalogAdmin**",
    "email": "admin@kathalog.net",
    "type": "customer"
};

// encryptUtil.encryption("eric");

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports = {

createIfNotExistAdminUser: User.find({username: 'admin'}).then((existingAdmin) => {
            const userAdmin = new User(user);
            console.log("userAdmin", existingAdmin);
            if (isEmpty(existingAdmin)) {
                console.log("userAdmin", existingAdmin);
                userAdmin.save().then(() => {
                    console.log("User admin is created");
                }).catch((err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        })
}