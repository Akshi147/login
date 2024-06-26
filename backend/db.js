const mongoose = require('mongoose');
require("dotenv").config({
    path: "./.env"
})
mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        default: null,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: 50
    },
    oauthProvider: {
        type: String,
        trim: true
    },
    oauthId: {
        type: String,
        trim: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = {
	User
};