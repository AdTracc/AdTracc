import { Message, Util } from 'discord.js';

// Thanks to https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
export function randomAlphanumericString(length: number) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export function removeMarkdownAndMentions(content: string, msg?: Message) {
	return Util.escapeMarkdown(
		msg ? Util.cleanContent(content, msg) : Util.removeMentions(content)
	);
}

// Thanks draem
export function arrayDiff<T>(aArray: T[], bArray: T[]) {
	const added = bArray.filter(e => !aArray.includes(e));
	const removed = aArray.filter(e => !bArray.includes(e));

	return {
		added,
		removed,
	};
}
