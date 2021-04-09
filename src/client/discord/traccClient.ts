import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { TraccClientOptions } from './traccClientOptions';
import { Mongoose } from 'mongoose';
import { Message } from 'discord.js';
import { InhibitorHandler } from 'discord-akairo';
import { guildConfigs } from '../../guild/config/guildConfigs';
// import parseDuration from 'parse-duration';
// import { CooldownManager } from '../structure/cooldownManager';
import TraccClientEvents from './traccClientEvents';

import { MESSAGES } from '../../util/constants';
import { CodeModel } from '../../model/code';
// import { CacheManager } from '../structure/cacheManager';


export class TraccClient extends AkairoClient {
	commandHandler: CommandHandler;
	listenerHandler: ListenerHandler;
	inhibitorHandler: InhibitorHandler;

	ownerIds: string[] | undefined;
	mongo?: Mongoose;

	constructor(options: TraccClientOptions) {
		// TODO: validate options

		super(
			{
				ownerID: options.ownerIds,
	},
			{
				disableMentions: 'everyone',
			}
		);

		this.ownerIds = options.ownerIds;
		this.mongo = options.mongo;

		this.commandHandler = new CommandHandler(this, {
			directory: './src/command/',
			prefix: (msg: Message) => {
				if (!msg.guild) return options.prefix!;
				const config = guildConfigs.get(msg.guild.id);
				return config ? config.prefix || options.prefix! : options.prefix!;
			},
			argumentDefaults: {
				prompt: {
					modifyRetry: (_: any, str: any) =>
						MESSAGES.commandHandler.prompt.modifyRetry(str),
					modifyStart: (_: any, str: any) =>
						MESSAGES.commandHandler.prompt.modifyStart(str),
					timeout: MESSAGES.commandHandler.prompt.timeout,
					ended: MESSAGES.commandHandler.prompt.ended,
					cancel: MESSAGES.commandHandler.prompt.cancel,
					retries: 3,
					time: 30000,
				},
			},
			commandUtil: true,
			allowMention: true,
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: './src/listener/',
		});

		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: './src/inhibitor/',
		});

		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
		});

		this.commandHandler.useListenerHandler(this.listenerHandler);
		// this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();
		// this.inhibitorHandler.loadAll();

		this.registerArgTypes();
	}

	start(token: string) {
		super.login(token);
	}

	registerArgTypes() {
		this.commandHandler.resolver.addType('handler', (_msg: Message, phrase: any) => {
			if (!phrase) return null;
			switch (phrase.toLowerCase()) {
				case 'cmd':
				case 'command':
					return this.commandHandler;

				case 'listener':
				case 'event':
					return this.listenerHandler;

				case 'block':
				case 'check':
				case 'inhibitor':
					return this.inhibitorHandler;

				default:
					return null;
			}
		});

		this.commandHandler.resolver.addType(
			'activationCode',
			async (_msg: Message, phrase) => {
				if (!phrase) return null;

				const c = await CodeModel.findOne({ _id: phrase });
				if (!c) return null;
				return c;
			}
		);
	}
}

declare module 'discord-akairo' {
	interface AkairoClient {
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		inhibitorHandler: InhibitorHandler;
		ownerIds: string[] | undefined;

		start(token: string): void;
		registerArgTypes(): void;

		on<K extends keyof TraccClientEvents>(
			event: K,
			listener: (...args: TraccClientEvents[K]) => void
		): this;

		once<K extends keyof TraccClientEvents>(
			event: K,
			listener: (...args: TraccClientEvents[K]) => void
		): this;

		emit<K extends keyof TraccClientEvents>(
			event: K,
			...args: TraccClientEvents[K]
		): boolean;
	}
}