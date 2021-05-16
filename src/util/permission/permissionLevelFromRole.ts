import { PermissionLevel } from "./permissionLevel";
import { RoleType } from "./roleType";

export function permissionLevelFromRole(role: string) {
    switch (role) {
        case RoleType.Customer:
            return PermissionLevel.Customer

        case RoleType.Support:
            return PermissionLevel.Support
        
        case RoleType.Developer:
            return PermissionLevel.Developer
        
        case RoleType.Admin:
            return PermissionLevel.Admin

        default:
            return PermissionLevel.Everyone
    }
}