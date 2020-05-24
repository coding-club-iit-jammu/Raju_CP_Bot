require('dotenv').config();
const fs = require('fs')
const Discord = require('discord.js');
const bot = new Discord.Client();
const mongoose = require('mongoose');
const TOKEN = process.env.TOKEN;
const PREFIX = "!";

bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const cooldowns = new Discord.Collection();
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

	const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) {
		message.channel.send('Invalid command! Type !help to get list of all commands.');
		return;
	}
	// for commands that require an argument but not provided
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${PREFIX}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute this command inside DMs!');
	}
	if (!cooldowns.has(commandName)) {
		cooldowns.set(commandName, new Discord.Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(commandName);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now)/1000;
			return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	} else {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

 	try {
		command.execute(message, args);
	} catch (error) {
		console.log(error);
		message.reply('There was an error trying to execute that command!');
	}
})

bot.login(TOKEN);


// connect with mongoose
mongoose.connect(`mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@rajucp-xph1k.mongodb.net/CodingBot?retryWrites=true&w=majority`,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err) => {
	if(err) {
		console.log(err);
		return;
	};
	console.log("Connected");
});