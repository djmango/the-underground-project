const {
    Command
} = require('discord.js-commando');

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            group: 'admin',
            memberName: 'mute',
            description: 'Mutes designated user for the specified time',
            examples: ['mute @djmango 30'],
            args: [{
                key: 'text',
                prompt: 'Who would you like to mute and for how long?',
                type: 'string'
            }]
        });
    }
    async run(msg, args) {
        let adminList = JSON.parse(fs.readFileSync('./data/botAdmins.json'));
        let cooldowns = JSON.parse(fs.readFileSync('./data/cooldowns.json'));
        let commandQueue = JSON.parse(fs.readFileSync('./data/commandQueue.json'));
        let mentions = msg.mentions.users.array()[0];
        let time = parseInt(args.text.split(" ")[1]);
        if (!time) return msg.reply('That\s not a number dimwit');
        if (!mentions) return msg.reply('you must mention someone or not add any extra arguments!');
        if (adminList.includes(msg.author.id) == false) return msg.reply('You are not a bot admin.');
        else {
            if (adminList[mentions.username]) return msg.reply(`${mentions.username} is an admin!`);
            console.log(cooldownCheck("id", "command"))
            fs.writeFileSync('./data/cooldowns.json', JSON.stringify(cooldowns)), (err) => {
                if (err) throw err;
            }
            fs.writeFileSync('./data/commandQueue.json', JSON.stringify(commandQueue)), (err) => {
                if (err) throw err;
            }
            return msg.reply(`Muted ${mentions.username} for ${time} minutes!`);
        }
    }
};