const mongoose =  require('mongoose');
// const { stringify } = require('nodemon/lib/utils');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        dafault: false
    },
    street: {
        type: String,
        default: '',
    },
    apartment: {
        type: String,
        default: '',
    },
    zip: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        dafault: '',
    },
    country: {
        type: String,
        default: '',
    }
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
})

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;