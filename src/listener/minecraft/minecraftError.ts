import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';

export default class MinecraftErrorListener extends Listener {
	constructor() {
		super('mc-error', {
			emitter: 'minecraft',
			event: 'error',
		});
	}

	async exec(err: Error) {
		const channel = await this.client.channels.fetch(process.env.MINECRAFT_LOG_ID!) as TextChannel;
		channel.send(`Ad-Tracc Account errored: ${err}`);
        console.log(`Minecraft Bot error occurred: ${err}`)
    }
}