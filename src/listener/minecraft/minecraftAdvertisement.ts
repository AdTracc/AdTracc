import { mongoose } from '@typegoose/typegoose';
import { Listener } from 'discord-akairo';
import { MessageEmbed, TextChannel } from 'discord.js';
import { ServerModel } from '../../model/server';
import { ServerStatModel } from '../../model/serverstats';

export default class MinecraftAdvertisementListener extends Listener {
	constructor() {
		super('mc-ad', {
			emitter: 'minecraft',
			event: 'chat:ad',
		});
	}

	async exec(ad: RegExpMatchArray) {
		//#miunehut-chat in bot category
		const channel = await this.client.channels.fetch('829551447774724166') as TextChannel;
        
		const adRank = ad[0][0] || 'Default'
		const advertiser = ad[0][1]
		const serverName = ad[0][2].toLowerCase();
		const adMessage = ad[0][3]

        const embed = new MessageEmbed()
        .addField('**Rank:**', `${adRank}`, true)
        .addField('**Advertiser:**', `${advertiser}`, true)
        .addField('**Server Name:**', `${serverName}`, true)
        .addField('Advertisement Message', `\`${adMessage}\``)
        .setColor('#32CD32')
        .setTimestamp()
        .setAuthor(this.client.user?.username, this.client.user?.displayAvatarURL());

		channel.send(embed).catch(e => console.log(e));
		const name = serverName.toLowerCase();
		if (!this.client.serverNameCache.includes(name)) return;

		const linkedServers = await ServerModel.find({minecraftServerName: serverName.toLowerCase()});

		const serverStats = await ServerStatModel.findOne({minecraftServerName: serverName.toLowerCase()});

		if (!serverStats) {
			const statsCollection = new mongoose.Types.Map<number>();
			statsCollection.set(advertiser, 1);
			ServerStatModel.create({minecraftServerName: serverName.toLowerCase(), advertisementAmount: statsCollection})
		}

		else {
			if (serverStats.advertisementAmount) {
				const count = serverStats.advertisementAmount.get(advertiser) ?? 1;
				serverStats.advertisementAmount.set(advertiser, count + 1);
				serverStats.save();
			}
			else {
				let updatedStats = new mongoose.Types.Map<number>();
				updatedStats.set(advertiser, 1);
				await serverStats.updateOne({advertisementAmount: updatedStats}).exec()
			}
		}

		if (linkedServers.length >= 1) {
			for (let server of linkedServers) {
				const channel = await this.client.channels.fetch(server.logChannelID) as TextChannel;
				channel.send(`\`${adRank}|&|${advertiser}|&|${serverName}|&|${adMessage}\``).catch(e => console.log(e));
				if (server.notifyAdChannelID) {
					if (server.notifyAdChannelID != 'none') {
						const notifyAdChannel = this.client.channels.cache.get(server.notifyAdChannelID) as TextChannel;
						const embed = new MessageEmbed()
						.addField('**Rank:**', `${adRank}`, true)
						.addField('**Advertiser:**', `${advertiser}`, true)
						.addField('**Server Name:**', `${serverName}`, true)
						.addField('Advertisement Message', `\`${adMessage}\``)
						.setColor('#32CD32')
						.setTimestamp()
						.setAuthor(advertiser, `https://minotar.net/helm/${advertiser}.png)`);
						notifyAdChannel.send(embed).catch(e => console.log(e));
					}
				}
			}
		}
	}
}