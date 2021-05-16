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

		const servers = await ServerModel.find({activated: true});

		servers.forEach(server => {
			const name = server.minecraftServerName.toLowerCase();
			this.client.serverNameCache.push(name);
		});

		this.client.user?.setActivity('discord.adtracc.xyz', { type: 'WATCHING'});
	}
}
