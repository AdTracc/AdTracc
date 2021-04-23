export default class ErrorEventListener {

    async execute(err: Error) {
        console.log(`Minecraft Bot error occurred: ${err.stack}`)
    }
}