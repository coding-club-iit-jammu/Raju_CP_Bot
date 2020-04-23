const Discord = require('discord.js');
const get_problem = require('../cf/api').get_problem;
/**
 * problem command
 *  - retrive random problem with (optional) provided tags
 *
 * usage:
 *   !problem [tags]
 *
 *   tags - (OPTIONAL) space separated tags. Multi word tags
 *          should be provided as a single word with
 *          underscore (_) as separator. List of tags:
 *          http://codeforces.com/blog/entry/14565
 */

module.exports = {
    name: 'problem',
    usage: 'problem [tags]',
    description: 'Retrieve a random problem with (optional) provided tags. Tags must be space separated & Multi-word tags must use underscore (_) as'
    + ' separator. Tag list: http://codeforces.com/blog/entry/14565',
    args: false,
    cooldown: 5,
    async execute(msg, args) {

        const user_tags = args.map(arg => arg.split('_').join(' '));
        // console.log(user_tags);
        let result;
        try {
            let body  = await get_problem(user_tags);
            result = body.result;
            //console.log(result);
        } catch(err) {
            if(err.status && err.status === 400) {
                // bad request, invalid tag format
                msg.reply('Tags should contain only lowercase letters, numbers, spaces and hifens (-). You can look on the available'
                + ' tags here: http://codeforces.com/blog/entry/14565');
                return;
            }

            console.error(err);
            throw 'An error occured while processing the request.';
        }

        if(!result.problems.length) {
            msg.reply('found no problems with the specified tags.');
            return;
        }

        //Try to create a random function that takes user's rating into account and suggests the results accordingly
        // const valid = [];
        // for(const r of result.problems) {
        //     if(Maths.abs(r.rating-)<=300){
        //         valid.push(r);
        //     }
        // }

        //Check if the valid list has any question else give any random question from any range

        //Random Function
        let a = 0, b = result.problems.length-1;
        a = Math.ceil(a);
        b = Math.ceil(b);
        const r = Math.floor(Math.random()*(b-a))+a;
        console.log(r);

        //Uses the problem and problemStatistics Field
        let cid = result.problems[r].contestId;
        let pbsetname = result.problems[r].problemsetName;
        let idx = result.problems[r].index;
        let nam = result.problems[r].name;
        let typ = result.problems[r].type;
        let point = result.problems[r].points;
        let rate = result.problems[r].rating;
        let tag = result.problems[r].tags;
        let solcnt = result.problemStatistics[r].solvedCount;
        console.log(tag);
        var tagss = tag.join(', ');
        const embed = new Discord.MessageEmbed()
        .setTitle(nam)
        .addField('Type:',`${typ}`,true)
        .addField('Accepted', `${solcnt} time(s)`,true)
        .addField('Tags',`${tagss}`)
        .setURL(`http://codeforces.com/contest/${cid}/problem/${idx}`);
        
        if(cid !== undefined){
            embed.addField('Contest', `${cid}/${idx}`,true)
        }
        if(pbsetname !== undefined){
            embed.addField('problemsetName', `${pbsetname}`,true)
        }
        if(point!==undefined){
            embed.addField('Points', `${point}`,true)
        }
        if(rate!==undefined){
            embed.addField('Ratings', `${rate}`,true)
            let color = 0xFFFFFF;
            if(rate<=1000) color = 0x46FF00;
            else if(rate<=1500)color = 0x4D00FF;
            else if(rate<=2000)color = 0xFF8700;
            else if(rate<=2500)color = 0xFF0000;
            else color = 0x000000;

            embed.setColor(color);
        }
        msg.channel.send('', { embed });
    },
};