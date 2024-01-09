const mongoose = require("mongoose");
const { isEmail } = require("validator");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please type in your first name."],
      min: [2, "Should be minimum of 3 letters"],
      max: [50, "Should not exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please type in your last name."],
      min: [2, "Should be minimum of 3 letters"],
      max: [50, "Should not exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email."],
      unique: true,
      lowercase: true,
      max: 50,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please type in your password."],
      min: [5, "Should have a minimum of 5 characters"],
    },
    picturePath: {
      type: String,
      lowercase: true,
      default: "",
      set: (value) => value.split(" ").join("-"),
    },
    friends: [String],
    socials: {
      twitter: String,
      instagram: String,
    },
    location: String,
    personalInterests: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
