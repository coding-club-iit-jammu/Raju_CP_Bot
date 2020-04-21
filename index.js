require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const PREFIX = "!"

bot.once('ready', () => {
	console.log('Ready!');
});

bot.on('message', message => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) {
		return ;
	}

	const args = message.content.slice(PREFIX.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === "ping") {
		message.channel.send('Pong!');
	} else if (command === "user-info") {
		message.channel.send(`Your username: ${message.author.username}`);
	}
})

bot.login(TOKEN);