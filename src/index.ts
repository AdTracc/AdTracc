import { TraccClient } from './client/discord/traccClient';
import { mongoose } from '@typegoose/typegoose';
import MinecraftClient from './client/minecraft/minecraftClient';

// { path: '../.env' }
require('dotenv').config();

// TODO: validate env variables
(async () => {
	const connection = await mongoose.connect(process.env.MONGO_URI || '', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});


	const auth = process.env.MINECRAFT_AUTH_TYPE as "microsoft" | "mojang" | undefined

	const minecraftClient = new MinecraftClient({
		host: process.env.MINECRAFT_HOST!,
		username: process.env.MINECRAFT_USERNAME!,
		password: process.env.MINECRAFT_PASSWORD!,
		version: process.env.MINECRAFT_VERSION!,
		auth: auth
	})

	minecraftClient.start();

	const discordClient = new TraccClient({
		ownerIds: process.env.OWNER_IDS?.split(','),
		prefix: process.env.DISCORD_PREFIX || '!',
		mongo: connection,
		mcBot: minecraftClient.client
	});

	discordClient.start(process.env.DISCORD_TOKEN!);
})();
