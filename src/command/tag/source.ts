import { Message } from 'discord.js';
import { TagModel } from '../../model/tag';
import { Command } from 'discord-akairo';

export default class TagSourceCommand extends Command {
	constructor() {
		super('tag-source', {
			category: 'tag',
			channel: 'guild',
			description: {
				content: 'Get tag source',
				usage: '<name/alias>',
			},
			args: [
				{
					id: 'name',
					type: 'string',
					prompt: {
						start: (msg: Message) =>
							`${msg.author}, which tag's source do you want to get?`,
					},
				},
			],
		});
	}

	async exec(msg: Message, { name }: { name: string }) {
		name = name.replace(/\s+/g, '-').toLowerCase();
		const prefix = (this.handler.prefix) as string;

		// Find tag with that name or alias
		const tag = await TagModel.findByNameOrAlias(name);
		if (!tag)
			return msg.channel.send(
				`Tag \`${name}\` does not exist, check \`${prefix}tags\``
			);

		msg.channel.send(tag.content, { code: true });
	}
}