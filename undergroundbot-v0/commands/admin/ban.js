const {
  Command
} = require("discord.js-commando");

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ban",
      group: "admin",
      memberName: "ban",
      description: "Kindly escorts given user out of the server. Forever.",
      examples: ["ban @djmango"],
      args: [{
        key: "text",
        prompt: "Who would you like to remove from the server forever, and for what reason?",
        type: "string"
      }]
    });
  }
  async run(msg, args) {
    let splitArgs = args['text'].split(' ')
    let reason = ''
    for (let i = 1; i < splitArgs.length; i++) {
      reason = reason + splitArgs[i];
    }
    let mentions = msg.mentions.members.first();
    if (!mentions)
      return msg.reply(
        "you must mention someone and list your reasoning!"
      );
    cooldownCheck(msg.author.id, "ban", function (result) {
      // check if our dear author is on a cooldown
      let timeRemaining = result;
      let timeRemainingFormatted = format(timeRemaining);
      if (timeRemaining != 0)
        return msg.reply(
          `Slow down pal! Remaining cooldown: \`${timeRemainingFormatted}\``
        );

      adminCheck(msg.author.id, function (result) {
        if (result == true) {
          adminCheck(mentions.id, function (result) {
            if (result == true || mentions.bannable == false) {
              if (mentions.id == botsudoid) {
                db.exec(`delete from admins where id=${msg.author.id}`);
                return msg.reply("You can't do that. You have been removed from the admin list because you are mean.");
              }
              return msg.reply("thats an admin doofus, i cant do that");
            } else {
              // oh good! author wasnt on cooldown, now he is
              let cooldownTime = Date.now() + 10800000;

              // insert into cooldowns table
              db.exec(`insert into cooldowns values (${msg.author.id}, 'ban', ${cooldownTime})`);

              // log n run
              msg.reply(`${mentions.user.username} was banned by ${msg.author.username} for ${reason}`);
              logChannel.send(`${mentions.user.username} was banned by ${msg.author.username} for ${reason}`);
              return mentions.ban();
            }
          });
        } else return msg.reply("You are not a bot admin.");
      });
    });
  }
};