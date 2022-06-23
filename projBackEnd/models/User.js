var mongoose = require("mongoose");
const crypto = require("crypto");
// const uuidv1 = require("uuid/v1");

var userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    profile_pic: {
      data: Buffer,
      contentType: String,
    },
    phone_no: {
      type: Number,
      maxlength: 10,
      minlength: 10,
      // required: true,
      unique: true,
    },
    user_email: {
      type: String,
      required: true,
      unique: true,
    },
    banner_pic: {
      data: Buffer,
      contentType: String,
    },
    password: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
