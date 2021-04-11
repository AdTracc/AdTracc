import { Listener } from 'discord-akairo';

export default class MinecraftKickedListener extends Listener {
	constructor() {
		super('mc-kicked', {
			emitter: 'minecraft',
			event: 'kicked',
		});
	}

	async exec() {
        console.log(`Kicked`)
    }
}