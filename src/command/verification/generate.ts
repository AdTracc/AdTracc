import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { User } from "discord.js";
import { Message } from "discord.js";
import { CodeModel } from "../../model/code"
import { randomAlphanumericString } from "../../util/functions";

export default class GenerateCommand extends Command {
    constructor() {
		super('generate', {
			aliases: ['generate'],
			category: 'verification',
            ownerOnly: true,
			description: {
				content: 'Generates an activation code',
			},
			args: [
				{
					id: 'customer',
					type: 'user',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, who would you like to generate a code for?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a valid user.`,
					},
				}
			]
		});
	}

	async exec(msg: Message, { customer }: { customer: User }) {
		let generatedCode = randomAlphanumericString(5);
		if (await CodeModel.exists({_id: generatedCode})) {
			while (await CodeModel.exists({_id: generatedCode})) {
				generatedCode = randomAlphanumericString(5);
			}
		}
		if (await CodeModel.exists({owner: customer.id})) return msg.channel.send(`This user already has a code!`);
		
		await CodeModel.create({
			_id: generatedCode,
			owner: customer.id,
		});
		const activationLog = this.client.channels.cache.get('830202847177342987') as TextChannel;
		activationLog.send(`Generated new code for **${customer.tag}** | **Code:** ${generatedCode}`);
		return msg.channel.send(`Generated new code for **${customer.tag}** | **Code:** ${generatedCode}`);
	}
}