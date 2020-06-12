const Discord = require('discord.js');
const get_user = require('../cf/api').get_user;
const get_user_rating = require('../cf/api').get_user_rating;
const RANK_COLOR = require('../cf/constants').RANK_COLOR;
const ROLES = ['newbie', 'pupil', 'specialist', 'expert'];
const getInfo = require('../controllers/getInfo');

module.exports = {
    name: 'cf-ratings',
    usage: '',
    description: 'Show the rating of all the users in the database currently!',
    args: false,
    guildOnly: false,
    cooldown: 5,
    async execute (msg, args) {
        if (args.length >= 1) {
            msg.reply('No arguments accepted');
            return;
        }    
        const users = await getInfo.getAllUsers();
        let finalList = [];
        for (const user of users) {
            const name = user.name;
            const handle = user.handle;
            const response = await get_user_rating(handle);
            const result = response.result;
            if (result.length == 0) {
                // console.log(`Name: ${name}, Handle: ${handle}, Rating: 0`);
                finalList.push({
                    'name': name,
                    'handle': handle,
                    'rating': 0
                })
            } else {
                const last_contest = result[result.length - 1];
                const rating = last_contest.newRating;
                // console.log(`Name: ${name}, Handle: ${handle}, Rating:${rating}`);
                finalList.push({
                    'name': name,
                    'handle': handle,
                    'rating': rating
                })
            }
        }
        finalList.sort((a, b) => {
            return b.rating - a.rating;
        })
        console.log(finalList);
        if (finalList.length == 0) {
            msg.reply("There must be some error! Sorry for that.");
        } else {
            let ans = "";
            for (const user of finalList) {
                user.handle.replace(/_/g, '\_');
                ans += `"${user.handle}": ${user.rating}\n`;
            }
            msg.channel.send(ans);
        }
    }
};