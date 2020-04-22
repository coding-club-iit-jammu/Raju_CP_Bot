const Discord = require('discord.js');
const get_user = require('../cf/api').get_user;
const RANK_COLOR = require('../cf/constants').RANK_COLOR;
const ROLES = ['newbie', 'pupil', 'specialist', 'expert'];

module.exports = {
    name: 'set-handle',
    usage: '<cf-handle>',
    description: 'Provide role to the user based on the CF-handle!',
    args: true,
    cooldown: 5,
    async execute(msg, args) {
        // message.channel.send('Currently working on this feature!');
        if(args.length > 1) {
            msg.reply('no more than 1 handle accepted.');
            return;
        }
    
        let users;
        try {
            let body = await get_user(args);
            // console.log(body);
            users = body.result;
        } catch (err) {
            if(err.status && err.status === 400) {
                // bad request, no such user
                msg.reply(err.body.comment);
                return;
            }
            console.error(err);
            throw 'An error occured while processing the request!';
        }
        for(const user of users) {
            const embed = new Discord.MessageEmbed()
                .setTitle(user.handle)
                .setThumbnail(`https:${user.avatar}`)
                .addField('Name', `${user.firstName} ${user.lastName}`)
                .addField('Rank', `${user.rank} (${user.rating})`)
                .setURL(`http://codeforces.com/profile/${user.handle}`);
    
            const color = user.rank
                ? RANK_COLOR[user.rank.replace(/ +/, '_')]
                : RANK_COLOR.headquarters; // assume color for regular users with no rank too
    
            embed.setColor(color);

            // remove the current roles associated with the member
            let member = msg.member;
            // console.log(msg);
            for (const ROLE of ROLES) {
                let role = msg.guild.roles.cache.find(r => r.name === ROLE);
                if (member.roles.cache.has(role.id)) {
                    member.roles.remove(role).catch(console.error);
                }
            }
            let newRole = msg.guild.roles.cache.find(r => r.name === user.rank);
            member.roles.add(newRole).catch(console.error);

            msg.channel.send(`Your role is now updated to ${user.rank}!`, { embed });
        }
    },
};