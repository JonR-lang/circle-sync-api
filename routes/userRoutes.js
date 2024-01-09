const { Router } = require("express");
const {
  getUser,
  searchUsers,
  getUserFriends,
  addRemoveFriend,
  updateTwitter,
  updateInstagram,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");
const router = Router();

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/search/:searchTerm", searchUsers);

//uPDATE

router.patch("/:userId/:friendId", addRemoveFriend);
router.put("/:id/updateTwitter", updateTwitter);
router.put("/:id/updateInstagram", updateInstagram);

module.exports = router;
