const { Command } = require("discord.js-commando");

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "kick",
      group: "admin",
      memberName: "kick",
      description: "Kindly escorts given user out of the server.",
      examples: ["kick @djmango"],
      args: [
        {
          key: "text",
          prompt: "Who would you like to remove from the server?",
          type: "string"
        }
      ]
    });
  }
  async run(msg, args) {
    let mentions = msg.mentions.members.first();
    if (!mentions)
      return msg.reply(
        "you must mention someone or not add any extra arguments!"
      );
    adminCheck(msg.author.id, function(result) {
      if (result == true) {
        adminCheck(mentions.id, function(result) {
          if (result == true || mentions.kickable == false) {
            if (mentions.id == botsudoid) {
              db.exec(`delete from admins where id=${msg.author.id}`);
              return msg.reply(
                "You can't do that. You have been removed from the admin list because you are mean."
              );
            }
            return msg.reply("thats an admin doofus, i cant do that");
          } else {
            mentions.kick()
            return msg.reply(`${mentions.username} was kicked by ${msg.author.username}`);
          }
        });
      } else return msg.reply("You are not a bot admin.");
    });
  }
};
