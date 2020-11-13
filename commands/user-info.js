const getInfo = require("../controllers/getInfo");

module.exports = {
  name: "user-info",
  description: "Gets the CF username associated with the user!",
  async execute(message, args) {
    const id = message.author.id;
    const res = await getInfo.getUser(id);
    if (res._id) {
      message.reply(`Your CF handle is ${res.cfHandle}!`);
    } else {
      message.reply(res);
    }
  },
};
