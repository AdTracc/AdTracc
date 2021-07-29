export const MESSAGES = {
	commandHandler: {
		prompt: {
			modifyStart: (str: string) =>
				`${str}\n\nType \`cancel\` to cancel the command.`,
			modifyRetry: (str: string) =>
				`${str}\n\nType \`cancel\` to cancel the command.`,
			timeout: 'You took too long so the command has been cancelled.',
			ended: 'Be prepared next time. The command has been cancelled.',
			cancel: 'The command has been cancelled.',
		},
	},
	commands: {
		useHelp: (prefix: string, commandName: string) =>
			`I can help you more if you use \`${prefix}help ${commandName}\``,
	},
};

export const IMGUR_LINK_REGEX = /((?:https?:)?\/\/(\w+\.)?imgur\.com\/(\S*)(\.[a-zA-Z]{3}))/im;