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
		let adminList = JSON.parse(fs.readFileSync('./data/botAdmins.json'));
		let message = msg.content.split(" ");
		let mentions = msg.mentions.users.array()[0]
		if (!mentions) return msg.reply('you must mention someone or not add any extra arguments!');
		if (adminList.includes(msg.author.id) == false) return msg.reply('You are not a bot admin.');
		else {
			if (adminList[mentions.username]) return msg.reply(`${mentions.username} is already an admin!`);
			adminList.push(mentions.id)
			fs.writeFileSync('./data/botAdmins.json', JSON.stringify(adminList)), (err) => {
				if (err) throw err;
			}
			return msg.reply(`Succesfully added ${mentions.username} to the admin list!`);
		}
	}
};
