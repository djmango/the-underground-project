const {Command} = require('discord.js-commando');

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      group: 'general',
      memberName: 'say',
      description: 'Replies with the text you provide.',
      examples: ['say Hi there!'],
      args: [{
        key: 'text',
        prompt: 'What text would you like the bot to say?',
        type: 'string'
      }]
    });
  }
  async run(msg, args) {
    if (msg.mentions.channels.first()) {
      if (msg.channel.type != 'dm') {
        msg.delete().catch(console.error);
      }
      msg.mentions.channels.first().send(
          args.text.split(' ').slice(1).join(' '));
    } else {
      msg.channel.send(args.text);
      if (msg.channel.type != 'dm') {
        msg.delete().catch(console.error);
      }
    }
  }
};
