const { Router } = require("express");
const {
  getUserPosts,
  getFeedPosts,
  likePost,
  commentPost,
  deletePost,
} = require("../controllers/postController");
const { verifyToken } = require("../middleware/auth");
const router = Router();

//READ

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId", verifyToken, getUserPosts);

//UPDATE

router.patch("/:postId/like", verifyToken, likePost);
router.patch("/:postId/comment", verifyToken, commentPost);

//DELETE

router.delete("/:id/deletePost", deletePost);

module.exports = router;
