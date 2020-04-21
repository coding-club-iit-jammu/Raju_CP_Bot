require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.once('ready', () => {
	console.log('Ready!');
});

bot.on('message', message => {
	if (message.content === "!ping") {
		message.channel.send('Pong!');
	} else if (message.content === "user-info") {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	}
})

bot.login(TOKEN);