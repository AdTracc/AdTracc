import { DocumentType } from "@typegoose/typegoose";
import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { Server } from "../../model/server";
import { ServerStatModel } from "../../model/serverstats";


export default class StatsCommand extends Command {
    constructor() {
        super('stats', {
            aliases: ['stats'],
            category: 'stats',
            channel: 'guild',
            description: {
                content: 'Checks server advertisement stats from a server for a player',
                usage: '<server name> <mc username>',
				examples: ['cmd ping'],
            },
            args: [
                {
                    id: 'server',
                    type: 'mhServer',
                    prompt: {
                        start: (msg: Message) => 
                            `${msg.author}, What server would you like to check a user's stats from?`,
                        retry: (msg: Message) => 
                            `${msg.author}, Please specify a valid server`,
                    }
                },
                {
                    id: 'username',
                    type: 'string',
                    prompt: {
                        start: (msg: Message) => 
                            `${msg.author}, Who would you like to lookup stats for?`,
                        retry: (msg: Message) => 
                            `${msg.author}, Please specify a valid minecraft username`,
                    }
                }
            ]
        })
    }

    async exec(msg: Message, { server, username}: { server: DocumentType<Server>, username: string}) {
        const serverStats = await ServerStatModel.findOne({minecraftServerName: server.minecraftServerName});
        if (!serverStats?.advertisementAmount.has(username)) return msg.channel.send('This user has no saved stats');
        
        const userStats = serverStats.advertisementAmount.get(username);
        const embed = new MessageEmbed()
        .setTitle(`Stats for ${server.minecraftServerName}`)
        .setColor('32CD32')
        .setAuthor(username, `https://minotar.net/helm/${username}.png)`)
        .addField('Advertisement Count', userStats);

        msg.channel.send(embed);
    }
}