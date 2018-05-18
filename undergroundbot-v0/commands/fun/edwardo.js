const {Command} = require('discord.js-commando');

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'odrawde',
      group: 'fun',
      memberName: 'edwardo',
      description: 'edwardo.',
      examples: ['edwardo.']
    });
  }
  async run(msg, args) {
    return  msg.reply('edwardo.')
  }
};
