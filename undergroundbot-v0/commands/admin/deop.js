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
		let mentions = msg.mentions.users.array()[0]
		if (!mentions) return msg.reply('you must mention someone or not add any extra arguments!')
		adminCheck("193066810470301696", function (result) {
			if (result == true) {
				iadminCheck("193066810470301696", function (result) {
					if (result == true) {
						if (mentions.id == botsudoid) {
							db.exec(`delete from admins where id=${message.author.id}`)
							return msg.reply('You can\'t do that. You have been removed from the admin list because you are mean.')
						}
						db.exec(`delete from admins where id=${mentions.id}`)
						return msg.reply(`Succesfully removed ${mentions.username} from the admin list!`);
					} else return msg.reply(`${mentions.username} is not an admin!`);
				})
			} else return msg.reply('You are not a bot admin.');
		})
	}
};