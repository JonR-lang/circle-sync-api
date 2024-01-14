const { Router } = require("express");
const {
  getUserPosts,
  getFeedPosts,
  likePost,
  commentPost,
  deletePost,
  createPost,
} = require("../controllers/postController");
const { verifyToken } = require("../middleware/auth");
const router = Router();

//CREATE
router.post("/", verifyToken, createPost);

//READ

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId", verifyToken, getUserPosts);

//UPDATE

router.patch("/:postId/like", verifyToken, likePost);
router.patch("/:postId/comment", verifyToken, commentPost);

//DELETE

router.delete("/:id/deletePost", verifyToken, deletePost);

module.exports = router;
