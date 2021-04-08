import { ChatMessage } from "mineflayer";
// import {  }

export default class MessageEventListener {
    async execute(msg: ChatMessage) {
        console.log(msg.toString())
    }
}