import { Listener } from 'discord-akairo';
import mineflayer from 'mineflayer';

export default class MinecraftEndListener extends Listener {
	constructor() {
		super('mc-end', {
			emitter: 'minecraft',
			event: 'end',
		});
	}

	async exec() {
		setTimeout(() => { 
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