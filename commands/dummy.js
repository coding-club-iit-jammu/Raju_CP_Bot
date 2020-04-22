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

import Discord from 'discord.js';
import { get_problem } from '../cf/api';
import { randomInt } from '../utils';

const execute = async function(msg, args) {
    const user_tags = args.map(arg => arg.split('_').join(' '));

    let result;

    try {
        const { body } = await get_problem(user_tags);
        result = body.result;
    } catch(err) {
        if(err.status && err.status === 400) {
            // bad request, invalid tag format
            msg.reply('tags should contain only lowercase letters, numbers,'
                + ' spaces and hifens (-). You can look on the available'
                + ' tags here: http://codeforces.com/blog/entry/14565');
            return;
        }

        console.error(err);
        throw 'An error occured while processing the request.';
    }

    const { problems } = result;

    if(!problems.length) {
        msg.reply('found no problems with the specified tags.');
        return;
    }

    const r = randomInt(0, problems.length - 1);

    const { name, contestId, index, tags } = problems[r];
    const { solvedCount } = result.problemStatistics[r];

    const embed = new Discord.RichEmbed()
        .setTitle(name)
        .addField('Contest', `${contestId}/${index}`)
        .addField('Accepted', `${solvedCount} time(s)`)
        .addField('Tags', tags.join(', '))
        .setURL(`http://codeforces.com/contest/${contestId}/problem/${index}`);

    msg.channel.send('', { embed });
};

const problem = {
    name: 'problem',
    description: 'Retrieve a random problem with (optional) provided tags. Tags'
        + ' must be space separated. Multi-word tags must use underscore (_) as'
        + ' separator. Tag list: http://codeforces.com/blog/entry/14565',
    usage: 'problem [tags]',
    args: false,
    cooldown: 5,
    execute,
};

export default problem;