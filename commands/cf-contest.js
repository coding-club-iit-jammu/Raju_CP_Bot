const Discord = require('discord.js');
const get_contest = require('../cf/api').get_contest;

/**
 * command usage: retrives contests yet to start & User can filter based on division
 *   
 * usage:
 *   !cf-contest [division]
 *    division can be 1, 2, 3 or 4
 */

 /* Displays the latest upcoming contest of the provided division
  * If Divison is not specified, it displays the latest contest of each division
  * and some additional contest
  */

function calcTime(time, city, offset) {
    // create Date object for current location
    d = new Date();

    // convert to msec
    // add local time zone offset 
    // get UTC time in msec
    utc = time + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    nd = new Date(utc + (3600000*offset));

    // return time as a string
    return "The local time in " + city + " is " + nd.toLocaleString();
}
module.exports = {
    name: 'cf-contest',
    usage:  '[division]',
    description: 'Retrieve list of yet to start contests filtered by' + '(optional) division number.',
    args: false,
    cooldown: 5,
    async execute(msg, args) {

        let div;
        if(args.length) {
            div = Number.parseInt(args[0]);
    
            if(Number.isNaN(div) || div < 0 || div > 4) {
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
            let reply = 'Found no contests';

            if(div !== undefined) {
                reply += ` for division ${div}`;
            }

            msg.reply(reply);
            return;
        }
        
        valid.sort((a, b) => {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a.startTimeSeconds) - new Date(b.startTimeSeconds);
          });
        
        let Div1=0, Div2=0, Div3=0;
        for(const con of valid) {
            if(con.name.includes(`Div. 1`) && Div1===1)continue;
            if(con.name.includes(`Div. 2`) && Div2===1)continue;
            if(con.name.includes(`Div. 3`) && Div3===1)continue;
            const embed = new Discord.MessageEmbed()
                .setTitle(con.name)
                .setURL(`http://codeforces.com/contests/${con.id}`)
                .addField('Type', con.type);
    
            if(con.startTimeSeconds) {
                var TheDate = calcTime(con.startTimeSeconds * 1000, "India", '+5.5');
                embed.addField('Starting', TheDate);
            }
            if(con.preparedBy) embed.addField('Author', con.preparedBy);
            if(con.difficulty) embed.addField('Difficulty', con.difficulty);
    
            msg.channel.send('', { embed });
            if(con.name.includes(`Div. 1`))Div1++;
            if(con.name.includes(`Div. 2`))Div2++;
            if(con.name.includes(`Div. 3`))Div3++;
        }

    },
};