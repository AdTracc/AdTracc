import { getModelForClass, prop } from "@typegoose/typegoose";

export class Code {
    @prop({required: true})
    _id!: string;

    @prop({required: true})
    owner!: string;

    @prop({required: false, type: String})
    guilds!: string[]

    @prop({required: true})
    limit!: number;

}

export const CodeModel = getModelForClass(Code);