const User = require("../models/user");

exports.getUser = async (discordId) => {
  let userPresent = await User.findOne({ discordId: discordId });
  return userPresent
    ? userPresent
    : "You do not exist in our records! Please use the command !user-add.";
};

exports.getAllUsers = async () => {
  const users = await User.find();
  let listOfUsers = [];
  for (const user of users) {
    const curUser = {
      name: user.name,
      handle: user.cfHandle,
    };
    listOfUsers.push(curUser);
  }
  return listOfUsers;
};
