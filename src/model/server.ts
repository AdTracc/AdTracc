import { getModelForClass, prop } from "@typegoose/typegoose";

export class Server {

    @prop({required: true})
    minecraftServerName!: string;

    @prop({required: true})
    guildID!: string;

    @prop({required: true})
    channelID!: string;

}

export const ServerModel = getModelForClass(Server);