const Discord = require("discord.js");
const getLeetcodeProblems = require("../lib/leetcode/api").getLeetcodeProblems;

/**
 * problem command
 *  - (optional) problem difficulty
 * usage:
 *   !problem [difficulty]
 *   difficulty - (OPTIONAL) The difficulty can be 1, 2 or 3 corrosponding to
 *   Easy, Medium and Hard Problems Respectively
 */

function getRandomInt(start, end) {
  start = Math.ceil(start);
  end = Math.ceil(end);
  return Math.floor(Math.random() * (end - start)) + start;
}

module.exports = {
  name: "leetcode-problem",
  usage: "[difficulty]",
  description:
    "Retrieve a random problem with (optional) difficulty and " +
    "returns the problem link",
  args: true,
  cooldown: 5,
  async execute(msg, args) {
    let problemDifficulty = getRandomInt(1, 3);
    if (args.length == 1) {
      problemDifficulty = Number.parseInt(args[0]);
      if (Number.isNaN(problemDifficulty) || problemDifficulty > 3) {
        problemDifficulty = getRandomInt(1, 3);
      }
    }
    let statStatusPairs;
    try {
      const body = await getLeetcodeProblems();
      console.log(body);
      statStatusPairs = body.stat_status_pairs;
    } catch (err) {
      if (err.status && err.status === 400) {
        msg.reply(
          "Tag should contain only difficulty level and it can be either 1 (easy), 2 (medium) or 3 (hard)."
        );
        return;
      }
      throw "An error occured while processing the request.";
    }

    // filter problems based on problemDifficulty if specified or random by default
    const valid = [];
    for (const r of statStatusPairs) {
      if (r.difficulty.level == problemDifficulty) {
        valid.push(r);
      }
    }
    if (!valid.length) {
      msg.reply("Found no problems with the specified difficulty.");
      return;
    }
    // get the problem index
    r = getRandomInt(0, valid.length - 1);
    const problemName = valid[r].stat.question__title;
    const questionId = valid[r].stat.question_id;
    const totalAC = valid[r].stat.total_acs;
    const totalSubmit = valid[r].stat.total_submitted;

    let problemURL = problemName;
    problemURL = problemURL.replace(/\s+/g, "-").toLowerCase();

    const embed = new Discord.MessageEmbed()
      .setTitle(problemName)
      .setURL(`https://leetcode.com/problems/${problemURL}`);
    if (questionId !== undefined) {
      embed.addField("Question_ID", `${questionId}`, true);
    }
    if (totalAC !== undefined) {
      embed.addField("Total Accepted Solutions", `${totalAC}`, true);
    }
    if (totalSubmit !== undefined) {
      embed.addField("Total Submitted Solution", `${totalSubmit}`, true);
    }
    if (problemDifficulty !== undefined) {
      embed.addField("Problem Difficulty", `${problemDifficulty}`, true);
      let color = 0x00ff00;
      if (problemDifficulty == 1) color = 0x00ff00;
      else if (problemDifficulty == 2) color = 0xffa500;
      else color = 0xff0000;
      embed.setColor(color);
    }
    msg.channel.send("", { embed });
  },
};
