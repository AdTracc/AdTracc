import { ArgumentOptions } from "discord-akairo";
import { Flag } from "discord-akairo";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";
import { ServerModel } from "../../model/server";
import { TraccCommand } from "../../structure/command/traccCommand";

export default class SettingsCommand extends TraccCommand {
    constructor() {
		super('settings', {
			aliases: ['settings', 'setting'],
			category: 'verification',
            clientPermissions: ['MANAGE_CHANNELS'],
            userPermissions: 'MANAGE_GUILD',
			description: {
				content: 'Changes ad-tracc settings for your server',
			},
            // args: [	
            //     { 
            //         id: 'setting',
            //         type: ['server', 'channel'],
            //         prompt: {
			// 			start: (msg: Message) =>
			// 				`${msg.author}, What setting do you want to change? (server, channel)`,
			// 			retry: (msg: Message) =>
			// 				`${msg.author}, please specify a valid setting! (server, channel)`,
			// 		}
            //     },
            //     { 
            //         id: 'value',
			// 		type: 'string',
			// 		prompt: {
			// 			start: (msg: Message) => {
            //                 let argMsg: string | undefined;
            //                 if (msg.content.includes('server')) argMsg = 'server name'
            //                 else if (msg.content.includes('channel')) argMsg = 'ad-tracc channel id'
			// 				`${msg.author}, please enter the new ${argMsg ?? 'value'}.`
			// 			},
			// 			retry: (msg: Message) => `${msg.author}, Invalid argument! please try again!`,

			// 		}
            //     }
            // ]
		});
	}

    *args(): IterableIterator<(ArgumentOptions|Flag)> {
        const setting = yield { 
            type: ['server', 'channel'], 
            prompt: {
            start: (msg: Message) =>
                `${msg.author}, What setting do you want to change? (server, channel)`,
            retry: (msg: Message) =>
                `${msg.author}, please specify a valid setting! (server, channel)`,
        }};
        let argType, argPromptMsg: string;
        if (setting == 'channel') {
            argType = 'textChannel'
            argPromptMsg = 'Please enter a valid channel'
        }

        else { 
            argType = 'string'
            argPromptMsg = 'Please enter a minehut server name'
        }

        const value = yield { 
            type: argType,
            prompt: {
                start: (msg: Message) => 
                `${msg.author}, ${argPromptMsg}`,
                retry: (msg: Message) => `${msg.author}, Invalid argument! please try again!`,
            }
            
        }

        return { setting, value }
    }


	async exec(msg: Message, { setting, value }: { setting: 'server' | 'channel', value: string | TextChannel}) {
		if (!msg.guild) return;
        // await ServerModel.updateOne({guildID: msg.guild.id} , { stuff });
		if (setting == 'server') {
            if (typeof value === 'string') {
				ServerModel.updateOne({guildID: msg.guild.id}, {
					minecraftServerName: value
				})
				msg.reply(`✅ Successfully updated Server setting to \`${value}\``)
			} else {
				msg.reply(`❌ An error occurred: Server value must be a string`)
			}
		}
		if (setting == 'channel') {
			if (value instanceof TextChannel) {
				ServerModel.updateOne({guildID: msg.guild.id}, {
					channelID: value.id
				})
				msg.reply(`✅ Successfully updated Channel setting to \`${value}\``)
			}
			else {
				msg.reply(`❌ An error occurred: Invalid Channel!`)
			}
		}
	}
}