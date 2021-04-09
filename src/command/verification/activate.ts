import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import { Code } from "../../model/code";
import { TraccCommand } from "../../structure/command/traccCommand";

export default class ActivateCommand extends TraccCommand {
    constructor() {
		super('activate', {
			aliases: ['activate', 'redeem'],
			category: 'verification',
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
		
		if (code.guilds.includes(msg.guild.id)) {
			msg.channel.send(`${msg.guild.name} already has Ad-Tracc enabled!`);
		}

		code = await code.updateOne({
			guilds: code.guilds.push(msg.guild.id)
		}).catch((e: Error) => {
			msg.channel.send(`An error occured while saving your data, contact an administrator`);
			console.error(e);
		});

		
		msg.channel.send(`Ad-Tracc has been enabled for ${msg.guild.name}`);
		this.client.guilds.cache.get(process.env.ACTIVATION_CHANNEL!)
		
	}
}