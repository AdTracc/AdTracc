import { Message } from 'discord.js';
import { TraccCommand } from '../../structure/command/traccCommand';

export default class ErrorCommand extends TraccCommand {
	constructor() {
		super('error', {
			aliases: ['error'],
			category: 'utility',
			description: {
				content: 'Throw an error',
			},
			ownerOnly: true,
		});
	}

	async exec(msg: Message) {
		msg.react('👌');
		throw new Error('This is an error from the error command');
	}
}
