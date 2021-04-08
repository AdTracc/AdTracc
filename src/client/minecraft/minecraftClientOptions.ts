export interface MinecraftClientOptions {
    host: string,
    username: string,
    password: string,
    version: string,
    auth: "mojang" | "microsoft" | undefined
}