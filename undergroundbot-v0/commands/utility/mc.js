const commando = require('discord.js-commando')

module.exports = class getpic extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'mc',
      group: 'utility',
      memberName: 'mc',
      description: 'Gets a mc account and sends it.'
    });
  }
  async run(msg, args) {
    let accounts = JSON.parse(fs.readFileSync("./data/mcAcc.json"));
    let min = Math.ceil(0);
    let max = Math.floor(accounts.length);
    let randNum = Math.floor(Math.random() * (max - min) + min);
    return msg.reply(accounts[randNum].acc);
  }
};
