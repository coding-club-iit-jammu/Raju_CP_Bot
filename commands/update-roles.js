const Discord = require('discord.js');
const get_user = require('../cf/api').get_user;
const RANK_COLOR = require('../cf/constants').RANK_COLOR;
const ROLES = ['newbie', 'pupil', 'specialist', 'expert'];
const getInfo = require('../controllers/getInfo');

module.exports = {
    name: 'update-roles',
    usage: '',
    description: 'Update the roles of all the users in the database currently!',
    args: false,
    guildOnly: true,
    cooldown: 5,
    async execute (msg, args) {
        // TODO:
        // if (args.length >= 1) {
        //     msg.reply('No arguments accepted');
        //     return;
        // }
        // let member = msg.member;
        // for (const ROLE of ROLES) {
        //     let role = msg.guild.roles.cache.find(r => r.name === ROLE);
        //     if (member.roles.cache.has(role.id)) {
        //         member.roles.remove(role).catch(console.error);
        //     }
        // }
        // // find users rank based on the rating of the user: TODO
        // let newRole = msg.guild.roles.cache.find(r => r.name === user.rank);
        // member.roles.add(newRole).catch(console.error);

        // msg.channel.send(`Your role is now updated to ${user.rank}!`, { embed });
    }
}