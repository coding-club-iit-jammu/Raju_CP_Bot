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
	const command = args.shift().toLowerCase();

	if (!bot.commands.has(command)) {
		message.channel.send('Invalid command! Type !help to get list of all commands.');
		return;
	}

	try {
		bot.commands.get(command).execute(message, args);
	} catch (error) {
		console.log(error);
		message.reply('There was an error trying to execute that command!');
	}
})

bot.login(TOKEN);