const {
	Command
} = require('discord.js-commando');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'oplist',
			group: 'admin',
			memberName: 'oplist',
			description: 'Lists all users in the admin list.',
			examples: ['listop']
		});
	}
	async run(msg) {
		let adminList = JSON.parse(fs.readFileSync('./data/botAdmins.json'));
		let admins = "";
		for (var i = 0; i < adminList.length; i++) admins = admins + client.users.get(adminList[i]).username + ", ";
		return msg.channel.send(`${admins} are the admins`);
	}
};
