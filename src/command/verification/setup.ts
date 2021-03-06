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

        // if (codeInfo.owner != msg.author.id) return msg.channel.send('You cannot use this code.');
        
        if (codeInfo.limit != undefined) {
            const currentGuildAmount = (codeInfo.servers.length ?? 0);
            if (currentGuildAmount >= codeInfo.limit)  {
                return msg.channel.send('You have reached your max limit for this code, create a ticket to increase your limit.');
            }
        }
        
        
        if (await ServerModel.exists({minecraftServerName: serverName.toLowerCase(), guildID: msg.guild.id})) return msg.channel.send('This server is already linked, use the settings command to modify the setup');

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
                    },
                    { 
                        id: this.client.user!.id,
                        allow: ['VIEW_CHANNEL']
                    }
                ]
            })
        }
        else {
            newChannel = msg.guild.channels.resolve(currentServerModel.logChannelID) as TextChannel;
        }
        

        let servers = codeInfo.servers;
        if (!servers) servers = [];
        servers.push(serverName);
        await codeInfo.updateOne({servers: servers}).exec();
        this.client.serverNameCache.push(serverName.toLowerCase());

        await ServerModel.create({minecraftServerName: serverName.toLowerCase(), guildID: msg.guild.id, logChannelID: newChannel.id, activated: true});

        msg.channel.send(`Setup channel ${newChannel} for ${serverName}`);
	}
}