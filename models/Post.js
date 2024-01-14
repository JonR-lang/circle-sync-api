const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: {
      type: String,
      default: "",
    },
    userPicturePath: {
      type: String,
      default: "",
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: [
      {
        comment: String,
        userId: String,
        picturePath: String,
        firstName: String,
        lastName: String,
      },
    ],
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);

module.exports = Post;
