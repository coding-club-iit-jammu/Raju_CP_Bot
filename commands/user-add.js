const signup = require('../controllers/signup');

module.exports = {
    name: 'user-add',
    usage: '[cf-handle] [name] [id]',
    description: 'Add the user to database! Both arguments cf-handle and name required. ID is optional, it will be fetched automatically.',
    args: true,
    async execute(message, args) {
        if (args.length < 2) {
            message.channel.send("Incomplete arguments!");
            return;
        }
        id = Number.parseInt(args[args.length - 1]);
        handle = args[0];
        if (!Number.isInteger(id)) {
            name = args.slice(1).join(" ");
            id = message.author.id;
        } else {
            name = args.slice(1, args.length - 1).join(" ");
        }
        
        let res = await signup.createUser(name, id, handle);
        message.channel.send(res);
    },
};