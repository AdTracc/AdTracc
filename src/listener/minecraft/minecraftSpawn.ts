import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';

export default class MinecraftSpawnListener extends Listener {
	constructor() {
		super('mc-spawn', {
			emitter: 'minecraft',
			event: 'spawn',
		});
	}

	async exec() {
		const channel = await this.client.channels.fetch(process.env.MINECRAFT_LOG_ID!) as TextChannel;
		channel.send(`Ad-Tracc Account has spawned`);
		return console.log("Spawned!");
	}
}