// this is to keep the bot alive. it periodically checks if the bot is up, and if not, restarts the proc

discord = require("discord.js");
fs = require("fs");
client = new discord.Client();
const keys = JSON.parse(fs.readFileSync("./keys/keys.json")); // read all keys
var sys = require("sys");
var exec = require("child_process").exec;

client.on("ready", () => {
  console.log(`logged in as ${client.user.tag}`);
  undbot = client.users.get("390688999616020491");
  setInterval(function() {
    if (undbot.presence.status !== "online") {
      console.log("bot offline, restarting");
      exec("screen -XS undergroundbot quit", function(err, stdout, stderr) {
        exec("screen -dmS undergroundbot node index.js --harmony", function(err, stdout, stderr) {
            console.log(stdout);
          });
      }); 
    }
  }, 5000);
});

client.login(keys.keepalivetoken);
