const { Router } = require("express");
const { login, refreshToken } = require("../controllers/authController");
const router = Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);

module.exports = router;
