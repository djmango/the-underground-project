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
		let admins = "";
		db.all("select * from admins", function (err, rows) {
			for (var i = 0; i < rows.length; i++) {
				admins = admins + client.users.get(rows[i].id).username + ", ";
			}
			return msg.channel.send(`${admins} are the admins`);
		})
	}
};
