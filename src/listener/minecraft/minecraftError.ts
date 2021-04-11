import { Listener } from 'discord-akairo';

export default class MinecraftErrorListener extends Listener {
	constructor() {
		super('mc-error', {
			emitter: 'minecraft',
			event: 'error',
		});
	}

	async exec(err: Error) {
        console.log(`Minecraft Bot error occurred: ${err}`)
    }
}