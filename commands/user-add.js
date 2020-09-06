const signup = require('../controllers/signup');
const set_handle = require('./role')

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

        let already_exists = await signup.findUser(id);
        if (already_exists) {
            message.channel.send("User already exists!");
            return;
        }
        // start the verification of the handle
        let handle_set_res = await set_handle.execute(message, [handle]);
        if (handle_set_res == -1) {
            message.channel.send("Authentication failed!!");
        } else {
            let res = await signup.createUser(name, id, handle);
            message.channel.send(res);
        }
    },
};