const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const adminSchema = new Schema({

    isAdmin: { type: Boolean, default: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    encryptedPassword: { type: String, required: true },
    pictureUrl: String,
}, {
    timestamps: true
});

const Admin = mongoose.model( "Admin", adminSchema );

module.exports = Admin;