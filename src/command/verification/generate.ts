import { User } from "discord.js";
import { Message } from "discord.js";
import { CodeModel } from "../../model/code";
import { TraccCommand } from "../../structure/command/traccCommand";
import { randomAlphanumericString } from "../../util/functions";

export default class GenerateCommand extends TraccCommand {
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
		const generatedCode = randomAlphanumericString(5);
		if (await CodeModel.exists({owner: customer.id})) return msg.channel.send(`This user already has a code!`);
		
		await CodeModel.create({
			_id: generatedCode,
			owner: customer.id,
		});

		return msg.channel.send(`Generated new code for **${customer.tag}** | **Code:** ${generatedCode}`);
	}
}