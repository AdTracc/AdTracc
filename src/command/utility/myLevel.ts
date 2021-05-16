import { Message } from 'discord.js';
import { TraccCommand } from '../../structure/command/traccCommand';
import { getPermissionLevel } from '../../util/permission/getPermissionLevel';
import { PermissionLevel } from '../../util/permission/permissionLevel';

export default class PingCommand extends TraccCommand {
	constructor() {
		super('myLevel', {
			aliases: ['mylevel'],
			channel: 'guild',
			category: 'utility',
			description: {
				content: 'Show your permission level',
			},
		});
	}

	async exec(msg: Message) {
		const permLevel = getPermissionLevel(msg.author, this.client);
		msg.channel.send(
			`Your permission level is ${permLevel} (${PermissionLevel[permLevel]})`
		);
	}
}