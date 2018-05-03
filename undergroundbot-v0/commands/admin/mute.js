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
        let timeRemaining = await cooldownCheck(msg.mentions.users.array()[0].id, "mute")
        if (!time) return msg.reply('That\s not a number dimwit');
        if (!mentions) return msg.reply('you must mention someone or not add any extra arguments!');
        if (adminList.includes(msg.author.id) == false) return msg.reply('You are not a bot admin.');
        else {
            if (adminList[mentions.username]) return msg.reply(`${mentions.username} is an admin!`);
            let timeRemainingFormatted = format(timeRemaining)
            if (timeRemaining != 0) return msg.reply(`Slow down pal! Remaining cooldown: \`${timeRemainingFormatted}\``)
            cooldowns[msg.author.id]["mute"] = Date.now() + 1800000
            fs.writeFileSync('./data/cooldowns.json', JSON.stringify(cooldowns)), (err) => {
                if (err) throw err;
            }
            let command = {}
            command["command"] = "unmute"
            command["executeTime"] = Date.now() + (time * 60000)
            command["data"] = mentions.id
            commandQueue.push(command)
            fs.writeFileSync('./data/commandQueue.json', JSON.stringify(commandQueue)), (err) => {
                if (err) throw err;
            }
            let undGuild = await client.guilds.get('386311668155547660');
            undGuild.fetchMember(mentions).then(guildUser => {
                guildUser.addRole("386332618247110656", 'muted by admin');
            });
            return msg.reply(`Muted ${mentions.username} for ${time} minutes!`);
        }
    }
};