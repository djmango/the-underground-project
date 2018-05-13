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
                prompt: 'Who would you like to mute and for how many minutes?',
                type: 'string'
            }]
        });
    }
    async run(msg, args) {
        let mentions = msg.mentions.users.array()[0];
        let time = parseInt(args.text.split(" ")[1]);
        cooldownCheck(msg.mentions.users.array()[0].id, "mute", function (result) {
            // check if our dear author is on a cooldown
            let timeRemaining = result
            let timeRemainingFormatted = format(timeRemaining)
            if (timeRemaining != 0) return msg.reply(`Slow down pal! Remaining cooldown: \`${timeRemainingFormatted}\``)
            if (!time) return msg.reply('That\s not a number, dimwit');
            if (!mentions) return msg.reply('you must mention someone or not add any extra arguments!');
            adminCheck(msg.author.id, function (result) {
                if (result == true) {
                    adminCheck(mentions.id, async function (result) {
                        if (result == true) return msg.reply(`${mentions.username} is an admin!`);
                        else {
                            // oh good! author wasnt on cooldown, now he is
                            let cooldownTime = Date.now() + 1800000

                            // insert into cooldowns table
                            db.exec(`insert into cooldowns values (${msg.author.id}, 'mute', ${cooldownTime})`)

                            // format commandQueue entries
                            let command = {}
                            command['command'] = "unmute"
                            command['executeTime'] = Date.now() + (time * 60000)
                            command['data'] = mentions.id

                            // insert into commandQueue table
                            db.exec(`insert into commandQueue values ('unmute', ${command.executeTime}, ${command.data})`)

                            // apply the mute role
                            let undGuild = await client.guilds.get('386311668155547660');
                            undGuild.fetchMember(mentions).then(guildUser => {
                                guildUser.addRole("386332618247110656", 'muted by admin');
                            });
                            return msg.reply(`Muted ${mentions.username} for ${time} minutes!`);
                        }
                    })
                } else return msg.reply('You are not a bot admin.');

            })
        })

    }
};