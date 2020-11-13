const getUserRating = require("../lib/cf/api").getUserRating;
const getInfo = require("../controllers/getInfo");

module.exports = {
  name: "cf-ratings",
  usage: "",
  description: "Show the rating of all the users in the database currently!",
  args: false,
  guildOnly: false,
  cooldown: 5,
  async execute(msg, args) {
    if (args.length >= 1) {
      msg.reply("No arguments accepted");
      return;
    }
    const users = await getInfo.getAllUsers();
    let finalList = [];
    for (const user of users) {
      const name = user.name;
      const handle = user.handle;
      const response = await getUserRating(handle);
      const result = response.result;
      if (result.length == 0) {
        finalList.push({
          name: name,
          handle: handle,
          rating: 0,
        });
      } else {
        const last_contest = result[result.length - 1];
        const rating = last_contest.newRating;
        finalList.push({
          name: name,
          handle: handle,
          rating: rating,
        });
      }
    }
    finalList.sort((a, b) => {
      return b.rating - a.rating;
    });
    if (finalList.length == 0) {
      msg.reply("There must be some error! Sorry for that.");
    } else {
      let ans = "";
      for (const user of finalList) {
        user.handle.replace(/_/g, "_");
        ans += `"${user.handle}": ${user.rating}\n`;
      }
      msg.channel.send(ans);
    }
  },
};
