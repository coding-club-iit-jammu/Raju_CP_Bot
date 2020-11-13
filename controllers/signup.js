const User = require("../models/user");

exports.findUser = async (discordId) => {
  let check = await User.findOne({ discordId: discordId });
  return check;
};

exports.createUser = async (name, discordId, cfHandle) => {
  const userPresent = await User.findOne({ discordId: discordId });
  if (userPresent) {
    return "User already registered!";
  }
  const successMsg = "User Added Successfully.";
  const errorMsg = "Error occurred while adding user.";
  const user = new User({
    name: name,
    discordId: discordId,
    cfHandle: cfHandle,
  });
  user
    .save()
    .then((result) => {
      if (result) {
        return successMsg;
      } else {
        return errorMsg;
      }
    })
    .catch((error) => {
      const error = error.message ? error.message : errorMsg;
      return error;
    });
  return successMsg;
};
