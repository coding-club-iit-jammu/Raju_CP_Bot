module.exports = {
    name: 'user-info',
    description: 'Gets the username!',
    execute(message, args) {
        message.channel.send(`Your username: ${message.author.username}`);
    },
};