import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import mineflayer from 'mineflayer';

export default class MinecraftEndListener extends Listener {
	constructor() {
		super('mc-end', {
			emitter: 'minecraft',
			event: 'end',
		});
	}

	async exec() {
		setTimeout(async () => {
			const channel = await this.client.channels.fetch(process.env.MINECRAFT_LOG_ID!) as TextChannel;
			channel.send(`Ad-Tracc Account has lost connection or gone offline, attempting to reconnect...`);
			this.client.mcBot = mineflayer.createBot({
			host: this.client.mcBot?.customOptions.host,
			username: this.client.mcBot?.customOptions.username!,
			password: this.client.mcBot?.customOptions.password,
			version: this.client.mcBot?.customOptions.version,
			auth: this.client.mcBot?.customOptions.auth
		})
		this.client.mcBot.addChatPattern('ad', /^\[AD\] *(\[.+\])* (\S+): \/join ([^\s]*) (.+)/, {repeat: true, parse: true})
	}, 30000)
	}
}