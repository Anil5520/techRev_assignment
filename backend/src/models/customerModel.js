const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    dob: {
        type: String,
        default: "NA"
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: "male"
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "NA"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);