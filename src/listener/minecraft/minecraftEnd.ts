import { Listener } from 'discord-akairo';

export default class MinecraftEndListener extends Listener {
	constructor() {
		super('mc-end', {
			emitter: 'minecraft',
			event: 'end',
		});
	}

	async exec() {
		return console.log('Disconnected');
	}
}