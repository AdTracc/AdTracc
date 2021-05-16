import { getModelForClass, prop } from "@typegoose/typegoose";

export class Code {
    @prop({required: true, type: String})
    _id!: string;

    @prop({required: true, type: String})
    owner!: string;

    @prop({required: false, type: String})
    guilds!: string[];

    @prop({required: false, type: String})
    servers!: string[];

    @prop({required: true, type: Number})
    limit!: number;

}

export const CodeModel = getModelForClass(Code);