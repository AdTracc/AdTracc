import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';

export default class MinecraftLoginListener extends Listener {
	constructor() {
		super('mc-login', {
			emitter: 'minecraft',
			event: 'login',
		});
	}

	async exec() {
		const channel = await this.client.channels.fetch(process.env.MINECRAFT_LOG_ID!) as TextChannel;
		channel.send(`Ad-Tracc Account has connected`);
		return console.log('Minecraft Bot Logged in!');
	}
}