const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    next();
    return;
  }

  try {
    let token = req.cookies.accessToken;
    console.log(token);
    if (!token) {
      throw new Error("Access token not found!");
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        throw new Error("Invalid access token");
      } else {
        req.userId = decodedToken.id;
        console.log("req-userId: ", req.userId);
        next();
      }
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
    console.log(err.message);
  }
};
