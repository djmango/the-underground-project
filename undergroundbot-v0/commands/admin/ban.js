const { Command } = require("discord.js-commando");

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ban",
      group: "admin",
      memberName: "ban",
      description: "Kindly escorts given user out of the server. Forever.",
      examples: ["ban @djmango"],
      args: [
        {
          key: "text",
          prompt: "Who would you like to remove from the server forever?",
          type: "string"
        }
      ]
    });
  }
  async run(msg, args) {
    let mentions = msg.mentions.members.first();
    let usernameHold = mentions.username; // once i ban them, i cant get ther name..
    if (!mentions)
      return msg.reply(
        "you must mention someone or not add any extra arguments!"
      );
    cooldownCheck(msg.author.id, "ban", function(result) {
      // check if our dear author is on a cooldown
      let timeRemaining = result;
      let timeRemainingFormatted = format(timeRemaining);
      if (timeRemaining != 0)
        return msg.reply(
          `Slow down pal! Remaining cooldown: \`${timeRemainingFormatted}\``
        );

      adminCheck(msg.author.id, function(result) {
        if (result == true) {
          adminCheck(mentions.id, function(result) {
            if (result == true || mentions.bannable == false) {
              if (mentions.id == botsudoid) {
                db.exec(`delete from admins where id=${msg.author.id}`);
                return msg.reply(
                  "You can't do that. You have been removed from the admin list because you are mean."
                );
              }
              return msg.reply("thats an admin doofus, i cant do that");
            } else {
              // oh good! author wasnt on cooldown, now he is
              let cooldownTime = Date.now() + 1800000;

              // insert into cooldowns table
              db.exec(
                `insert into cooldowns values (${
                  msg.author.id
                }, 'ban', ${cooldownTime})`
              );
              mentions.ban();
              return msg.reply(
                `${usernameHold} was banned by ${msg.author.username}`
              );
            }
          });
        } else return msg.reply("You are not a bot admin.");
      });
    });
  }
};
