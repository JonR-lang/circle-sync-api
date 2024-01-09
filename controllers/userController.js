const User = require("../models/User");

module.exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports.searchUsers = async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const users = await User.find({
      $or: [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
      ],
    });
    res.status(200).json(users);
  } catch (err) {
    console.log(`Error-Occured init bruv: ${err.message}`);
    res.status(404).json({ error: err.message });
  }
};

module.exports.getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
        friends,
      }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
          friends,
        };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports.addRemoveFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    console.log(userId, friendId);
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== userId);
    } else {
      user.friends.push(friendId);
      friend.friends.push(userId);
    }
    let updatedUser = await user.save();
    let updatedFriend = await friend.save();

    res.status(200).json({ friends: updatedUser.friends });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports.updateTwitter = async (req, res) => {
  try {
    const { id } = req.params;
    const { twitter } = req.body;
    console.log(twitter);
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { "socials.twitter": twitter } },
      { new: true }
    );
    console.log(user);
    res.status(201).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports.updateInstagram = async (req, res) => {
  try {
    const { id } = req.params;
    const { instagram } = req.body;
    console.log(instagram);
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { "socials.instagram": instagram } },
      { new: true }
    );
    console.log(user);
    res.status(201).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};
