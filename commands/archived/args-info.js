module.exports = {
    name: 'args-info',
    description: 'Provides information about the arguments passed!',
    args: true,
    guildOnly: true,
    execute(message, args) {
        if (args[0] === 'foo') {
            return message.channel.send('bar');
        }
        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    },
};