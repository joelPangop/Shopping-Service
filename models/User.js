const mongoose = require('mongoose'), Schema = mongoose.Schema;
const userInfo = require("./UserInfo").schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: false
    },
    email: {
        type: String,
        require: false,
        unique:false
    },
    contact: {
        type: String,
        require: false
    },
    avatar: {
        type: String,
        require: false
    },
    type: {
        type: String,
        require: false
    },
    userInfo: userInfo
},{timestamps:true});

UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next()
    };
    bcrypt.hash(user.password, 10).then((hashedPassword) => {
        user.password = hashedPassword;
        next();
    })
}, function (err) {
    next(err)
});

UserSchema.methods.comparePassword = function (candidatePassword, next) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return next(err);
        next(null, isMatch)
    })
};

module.exports = mongoose.model('User', UserSchema);
