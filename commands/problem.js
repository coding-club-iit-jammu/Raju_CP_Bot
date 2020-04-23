const Discord = require('discord.js');
const get_problem = require('../cf/api').get_problem;

/**
 * problem command
 *  - retrive random problem with (optional) provided tags
 *  - (optional) rating or problem difficulty
 *
 * usage:
 *   !problem [rating] [tags]
 *
 *   tags - (OPTIONAL) space separated tags. Multi word tags
 *          should be provided as a single word with
 *          underscore (_) as separator. List of tags:
 *          http://codeforces.com/blog/entry/14565
 */

function get_random_int(a, b) {
    a = Math.ceil(a);
    b = Math.ceil(b);
    const r = Math.floor(Math.random()*(b-a))+a;
    // console.log(r);
    return r;
}

module.exports = {
    name: 'problem',
    usage: '[rating] [tags]',
    description: 'Retrieve a random problem with (optional) provided tags and near (within gap of 100) the rating provided (dafault: 1600). Tags must be space separated & Multi-word tags must use underscore (_) as'
    + ' separator. Tag list: http://codeforces.com/blog/entry/14565',
    args: false,
    cooldown: 5,
    async execute(msg, args) {

        let user_tags = "";
        let user_rating = 1600;
        
        let first_rating = true;
        // console.log(args);
        
        if (args.length >= 1) {
            user_rating = Number.parseInt(args[0]);
            if (Number.isNaN(user_rating) || user_rating <= 1000) {
                // msg.reply(`${args[1]} is not a valid division number!`);
                // return;
                first_rating = false;
                user_rating = 1600;
            } else {
                args = args.splice(1);
            }
        }
        if (!first_rating || args.length >= 1) {
            user_tags = args.join(';').split('_').join(' ');
            // console.log(user_tags);
        }
        
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

        // filter problems based on user_rating if specified or 1600 default
        const valid = [];
        for(const r of result.problems) {
            if (Math.abs(r.rating - user_rating) <= 100) {
                valid.push(r);
            }
        }

        if(!valid.length) {
            msg.reply('Found no problems with the specified tags.');
            return;
        }

        // get the problem index
        r = get_random_int(0, valid.length - 1);

        // Uses the problem and problemStatistics Field
        let cid = valid[r].contestId;
        let pbsetname = valid[r].problemsetName;
        let idx = valid[r].index;
        let nam = valid[r].name;
        let typ = valid[r].type;
        let point = valid[r].points;
        let rate = valid[r].rating;
        let tag = valid[r].tags;
        
        var tagss = tag.join(', ');
        const embed = new Discord.MessageEmbed()
            .setTitle(nam)
            // .addField('Type:',`${typ}`,true)
            // .addField('Accepted', `${solcnt} time(s)`,true)
            .addField('Tags',`${tagss}`)
            .setURL(`http://codeforces.com/contest/${cid}/problem/${idx}`);
        
        if(cid !== undefined){
            embed.addField('Contest', `${cid}/${idx}`,true)
        }
        if(pbsetname !== undefined){
            embed.addField('problemsetName', `${pbsetname}`,true)
        }
        // if(point!==undefined){
        //     embed.addField('Points', `${point}`,true)
        // }
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