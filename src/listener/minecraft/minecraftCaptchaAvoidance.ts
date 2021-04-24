import { Listener } from 'discord-akairo';

export default class MinecraftCaptchaListener extends Listener {
	constructor() {
		super('mc-capthca', {
			emitter: 'minecraft',
			event: 'messagestr',
		});
	}

	async exec(msg: string) {
		if (msg === "Use /recaptcha if the captcha is too hard to read.") {
            this.client.mcBot?.end();
        }
	}
}