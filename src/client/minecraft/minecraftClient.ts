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
            const event = await import(`${__dirname}/events/${file}`);
            const name = file.replace('.ts', '') as keyof BotEvents;
            this.client?.on(name, (...args: any) => {
                new event.default().execute(...args);
            })
        }
    }


    start() {
        this.client = mineflayer.createBot({
            //@ts-ignore
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