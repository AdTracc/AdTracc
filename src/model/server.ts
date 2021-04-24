import { getModelForClass, prop } from "@typegoose/typegoose";

export class Server {

    @prop({required: true})
    minecraftServerName!: string;

    @prop({required: true})
    guildID!: string;

    @prop({required: true})
    logChannelID!: string;

    @prop({required: false})
    notifyAdChannelID!: string;

}

export const ServerModel = getModelForClass(Server);