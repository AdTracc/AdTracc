import { MinecraftClientOptions } from "./minecraftClientOptions";
import { readdirSync } from 'fs';
import mineflayer, { BotEvents } from 'mineflayer';

export default class MinecraftClient {

    host: string;
    username: string;
    password: string;
    version: string;
    auth: "microsoft" | "mojang" | undefined;
    client?: mineflayer.Bot;

    constructor(options: MinecraftClientOptions) {
        this.host = options.host;
        this.username = options.username;
        this.password = options.password;
        this.version = options.version;
        this.auth = options.auth;
    }


    async registerEvents() {
        const eventFiles = readdirSync(__dirname+'/events/').filter(file => file.endsWith('.ts'));
        for (const file of eventFiles) {
            const name = file as keyof BotEvents;
            const event = await import(`${__dirname}/events/${file}`);
            this.client?.on(name, (...args: any) => {
                event.execute(...args);
            })
        }
    }


    start() {
        this.client = mineflayer.createBot({
            host: this.host,
            username: this.username,
            password: this.password,
            version: this.version,
            auth: this.auth
        })

		// bind events
        this.registerEvents();
    }

}