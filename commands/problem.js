const Discord = require("discord.js");
const getCfProblem = require("../lib/cf/api").getCfProblem;

/**
 * problem command
 *  - retrive random problem with (optional) provided tags
 *  - (optional) rating or problem difficulty
 * usage:
 *   !problem [rating] [tags]
 *   tags - (OPTIONAL) space separated tags. Multi word tags
 *          should be provided as a single word with
 *          underscore (_) as separator. List of tags:
 *          http://codeforces.com/blog/entry/14565
 */

function getRandomInt(start, end) {
  start = Math.ceil(start);
  end = Math.ceil(end);
  return Math.floor(Math.random() * (end - start)) + start;
}

module.exports = {
  name: "problem",
  usage: "[rating] [tags]",
  description:
    "Retrieve a random problem with (optional) provided tags and near " +
    "(within gap of 100) the rating provided (dafault: 1600). " +
    "Tags must be space separated & Multi-word tags must use underscore " +
    "(_) as separator. Tag list: http://codeforces.com/blog/entry/14565",
  args: false,
  cooldown: 5,
  async execute(msg, args) {
    let userTags = "";
    let userRating = 1600;
    let firstRating = true;

    if (args.length >= 1) {
      userRating = Number.parseInt(args[0]);
      if (Number.isNaN(userRating) || userRating <= 1000) {
        firstRating = false;
        userRating = 1600;
      } else {
        args = args.splice(1);
      }
    }
    if (!firstRating || args.length >= 1) {
      userTags = args.join(";").split("_").join(" ");
    }

    let result;
    try {
      const body = await getCfProblem(userTags);
      result = body.result;
    } catch (err) {
      if (err.status && err.status === 400) {
        // bad request, invalid tags format
        msg.reply(
          "Tags should contain only lowercase letters, numbers, spaces and " +
            "hifens (-). You can look on the available" +
            " tags here: http://codeforces.com/blog/entry/14565"
        );
        return;
      }
      throw "An error occured while processing the request.";
    }

    // filter problems based on userRating if specified or 1600 default
    const valid = [];
    for (const r of result.problems) {
      if (Math.abs(r.rating - userRating) <= 100) {
        valid.push(r);
      }
    }
    if (!valid.length) {
      msg.reply("Found no problems with the specified tags.");
      return;
    }
    // get the problem index
    r = getRandomInt(0, valid.length - 1);
    // Uses the problem and problemStatistics Field
    const contestId = valid[r].contestId;
    const problemSetName = valid[r].problemsetName;
    const idx = valid[r].index;
    const name = valid[r].name;
    const rating = valid[r].rating;
    let tags = valid[r].tags;
    tags = tags.join(", ");
    const embed = new Discord.MessageEmbed()
      .setTitle(name)
      .addField("Tags", `${tags}`)
      .setURL(`http://codeforces.com/contest/${contestId}/problem/${idx}`);
    if (contestId !== undefined) {
      embed.addField("Contest", `${contestId}/${idx}`, true);
    }
    if (problemSetName !== undefined) {
      embed.addField("problemsetName", `${problemSetName}`, true);
    }
    if (rating !== undefined) {
      embed.addField("Ratings", `${rating}`, true);
      let color = 0xffffff;
      if (rating <= 1000) color = 0x46ff00;
      else if (rating <= 1500) color = 0x4d00ff;
      else if (rating <= 2000) color = 0xff8700;
      else if (rating <= 2500) color = 0xff0000;
      else color = 0x000000;
      embed.setColor(color);
    }
    msg.channel.send("", { embed });
    return [contestId, idx];
  },
};
