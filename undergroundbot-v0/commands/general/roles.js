const {
	Command
} = require('discord.js-commando');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roles',
			group: 'general',
			memberName: 'roles',
			description: 'Lists all roles that you can set for yourself.',
			examples: ['roles']
		});
	}
  async run(msg, args) {
    msg.channel.say('You can choose your roles by reacting with its corresponding emoji from the list below');
    msg.channel.say('Skills: \n :play_pause: : YouTuber :paintbrush: : Artist :desktop: : Programmer :video_game: : Gamer');
    msg.channel.say('Personality: \n :baseball: ️: Athletic :mortar_board: : Smart :no_mouth: : Quiet :scream: : Loud :thumbsup: : Nice');
    msg.channel.say('Age Groups: \n :military_medal: : 7 - 12 :third_place: : 13 - 15 :second_place: : 16 - 18 :first_place: : 19 - 21 :medal: : 25 - 30 :gem: : 30 +');
    msg.channel.say('Activity: \n :radio_button: : Active :large_blue_circle: : Please @ me :red_circle: : Don \'t @ me');
  }
};