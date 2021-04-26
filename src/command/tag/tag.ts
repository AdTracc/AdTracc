import { Flag } from 'discord-akairo';
import { Message } from 'discord.js';
import { MESSAGES } from '../../util/constants';
import { ArgumentOptions } from 'discord-akairo';
import { Command } from 'discord-akairo';

export default class TagCommand extends Command {
	constructor() {
		super('tag', {
			aliases: ['tag'],
			description: {
				content: `Manage tags.
				Available subcommands:
				• **show** \`<name/alias>\`
				• **set** \`<name> <content>\`
				• **setalias** \`<alias> <target>\`
				• **listaliases**
				• **deletealias** \`<alias>\`
				• **info** \`<name/alias>\`
				• **source** \`<name/alias>\`
				• **list \`[section]\`**
				• **rename** \`<old name> <new name>\`
				• **delete** \`<name>\`
				• **setsection** \`<name> <section>\`
				`,
				usage: '<method> <...arguments>',
				examples: [
					'show meta',
					'set informative minehut :point_right: If you want a great server host, use minehut.com',
					'setalias mh minehut',
					'deletealias mh',
					'info minehut',
					'info mh',
					'source timings',
					'rename minehut memehut',
					'delete memehut',
					'setsection minehut useful',
				],
			},
			category: 'tag',
			channel: 'guild',
		});
	}

	*args(): IterableIterator<ArgumentOptions|Flag> {
		const method = yield {
			type: [
				['tag-set', 'set'],

				['tag-delete', 'delete'],
				['tag-delete', 'del'],

				['tag-show', 'show'],
				['tag-list', 'list'],
				['tag-info', 'info'],
				['tag-rename', 'rename'],
				['tag-source', 'source'],

				['tag-listaliases', 'listaliases'],
				['tag-setalias', 'setalias'],
				['tag-deletealias', 'deletealias'],
				['tag-deletealias', 'delalias'],

				['tag-setsection', 'setsection']
			],
			otherwise: (_msg: Message) => {
				const prefix = (this.handler.prefix) as string;
				return MESSAGES.commands.useHelp(prefix, this.aliases[0]);
			},
		};

		return Flag.continue(method!);
	}
}
