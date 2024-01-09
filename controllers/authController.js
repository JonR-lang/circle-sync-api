const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      friends,
      location,
      personalInterests,
      socials: {
        twitter: "",
        instagram: "",
      },
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    res.status(201).json({ id: user._id });
  } catch (err) {
    console.log(err.message);
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

//LOGGING IN

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }); //this is good to use and locate one user, because, remember, each email is unique.
    if (!user) {
      throw new Error("User does not exist");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(isMatch);
      throw new Error("Invalid user credentials");
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "5m",
      }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "5d",
      }
    );
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });
    await res.cookie("refreshToken", refreshToken, {
      maxAge: 89900000000,
      httpOnly: true,
    });

    res.status(200).json({ user });
  } catch (err) {
    const errors = handleError(err);
    res.status(401).json({ errors });
  }
};

module.exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const accessToken = jwt.sign(
        { id: decodedToken.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );

      res.cookie("accessToken", accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
      });

      res.status(200).json({ accessToken });
    }
  );
};

function handleError(error) {
  let err = { firstName: "", lastName: "", email: "", password: "" };
  if (error.message.includes("User validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      err[properties.path] = properties.message;
    });
  } else if (error.code === 11000) {
    err = { email: "This email already exists in our database" };
  } else if (error.message.includes("Invalid user credentials")) {
    err.password = "Please input the right password";
    console.log("I am here");
  } else if (error.message.includes("User does not exist")) {
    err.email = "User does not exist";
  }

  return err;
}
