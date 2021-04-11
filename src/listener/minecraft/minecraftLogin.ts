import { Listener } from 'discord-akairo';

export default class MinecraftLoginListener extends Listener {
	constructor() {
		super('mc-login', {
			emitter: 'minecraft',
			event: 'login',
		});
	}

	async exec() {
		return console.log('Minecraft Bot Logged in!');
	}
}