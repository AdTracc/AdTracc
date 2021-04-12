import { Listener } from 'discord-akairo';
import { ServerModel } from '../model/server';

export default class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		});
	}

	async exec() {
		console.log(`Logged in as ${this.client.user?.tag}`);

		const servers = await ServerModel.find();

		servers.map(server => {
			this.client.serverCacheManager.addValue(server.minecraftServerName, server)
		})
	}
}
