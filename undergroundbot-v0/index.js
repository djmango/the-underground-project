// apis
console.log('getting apis...');
global.Commando = require('discord.js-commando');
global.Discord = require('discord.js');
global.format = require('format-duration');
global.path = require('path');
global.fs = require('fs');
global.os = require('os');
global.request = require('request');
global.striptags = require('striptags');
global.ai = require('apiai');
global.crashreporter = require('crashreporter');
global.dateFormat = require('dateformat');
global.prettyMs = require('pretty-ms');
global.imageDownloader = require('image-downloader');
global.mysql = require('mysql');
global.ud = require('urban-dictionary');
global.startTime = process.hrtime();
// pull keys file
console.log('pulling keys...');
const keys = JSON.parse(fs.readFileSync('./keys/keys.json'));  // read all keys
// keys
global.token = keys.discordtoken;  // discord api key
global.botsudoid = keys.botsudo;   // bot sudo id
// bot settings
console.log('configuring bot...');
// set prefix
global.prefix = '//';
// make client global
global.client = new Commando.Client({
  owner: botsudoid,
  commandPrefix: prefix,
  disableEveryone: true,
  unknownCommandResponse: false
});
global.discordClient = new Discord.Client();
// command groups
client.registry.registerDefaultTypes()
    .registerGroups([
      ['general', 'general commands'], ['fun', 'commands just for fun'],
      ['utility', 'generally useful commands']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

// ready?
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  global.servers = (`Servers:\n${client.guilds.map(g => g.name).join("\n")}`);
  console.log(`Servers:\n${client.guilds.map(g => g.name).join("\n")}`);
  let localUsers = client.users.array().length;
  let updatePres = setInterval(function() {
    let localUsers = client.users.array().length;
    client.user.setPresence({
      game: {
        name: `${prefix}help | ${localUsers} users | goo.gl/qoVTdx`,
        type: 0
      }
    });
  }, 60000);
  updatePres;
});

// raw event handler for uncached messages
client.on('raw', async event => {
  if (event.t !== 'MESSAGE_REACTION_ADD') return;  // make sure its a reaction
  let {d: data} = event;
  let channel = client.channels.get(data.channel_id);  // there is prob a better way to check but eh its 2
  if (client.channels.get(data.channel_id)) {  // if its not a dm return
    // if (data.channel_id != '402957479153238017') return; // if its not in the role req channel
    client.fetchUser(data.user_id).then(user => {
      channel.fetchMessage(data.message_id).then(message => {
        let reaction = message.reactions.get(data.emoji.id || data.emoji.name);
        client.emit('messageReactionAdd', reaction, user);
      });
    });
  } else {
    let channel = client.users.get(data.user_id).dmChannel;
    let user = client.users.get(data.user_id);
    let message = await channel.messages.get(data.message_id);
    let reaction = message.reactions.get(data.emoji.id || data.emoji.name);
    client.emit('messageReactionAdd', reaction, user);
  }
});

client.on('guildMemberAdd', (member) => {  // welcome a new member and send them
                                           // the role chooser
  let roleMap = JSON.parse(fs.readFileSync('data/roleMap.json'));
  let filter = (user) => user.bot === false;
  console.log(`${member.user.username} has joined!`);
  member.send('https://imgur.com/a/H9eIw');
  member.send(
      'You can choose your roles by reacting with its corresponding emoji from the list below');
  member
      .send(
          'Skills: \n :play_pause: : YouTuber :paintbrush: : Artist :desktop: : Programmer :video_game: : Gamer')
      .then(e => {
        for (let i = 0; i < 4; i++) {
          e.react(roleMap.roles[i].emojiId);
        }
      });
  member
      .send(
          'Personality: \n :baseball: ️: Athletic :mortar_board: : Smart :no_mouth: : Quiet :scream: : Loud :thumbsup: : Nice')
      .then(e => {
        for (let i = 4; i < 9; i++) {
          e.react(roleMap.roles[i].emojiId);
        }
      });
  member
      .send(
          'Age Groups: \n :military_medal: : 7 - 12 :third_place: : 13 - 15 :second_place: : 16 - 18 :first_place: : 19 - 21 :medal: : 25 - 30 :gem: : 30 +')
      .then(e => {
        for (let i = 9; i < 15; i++) {
          e.react(roleMap.roles[i].emojiId);
        }
      });
  member
      .send(
          'Activity: \n :radio_button:: Active :large_blue_circle: : Please @ me :red_circle: : Don \'t @ me')
      .then(e => {
        for (let i = 15; i < 18; i++) {
          e.react(roleMap.roles[i].emojiId);
        }
      });
});

client.on(
    'messageReactionAdd',
    (reaction, user) => {  // this is for checking for role reactions
      let emoji = reaction.emoji.name;
      let roleMap = JSON.parse(fs.readFileSync('data/roleMap.json'));
      let undGuild = client.guilds.get('386311668155547660');
      for (let i = 0; i < roleMap.roles.length; i++) {
        if (emoji == roleMap.roles[i].emojiId) {
          let desRole = undGuild.roles.get(roleMap.roles[i].roleId);
          undGuild.fetchMember(user).then(guildUser => {
            guildUser.addRole(desRole, 'user selected role');
          });
        }
      }
    });

// handlers for errors and disconnects
client.on('disconnect', function(event) {
  if (event.code != 1000) {
    console.log(
        'Discord client disconnected with reason: ' + event.reason + ' (' +
        event.code + '). Attempting to reconnect in 6s...');
    setTimeout(function() { client.login(token); }, 6000);
  }
});

client.on('error', function(err) {
  console.log(
      'Discord client error \'' + err.code +
      '\'. Attempting to reconnect in 6s...');
  client.destroy();
  setTimeout(function() { client.login(token); }, 6000);
});

process.on('rejectionHandled', (err) => {
  console.log(err);
  console.log('an error occurred. reconnecting...');
  client.destroy();
  setTimeout(function() { client.login(token); }, 2000);
});

process.on('exit', function() { client.destroy(); });

client.login(token);
