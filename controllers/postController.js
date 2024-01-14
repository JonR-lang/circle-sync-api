const Post = require("../models/Post");
const User = require("../models/User");

//Create

module.exports.createPost = async (req, res) => {
  try {
    console.log(req.body);
    const { userId, description, picturePath } = req.body;

    const user = await User.findById(userId);
    const newPost = await Post.create({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: [],
      comments: [],
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(409).json({ message: "Something went wrong!" });
    console.log(err);
  }
};

//Read
module.exports.getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

//Update

module.exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(postId);
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost.likes);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports.commentPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment, userId, picturePath, firstName, lastName } = req.body;
    const post = await Post.findById(postId);
    post.comments.push({ comment, userId, picturePath, firstName, lastName });
    const updatedPost = await post.save();
    res.status(201).json({ comments: updatedPost.comments });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

//Delete

module.exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    console.log(post);
    res.status(201).json({ message: "Deletion Successful" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
