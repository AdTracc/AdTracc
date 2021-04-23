import { DocumentType } from "@typegoose/typegoose"
import { Command } from "discord-akairo";
import { Argument, Flag, ArgumentOptions  } from "discord-akairo";
import { MessageEmbed, TextChannel, Message } from "discord.js";
import { Server, ServerModel } from "../../model/server";

export default class SettingsCommand extends Command {
    constructor() {
		super('settings', {
			aliases: ['settings', 'setting'],
			category: 'verification',
            clientPermissions: ['MANAGE_CHANNELS'],
            userPermissions: 'MANAGE_GUILD',
			description: {
				content: 'Changes ad-tracc settings for your server',
			},
		});
	}

    *args(): IterableIterator<(ArgumentOptions|Flag)> {
		let prefix = this.handler.prefix;
		let embed: MessageEmbed; 
		const server = yield {
			type: 'mhServer',
			otherwise: async (msg: Message) => {
				if (!msg.guild) return;
				
				const servers = await ServerModel.find({guildID: msg.guild.id});
				if (servers.length >= 1) {
					embed = new MessageEmbed()
					.setTitle(`${msg.guild?.name} Settings`)
					.setColor('#32CD32')
					.setFooter(`Use ${prefix}settings <server name> <setting> <value/none> to modify`);
					servers.forEach((server) => {
						embed.addField('Server Name', server.minecraftServerName, false)
						embed.addField('logchannel (Minecraft -> Discord -> Minecraft)', `<#${server.logChannelID}>`, true)
						embed.addField('adchannel (embeded notifcations)', `${server.notifyAdChannelID ? `<#${server.notifyAdChannelID}>` : 'none'}`, true)
					})
				}

				return embed ?? 'There are currently no linked servers';
			}
		}
		const setting = yield { 
            type: ['logchannel', 'adchannel'], 
            prompt: {
            start: (msg: Message) =>
                `${msg.author}, What setting do you want to change? (logchannel, adchannel)`,
            retry: (msg: Message) =>
                `${msg.author}, please specify a valid setting! (logchannel, adchannel)`,
        }};
        
		let argPromptMsg: string;
        if (setting == 'logchannel') {
            argPromptMsg = 'Please enter a valid channel for logs'
        } else if (setting == 'adchannel') {
            argPromptMsg = 'Please enter a valid channel for advertisement notifications'
        }

        const value = yield { 
            type: Argument.union('textChannel', 'none'),
            prompt: {
                start: (msg: Message) => 
                `${msg.author}, ${argPromptMsg} or none to disable`,
                retry: (msg: Message) => `${msg.author}, Invalid argument! please try again!`,
            }
            
        }

        return { server, setting, value }
    }


	async exec(msg: Message, { server, setting, value }: { server: DocumentType<Server>, setting: 'logchannel' | 'adchannel', value: TextChannel | 'none' }) {
		if (!msg.guild) return;
		if (!server) return;
        // await ServerModel.updateOne({guildID: msg.guild.id} , { stuff });
		if (setting == 'logchannel') {
			if (value instanceof TextChannel) {
				await ServerModel.updateOne({minecraftServerName: server.minecraftServerName, guildID: msg.guild.id}, {
					logChannelID: value.id
				}).exec()
				msg.reply(`✅ Successfully updated Log Channel setting to ${value}`)
			}
			else if (value === 'none') {
				msg.reply(`❌ An error occurred: This cannot be disabled!`)
			}
			else {
				msg.reply(`❌ An error occurred: Invalid Channel!`)
			}
		}
		if (setting === 'adchannel') {
			if (value instanceof TextChannel) {
				await ServerModel.updateOne({minecraftServerName: server.minecraftServerName, guildID: msg.guild.id}, {
					notifyAdChannelID: value.id
				}).exec()
				msg.reply(`✅ Successfully updated Advertisement Notification Channel setting to ${value}`)
			}
			else if (value === 'none') {
				await ServerModel.updateOne({minecraftServerName: server.minecraftServerName, guildID: msg.guild.id}, {
					notifyAdChannelID: undefined
				}).exec()
				msg.reply(`✅ Successfully disabled advertisement notification embed`)
			}
			else {
				msg.reply(`❌ An error occurred: Invalid Channel!`)
			}
		}
	}
}