import { Listener } from 'discord-akairo';
import { ChatMessage } from 'mineflayer';

export default class MinecraftMessageListener extends Listener {
	constructor() {
		super('mc-message', {
			emitter: 'minecraft',
			event: 'message',
		});
	}

	async exec(_msg: ChatMessage) {
		return;
	}
}