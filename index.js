require('dotenv').config();
const fs = require('fs')
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const PREFIX = "!"

bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the collection
	// with the key as the command name and the value as the exported module
	bot.commands.set(command.name, command);
}
bot.once('ready', () => {
	console.log('Ready!');
});

bot.on('message', message => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) {
		return ;
	}

	const args = message.content.slice(PREFIX.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!bot.commands.has(commandName)) {
		message.channel.send('Invalid command! Type !help to get list of all commands.');
		return;
	}

	const command = bot.commands.get(commandName);

	// for commands that require an argument but not provided
	if (command.args && !args.length) {
		return message.channel.send(`You didn't provied any arguments, ${message.author}!`);
	}

 	try {
		command.execute(message, args);
	} catch (error) {
		console.log(error);
		message.reply('There was an error trying to execute that command!');
	}
})

bot.login(TOKEN);