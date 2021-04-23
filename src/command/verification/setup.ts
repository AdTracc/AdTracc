import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";
import { CodeModel } from "../../model/code";
import { ServerModel } from "../../model/server";

export default class SetupCommand extends Command {
    constructor() {
		super('setup', {
			aliases: ['setup'],
			category: 'verification',
            clientPermissions: ['MANAGE_CHANNELS'],
            userPermissions: 'MANAGE_GUILD',
			description: {
				content: 'Sets up your server to use AdTracc',
			},
            args: [	
                { 
                    id: 'serverName',
                    type: 'string',
                    prompt: {
						start: (msg: Message) =>
							`${msg.author}, What server would you like to watch for?`,
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
        
        if (await ServerModel.exists({minecraftServerName: serverName, guildID: msg.guild.id})) return msg.channel.send('This server is already linked, use the settings command to modify the setup');

        let newChannel: TextChannel;
        const currentServerModel = await ServerModel.findOne({guildID: msg.guild.id});
        
        const adChannelExists = msg.guild.channels.cache.some(channel => channel.name === 'ad-tracc')

        if (!adChannelExists || !currentServerModel) {
            newChannel = await msg.guild?.channels.create('ad-tracc', {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: msg.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL']
                    }
                ]
            })
        }
        else {
            newChannel = msg.guild.channels.resolve(currentServerModel.logChannelID) as TextChannel;
        }
        

        let guilds = codeInfo.guilds;
        guilds.push(msg.guild.id);
        await codeInfo.updateOne({guilds: guilds}).exec();
        this.client.serverNameCache.push(serverName);

        await ServerModel.create({minecraftServerName: serverName, guildID: msg.guild.id, logChannelID: newChannel.id});

        msg.channel.send(`Setup channel ${newChannel} for ${serverName}`);
	}
}