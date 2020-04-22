const Discord = require('discord.js');
const get_contest = require('../cf/api').get_contest;
const convertEpochToDate = require('../cf/utilityFunctions').convertEpochToDate;

/**
 * command usage: retrives contests yet to start & User can filter based on division
 *   
 * usage:
 *   !contest [division]
 *    division can be 1, 2 or 3
 */

module.exports = {
    name: 'contest',
    usage:  'contest [division]',
    description: 'Retrieve list of yet to start contests filtered by' + '(optional) division number.',
    args: false,
    cooldown: 5,
    async execute(msg, args) {

        let div;
        if(args.length) {
            div = Number.parseInt(args[0]);
    
            if(Number.isNaN(div) || div < 0 || div > 3) {
                msg.reply(`${args[0]} is not a valid division number!`);
                return;
            }
        }
        
        let result;
        try {
            let body = await get_contest();
            result = body.result;
        } catch(err) {
            console.error(err);
            throw 'An error occured while processing the request.';
        }

        const valid = [];
        for(const r of result) {
            if(r.phase !== 'BEFORE') continue;

            if(div === undefined || r.name.includes(`Div. ${div}`)) {
                valid.push(r);
            }
        }

        if(!valid.length) {
            let reply = 'found no contests';

            if(div !== undefined) {
                reply += ` for division ${div}`;
            }

            msg.reply(reply);
            return;
        }

        for(const con of valid) {
            const embed = new Discord.MessageEmbed()
                .setTitle(con.name)
                .setURL(`http://codeforces.com/contests/${con.id}`)
                .addField('Type', con.type);
    
            if(con.startTimeSeconds) embed.addField('Starting', convertEpochToDate(con.startTimeSeconds));
            if(con.preparedBy) embed.addField('Author', con.preparedBy);
            if(con.difficulty) embed.addField('Difficulty', con.difficulty);
    
            msg.channel.send('', { embed });
        }

    },
};