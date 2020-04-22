module.exports = {
    name: 'role',
    usage: '<user> <role>',
    description: 'Provide role to the user!',
    args: true,
    execute(message, args) {
        message.channel.send('Currently working on this feature!');
    },
};