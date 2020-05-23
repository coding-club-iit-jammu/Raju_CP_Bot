const Discord = require('discord.js');
const get_problem_leetcode = require('../cf/api').get_problem_leetcode;

/**
 * problem command
 *  - (optional) problem difficulty
 *
 * usage:
 *   !problem [difficulty]
 *
 *   difficulty - (OPTIONAL) The difficulty can be 1, 2 or 3 corrosponding to Easy, Medium and Hard Problems Respectively    
 *         
 */

function get_random_int(a, b) {
    a = Math.ceil(a);
    b = Math.ceil(b);
    const r = Math.floor(Math.random()*(b-a))+a;
    // console.log(r);
    return r;
}

module.exports = {
    name: 'leetcode-problem',
    usage: '[difficulty]',
    description: 'Retrieve a random problem with (optional) difficulty and returns the problem link',
    args: false,
    cooldown: 5,
    async execute(msg, args) {
        let problem_difficulty = get_random_int(1,3);
        
        if (args.length == 1) {
            problem_difficulty = Number.parseInt(args[0]);
            if (Number.isNaN(problem_difficulty) || problem_difficulty > 3) {
                problem_difficulty = get_random_int(1,3);
            }
        }

        console.log(problem_difficulty);

        let stat_status_pairs;
        try {
            let body  = await get_problem_leetcode();
            stat_status_pairs = body.stat_status_pairs;
        } catch(err) {
            if(err.status && err.status === 400) {
                msg.reply('Tag contain only difficulty level and it can be either 1(easy), 2(medium) or 3(hard');
                return;
            }

            console.error(err);
            throw 'An error occured while processing the request.';
        }

        // filter problems based on problem_difficulty if specified or random by default
        const valid = [];
        for(const r of stat_status_pairs) {
            if (r.difficulty.level == problem_difficulty) {
                valid.push(r);
            }
        }

        if(!valid.length) {
            msg.reply('Found no problems with the specified difficulty.');
            return;
        }

        // get the problem index
        r = get_random_int(0, valid.length - 1);

        let nam = valid[r].stat.question__title;
        let quest_id = valid[r].stat.question_id;
        let problemURL = valid[r].question__title_slug;
        let totalAC = valid[r].stat.total_acs;
        let totalSubmit = valid[r].stat.total_submitted;
        // console.log(problemURL);
        //Slug is getting Undefined

        let problemURL1 = nam;
        problemURL1 = problemURL1.replace(/\s+/g, '-').toLowerCase();
        console.log(problemURL1);

        const embed = new Discord.MessageEmbed()
            .setTitle(nam)
            .setURL(`https://leetcode.com/problems/${problemURL1}`);
        if(quest_id !== undefined){
            embed.addField('Question_ID', `${quest_id}`,true)
        }   
        if(totalAC !== undefined){
            embed.addField('Total Accepted Solutions', `${totalAC}`,true)
        }    
        if(totalSubmit !== undefined){
            embed.addField('Total Submitted Solution', `${totalSubmit}`,true)
        }     
        if(problem_difficulty!==undefined){
            embed.addField('Problem Difficulty', `${problem_difficulty}`,true)
            let color = 0x00ff00;
            if(problem_difficulty == 1) color = 0x00ff00;
            else if(problem_difficulty == 2)color = 0xffa500;
            else color = 0xff0000;

            embed.setColor(color);
        }
    msg.channel.send('', { embed });
    },
};