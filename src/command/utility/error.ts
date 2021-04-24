import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class ErrorCommand extends Command {
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
