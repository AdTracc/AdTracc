import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';

export default class MinecraftCaptchaListener extends Listener {
	constructor() {
		super('mc-capthca', {
			emitter: 'minecraft',
			event: 'messagestr',
		});
	}

	async exec(msg: string) {
		if (msg === "Use /recaptcha if the captcha is too hard to read.") {
			const channel = await this.client.channels.fetch(process.env.MINECRAFT_LOG_ID!) as TextChannel;
			channel.send(`Ad-Tracc Account has joined captcha, attempting to relog...`);
			this.client.mcBot?.end();
        }
	}
}