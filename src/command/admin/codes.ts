import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { User } from "discord.js";
import { Message } from "discord.js";
import { CodeModel } from "../../model/code";

export default class CodesCommand extends Command {
    constructor() {
		super('codes', {
            ownerOnly: true,
			aliases: ['codes'],
			category: 'verification',
			description: {
				content: 'Sets the limit for a specific code',
			},
			args: [
				{
					id: 'user',
					type: 'user',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, Who would you like to look up codes for?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a valid user.`,
					}
				},
			]
		});
	}

	async exec(msg: Message, { user }: { user: User }) {
		const codeModels = await CodeModel.find({owner: user.id});

        if (!codeModels) return msg.channel.send(`This user has no codes assigned to them!`);
        
        let userCodes = codeModels.map(model => `\`${model._id}\``);

        const embed = new MessageEmbed()
        .setTitle(`${user.tag}'s codes`)
        .setColor('#32CD32')
        .setDescription(`${userCodes.join('\n')}`)
        return msg.channel.send(embed);
	}
}