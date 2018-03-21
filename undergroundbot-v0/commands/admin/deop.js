const {
	Command
} = require('discord.js-commando');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'deop',
			group: 'admin',
			memberName: 'deop',
			description: 'Removes designated user from the admin list.',
			examples: ['deop @djmango'],
			args: [{
				key: 'text',
				prompt: 'Who would you like to remove from the admin list?',
				type: 'string'
			}]
		});
	}
	async run(msg, args) {
		let adminList = JSON.parse(fs.readFileSync('./data/botAdmins.json'));
		let message = msg.content.split(" ");
		let mentions = msg.mentions.users.array()[0]
		if (!mentions) return msg.reply('you must mention someone or not add any extra arguments!')
		if (adminList.includes(msg.author.id) == false) return msg.reply('You are not a bot admin.');
		else {
			if (adminList.includes(mentions.id)) {
				if (mentions.id == botsudoid) {
					delete adminList[adminList.indexOf(message.author.id)]
					fs.writeFileSync('./data/botAdmins.json', JSON.stringify(adminList)), (err) => {
						if (err) throw err;
					}
					return msg.reply('You can\'t do that. You have been removed from the admin list because you are mean.')
				}
				delete adminList[adminList.indexOf(mentions.id)]
				fs.writeFileSync('./data/botAdmins.json', JSON.stringify(adminList)), (err) => {
					if (err) throw err;
				}
				return msg.reply(`Succesfully removed ${mentions.username} from the admin list!`);
			} else return msg.reply(`${mentions.username} not an admin!`);
		}
	}
};