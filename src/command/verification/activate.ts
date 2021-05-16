import { DocumentType } from "@typegoose/typegoose";
import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";
import { Code } from "../../model/code";

export default class ActivateCommand extends Command {
    constructor() {
		super('activate', {
			aliases: ['activate', 'redeem'],
			category: 'verification',
			userPermissions: 'MANAGE_GUILD',
			description: {
				content: 'Activates Ad-Tracc from a unique code',
			},
			args: [
				{
					id: 'code',
					type: 'activationCode',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, What code would you like to redeem?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a valid code.`,
					}
				}
			]
		});
	}

	async exec(msg: Message, { code }: { code: DocumentType<Code> }) {
		if (!msg.guild) return;
		if (code.owner != msg.author.id) return;
		
		if (code.guilds.includes(msg.guild.id)) return msg.channel.send(`${msg.guild.name} already has Ad-Tracc enabled!`);

		let guilds = code.guilds;
		guilds.push(msg.guild.id);
		code = await code.updateOne({
			guilds
		}).catch((e: Error) => {
			msg.channel.send(`An error occured while saving your data, contact an administrator`);
			console.error(e);
		});

		
		msg.channel.send(`Ad-Tracc has been enabled for ${msg.guild.name}`);
		const activationLog = this.client.channels.cache.get(process.env.ACTIVATION_CHANNEL!) as TextChannel;
		activationLog.send(`${msg.author} used code ${code._id} to activate ${msg.guild.name} (${msg.guild.id})`)
		
	}
}