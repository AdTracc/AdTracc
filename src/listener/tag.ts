import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { TagModel } from '../model/tag';
import { getPermissionLevel } from '../util/permission/getPermissionLevel';
import { PermissionLevel } from '../util/permission/permissionLevel';

export default class TagListener extends Listener {
	constructor() {
		super('tag', {
			emitter: 'commandHandler',
			event: 'messageInvalid',
		});
	}

	async exec(msg: Message) {
		if (msg.guild && msg.util?.parsed?.prefix) {
            if (msg.guild.id != process.env.MAIN_SERVER_ID) return;
			if (!msg.util?.parsed?.alias || !msg.util?.parsed?.afterPrefix) return;
			if (getPermissionLevel(msg.author, this.client) < PermissionLevel.Support) return;
			const name = msg.util?.parsed?.afterPrefix.split(' ')[0];
			const tag = await TagModel.findByNameOrAlias(name.toLowerCase());
			if (!tag) return;
			const command = this.client.commandHandler.modules.get('tag-show')!;
			return this.client.commandHandler.runCommand(
				msg,
				command,
				await command.parse(msg, msg.util?.parsed?.afterPrefix)
			);
		}
	}
}