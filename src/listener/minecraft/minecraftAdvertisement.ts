import { Listener } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { TextChannel } from 'discord.js';
import { ChatMessage } from 'mineflayer';
import { ServerModel } from '../../model/server';

export default class MinecraftAdvertisementListener extends Listener {
	constructor() {
		super('mc-ad', {
			emitter: 'minecraft',
			event: 'chat:ad',
		});
	}

	async exec(message: ChatMessage) {
		const channel = this.client.channels.cache.get('829551447774724166') as TextChannel;

        let ad = message.toString().split(',');

        const adRank = ad[0] || 'Default'
		const advertiser = ad[1]
		const serverName = ad[2]
		const adMessage = ad[3]

        const embed = new MessageEmbed()
        .addField('**Rank:**', `${adRank}`, true)
        .addField('**Advertiser:**', `${advertiser}`, true)
        .addField('**Server Name:**', `${serverName}`, true)
        .addField('Advertisement Message', `\`${adMessage}\``)
        .setColor('#32CD32')
        .setTimestamp()
        .setAuthor(this.client.user?.username, this.client.user?.displayAvatarURL());

        channel.send(embed).catch(e => { return e;});

		const linkedServers = await ServerModel.find({minecraftServerName: serverName});
		if (linkedServers) {
			for (let server of linkedServers) {
				const channel = this.client.channels.cache.get(server.channelID) as TextChannel;
				channel.send(embed)
			}
		}
	}
}