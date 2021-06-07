import { PermissionLevel } from './permissionLevel';
import { permissionLevelFromRole } from './permissionLevelFromRole';
import { TraccClient } from '../../client/discord/traccClient';
import { RoleType } from './roleType';
import { User } from 'discord.js';

export function getPermissionLevel(user: User, client: TraccClient) {
	if (client.ownerIds?.includes(user.id)) return PermissionLevel.BotDeveloper;
	const mainGuild = client.guilds.cache.get(process.env.MAIN_SERVER_ID!);
	// All role types
	const allRoles: string[] = Object.values(RoleType);
	
	const member = mainGuild?.members.cache.get(user.id);
	// If a member isn't in the main guild then they have no permissions.
	if (!member) return PermissionLevel.Everyone;
	const roles = member.roles.cache.filter(memberRole =>
		allRoles.includes(memberRole.name)
	);
	
	if (roles.size < 1) return PermissionLevel.Everyone;

	const highestRole = roles.sort((a, b) => a.position - b.position).last();
	if (!highestRole) return PermissionLevel.Everyone;
	if (!mainGuild?.roles.cache.some(role => role.name === highestRole.name))
		throw new Error('role permission level is not defined');

	return permissionLevelFromRole(highestRole.name);
}