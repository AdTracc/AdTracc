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
			host: this.client.mcBot?.options.host,
			username: this.client.mcBot?.options.username!,
			password: this.client.mcBot?.options.password,
			version: this.client.mcBot?.options.version,
			auth: this.client.mcBot?.options.auth
		})
		this.client.mcBot.addChatPattern('ad', /^\[AD\] *(\[.+\])* (\S+): \/join ([^\s]*) (.+)/, {repeat: true, parse: true})
	}, 30000)
	}
}