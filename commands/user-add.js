const signup = require('../controllers/signup');

module.exports = {
    name: 'user-add',
    usage: '[cf-handle] [name]',
    description: 'Add the user to database! Both arguments cf-handle and name required.',
    args: true,
    async execute(message, args) {
        if (args.length < 2) {
            message.channel.send("Incomplete arguments!");
            return;
        }
        handle = args[0];
        name = args.slice(1).join(" ");
        id = message.author.id;
        let res = await signup.createUser(name, id, handle);
        message.channel.send(res);
    },
};