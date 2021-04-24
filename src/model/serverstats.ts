import { getModelForClass, mongoose, prop } from "@typegoose/typegoose";

class ServerStat {

    @prop({required: true})
    minecraftServerName!: string;

    @prop({required: false, type: Number})
    advertisementAmount!: mongoose.Types.Map<number>;

}

export const ServerStatModel = getModelForClass(ServerStat)