const { Router } = require("express");
const {
  login,
  register,
  refreshToken,
} = require("../controllers/authController");
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

module.exports = router;
