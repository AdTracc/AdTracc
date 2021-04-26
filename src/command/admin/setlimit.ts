import { DocumentType } from "@typegoose/typegoose";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { Code } from "../../model/code";

export default class SetLimitCommand extends Command {
    constructor() {
		super('setlimit', {
            ownerOnly: true,
			aliases: ['setlimit'],
			category: 'verification',
			description: {
				content: 'Sets the limit for a specific code',
			},
			args: [
				{
					id: 'code',
					type: 'activationCode',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, What code would you like to change the limit for?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a valid code.`,
					}
				},
                {
					id: 'limit',
					type: 'integer',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, What would you like to change the limit to?`,
						retry: (msg: Message) =>
							`${msg.author}, Input a valid integer.`,
					}
				}
			]
		});
	}

	async exec(msg: Message, { code, limit }: { code: DocumentType<Code>, limit: number }) {
		
        await code.updateOne({ limit }).exec();
        return msg.channel.send(`Set limit for ${code._id} to ${limit}`);
	}
}