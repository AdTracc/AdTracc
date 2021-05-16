import { DocumentType } from "@typegoose/typegoose";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Server } from "../../model/server";

export default class DisableCommand extends Command {
    constructor() {
		super('disable', {
            ownerOnly: true,
			aliases: ['disable'],
			category: 'admin',
			description: {
				content: 'Disables a server',
			},
			args: [
				{
					id: 'code',
					type: 'activationCode',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, What server would you like to disable?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a valid server.`,
					}
				},
			]
		});
	}

	async exec(msg: Message, { server}: { server: DocumentType<Server>, limit: number }) {
		if (server.activated === false) return msg.channel.send(`${server.minecraftServerName} is already disabled.`)
		
		await server.updateOne({ activated: false }).exec();
        if (this.client.serverNameCache.includes(server.minecraftServerName)) this.client.serverNameCache.splice(this.client.serverNameCache.indexOf(server.minecraftServerName.toLowerCase()));
		return msg.channel.send(`Disabled ${server.minecraftServerName}`);
	}
}