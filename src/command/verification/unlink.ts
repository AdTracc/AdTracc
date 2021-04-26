import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { CodeModel } from "../../model/code";
import { ServerModel } from "../../model/server";

export default class SetupCommand extends Command {
    constructor() {
		super('unlink', {
			aliases: ['unlink'],
			category: 'verification',
            userPermissions: 'MANAGE_GUILD',
			description: {
				content: 'Unlinks a server from your discord server',
			},
            args: [	
                { 
                    id: 'serverName',
                    type: 'string',
                    prompt: {
						start: (msg: Message) =>
							`${msg.author}, What server would you like to unlink?`,
						retry: (msg: Message) =>
							`${msg.author}, please specify a valid server.`,
					}
                }
            ]
		});
	}

	async exec(msg: Message, { serverName }: { serverName: string}) {
        if (!msg.guild) return;
		
        const codeInfo = await CodeModel.findOne({owner: msg.author.id});
        if (!codeInfo) return msg.channel.send(`You do not have access to use this command.`);

        if (codeInfo.owner != msg.author.id) return msg.channel.send('You cannot use this code.')
        
        if (!await ServerModel.exists({minecraftServerName: serverName.toLowerCase(), guildID: msg.guild.id})) return msg.channel.send('This server is not linked');

        await ServerModel.deleteOne({minecraftServerName: serverName.toLowerCase(), guildID: msg.guild.id}).exec();
        msg.channel.send(`Unlinked server ${serverName}`);


	}
}