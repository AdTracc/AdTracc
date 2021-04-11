import { Listener } from 'discord-akairo';

export default class MinecraftSpawnListener extends Listener {
	constructor() {
		super('mc-spawn', {
			emitter: 'minecraft',
			event: 'spawn',
		});
	}

	async exec() {
		return console.log("Spawned!");
	}
}