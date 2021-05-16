import { CommandOptions } from "discord-akairo";
import { PermissionLevel } from "../../util/permission/permissionLevel";

interface CustomOptions {
    permissionLevel?: PermissionLevel;
}

export type TraccCommandOptions = CustomOptions & CommandOptions;