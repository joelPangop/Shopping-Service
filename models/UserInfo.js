
const mongoose = require("mongoose"), Schema = mongoose.Schema;
const address = require("./Address").schema;
const telephone = require("./Telephone").schema;

const UserInfoSchema = new Schema({
    lastName: {
        type: String,
        require: true
    },
    firstName: {
        type: String,
        require: true
    },
    gender: {
        type: Boolean,
        require: true
    },
    telephones: [{
        type: telephone
    }],
    address: {
        type: address
    },
});

module.exports = mongoose.model('UserInfo', UserInfoSchema);
