import { DocumentType } from "@typegoose/typegoose";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Server } from "../../model/server";

export default class EnableCommand extends Command {
	constructor() {
		super('enable', {
			ownerOnly: true,
			aliases: ['enable'],
			category: 'admin',
			description: {
				content: 'Enables a server',
			},
		args: [
			{
				id: 'server',
				type: 'mhServer',
				prompt: {
					start: (msg: Message) =>
						`${msg.author}, What server would you like to enable?`,
					retry: (msg: Message) =>
						`${msg.author}, please specify a valid server.`,
					}
				},
			]
		});
	}

	async exec(msg: Message, { server }: { server: DocumentType<Server>}) {
		if (server.activated === true) return msg.channel.send(`${server.minecraftServerName} is already enabled.`)
		
		await server.updateOne({ activated: true }).exec();
		if (!this.client.serverNameCache.includes(server.minecraftServerName)) this.client.serverNameCache.push(server.minecraftServerName.toLowerCase());
		return msg.channel.send(`Enabled ${server.minecraftServerName}`);
	}
}