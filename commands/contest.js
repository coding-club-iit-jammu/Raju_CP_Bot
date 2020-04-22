const Discord = require('discord.js');
const get_contest = require('../cf/api').get_contest;

/**
 * command usage: retrives contests yet to start & User can filter based on division
 *   
 * usage:
 *   !contest [division]
 *    division can be 1, 2 or 3
 */

 /* Displays the latest upcoming contest of the provided division
  * If Divison is not specified, it displays the latest contest of each division
  * and some additional contest
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

        //Sorting The array
        valid.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a.startTimeSeconds) - new Date(b.startTimeSeconds);
          });
        
        
        //Debugging
        // for(const con of valid){
        //     var TheDate = new Date(con.startTimeSeconds * 1000).toString()
        //     console.log(TheDate);
        // }
    
        let Div1=0, Div2=0, Div3=0;
        for(const con of valid) {
            if(con.name.includes(`Div. 1`) && Div1===1)continue;
            if(con.name.includes(`Div. 2`) && Div2===1)continue;
            if(con.name.includes(`Div. 3`) && Div3===1)continue;
            const embed = new Discord.MessageEmbed()
                .setTitle(con.name)
                .setURL(`http://codeforces.com/contests/${con.id}`)
                .addField('Type', con.type);
    
            if(con.startTimeSeconds)
            {
                var TheDate = new Date(con.startTimeSeconds * 1000).toString()
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