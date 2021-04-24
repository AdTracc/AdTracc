import { Message } from 'discord.js';
import {
	InhibitorHandler,
	CommandHandler,
	ListenerHandler,
} from 'discord-akairo';
import { MESSAGES } from '../../util/constants';
import { Command } from 'discord-akairo';

export default class ReloadCommand extends Command {
	constructor() {
		super('reload', {
			aliases: ['reload'],
			category: 'utility',
			channel: 'guild',
			ownerOnly: true,
			description: {
				content: 'Reload a module',
				usage: '<handler> <moduleid>',
				examples: ['cmd ping'],
			},
			args: [
				{
					id: 'handler',
					type: 'handler',
				},
				{
					id: 'module',
					type: 'string',
				},
			],
		});
	}

	async exec(
		msg: Message,
		{
			handler,
			module,
		}: {
			handler: CommandHandler | InhibitorHandler | ListenerHandler;
			module: string;
		}
	) {
		const prefix = (this.handler.prefix) as string;
		try {
			if (!handler || !module)
				return msg.channel.send(
					MESSAGES.commands.useHelp(prefix, this.aliases[0])
				);
			const mod = handler.reload(module);
			const proto = Object.getPrototypeOf(mod.constructor);
			msg.channel.send(
				`reloaded ${proto.name.toLowerCase()} \`${mod.id}\` ${
					mod.category ? `(${mod.category})` : ''
				}`
			);
		} catch (err) {
			const e = err as Error;
			msg.channel.send(`${process.env.EMOJI_WARNING} ${e.message}`);
		}
	}
}
