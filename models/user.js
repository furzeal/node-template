'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Укажите логин']
    },
    password: {
        type: String,
        required: [
            true, 'Укажите пароль'
        ]
    }
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};




// create the model for users and expose it to our app
module.exports = mongoose.model('user', UserSchema);