const {
	Command
} = require('discord.js-commando');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'op',
			group: 'admin',
			memberName: 'op',
			description: 'Adds designated user to the admin list.',
			examples: ['op @djmango'],
			args: [{
				key: 'text',
				prompt: 'Who would you like to add to the admin list?',
				type: 'string'
			}]
		});
	}
	async run(msg, args) {
		let mentions = msg.mentions.users.array()[0]
		if (!mentions) return msg.reply('you must mention someone or not add any extra arguments!');
		adminCheck(msg.author.id, function (result) {
			if (result == false) return msg.reply('You are not a bot admin.');
			else {
				adminCheck(mentions.id, function (result) {
					if (result == true) return msg.reply(`${mentions.username} is already an admin!`);
					else {
						db.exec(`insert into admins values (${mentions.id}, 3)`)
						return msg.reply(`Succesfully added ${mentions.username} to the admin list!`);
					}
				})
			}
		})
	}
};