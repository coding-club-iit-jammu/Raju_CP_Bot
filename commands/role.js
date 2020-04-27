const Discord = require('discord.js');
const get_user = require('../cf/api').get_user;
const get_user_status = require('../cf/api').get_user_status;
const problem = require('./problem');
const RANK_COLOR = require('../cf/constants').RANK_COLOR;
const ROLES = ['newbie', 'pupil', 'specialist', 'expert'];

module.exports = {
    name: 'set-handle',
    usage: '<cf-handle>',
    description: 'Provide role to the user based on the CF-handle!',
    args: true,
    guildOnly: true,
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
            // console.log(body);
            if (body.status === 'FAILED') {
                msg.reply(body.comment);
                return;
            }
        } catch (err) {
            if(err.status && err.status === 400) {
                // bad request, no such user
                msg.reply(err.body.comment);
                return;
            }
            console.error(err);
            throw 'An error occured while processing the request!';
        }
        const user = users[0];
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

        // send a random problem to user and ask for a submission in 1 minute
        msg.channel.send("Please make a submission that results in Compilation error for the following problem within 1 minute.");
        let problem_details;
        try {
            problem_details = await problem.execute(msg, "");
            // console.log(problem_details);
        } catch (error) {
            if(err.status && err.status === 400) {
                // bad request, no such user
                msg.reply(err.body.comment);
                return;
            }
            console.log(error);
            throw 'An error occured while fetching a problem for verification!';
        }

        contest_id = problem_details[0];
        problem_id = problem_details[1];

        let submissions;
        try {
            // wait for 60000 ms to call the get_user_status function
            // setTimeout(async () => {
            let body = await get_user_status(user.handle, 1, 10, 60000);
            submissions = body.result;
            // }, 60000);
        } catch (err) {
            if(err.status && err.status === 400) {
                // bad request, no such user
                msg.reply(err.body.comment);
                return;
            }
            console.error(err);
            throw 'An error occured while processing the request!';
        }
        console.log(submissions);
        
        user_submit_contest_id = submissions[0].problem.contestId;
        user_submit_problem_id = submissions[0].problem.index;
        verdict = submissions[0].verdict;
        if (contest_id == user_submit_contest_id
            && problem_id == user_submit_problem_id
            && verdict == "COMPILATION_ERROR") {
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
        } else {
            msg.reply("Authentication failed!!");
        }
        
    },
};