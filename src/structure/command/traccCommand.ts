import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { getPermissionLevel } from "../../util/permission/getPermissionLevel";
import { PermissionLevel } from "../../util/permission/permissionLevel";
import { TraccCommandOptions } from "./traccCommandOptions";

export class TraccCommand extends Command {
    permissionLevel: PermissionLevel;

    constructor(id: string, options?: TraccCommandOptions) {
        super(id, options)

        this.permissionLevel = options?.permissionLevel || PermissionLevel.Everyone;

        this.userPermissions = (msg: Message) => {
			if (msg.author) {
				if (getPermissionLevel(msg.author!, this.client) < this.permissionLevel)
					return this.permissionLevel;
				return null;
			}

			return null;
		};
    }
    
}