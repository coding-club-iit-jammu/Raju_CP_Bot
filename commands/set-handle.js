const Discord = require("discord.js");
const getUser = require("../lib/cf/api").getUser;
const getUserStatus = require("../lib/cf/api").getUserStatus;
const problem = require("./problem");
const RANK_COLOR = require("../lib/cf/constants").RANK_COLOR;
const ROLES = ["newbie", "pupil", "specialist", "expert"];

module.exports = {
  name: "set-handle",
  usage: "<cf-handle>",
  description: "Provide role to the user based on the CF-handle!",
  args: true,
  guildOnly: true,
  cooldown: 5,
  async execute(msg, args) {
    if (args.length > 1) {
      msg.reply("No more than 1 handle accepted.");
      return;
    }
    let users;
    try {
      const body = await getUser(args);
      users = body.result;
      if (body.status === "FAILED") {
        msg.reply(body.comment);
        return -1;
      }
    } catch (err) {
      if (err.status && err.status === 400) {
        // bad request, no such user
        msg.reply(err.body.comment);
        return -1;
      }
      throw "An error occured while processing the request!";
    }
    const user = users[0];
    const embed = new Discord.MessageEmbed()
      .setTitle(user.handle)
      .setThumbnail(`https:${user.avatar}`)
      .addField("Name", `${user.firstName} ${user.lastName}`)
      .addField("Rank", `${user.rank} (${user.rating})`)
      .setURL(`http://codeforces.com/profile/${user.handle}`);

    const color = user.rank
      ? RANK_COLOR[user.rank.replace(/ +/, "_")]
      : RANK_COLOR.headquarters; // assume color for regular users with no rank

    embed.setColor(color);

    // send a random problem to user and ask for a submission in 1 minute
    msg.channel.send(
      "Please make a submission that results in Compilation error for the " +
        "following problem within 3 minutes."
    );
    let problemDetails;
    try {
      problemDetails = await problem.execute(msg, "");
    } catch (error) {
      if (err.status && err.status === 400) {
        // bad request, no such user
        msg.reply(err.body.comment);
        return -1;
      }
      throw "An error occured while fetching a problem for verification!";
    }

    contestId = problemDetails[0];
    problemId = problemDetails[1];

    let submissions;
    try {
      // wait for 1800000 ms to call the getUserStatus function
      const body = await getUserStatus(user.handle, 1, 10, 180000);
      submissions = body.result;
    } catch (err) {
      if (err.status && err.status === 400) {
        // bad request, no such user
        msg.reply(err.body.comment);
        return -1;
      }
      throw "An error occured while processing the request!";
    }

    userSubmitContestId = submissions[0].problem.contestId;
    userSubmitProblemId = submissions[0].problem.index;
    verdict = submissions[0].verdict;
    if (
      contestId == userSubmitContestId &&
      problemId == userSubmitProblemId &&
      verdict == "COMPILATION_ERROR"
    ) {
      // remove the current roles associated with the member
      let member = msg.member;
      for (const ROLE of ROLES) {
        let role = msg.guild.roles.cache.find((r) => r.name === ROLE);
        if (member.roles.cache.has(role.id)) {
          member.roles.remove(role).catch(console.error);
        }
      }
      let newRole = msg.guild.roles.cache.find((r) => r.name === user.rank);
      member.roles.add(newRole).catch(console.error);
      msg.channel.send(`Your role is now updated to ${user.rank}!`, { embed });
      return 1;
    } else {
      msg.reply("Authentication failed!!");
      return -1;
    }
  },
};
