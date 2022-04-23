const { reply } = require("../../src/handler/embeds")

module.exports = {
    name: "ping",
    category: "utils",
    description: "Returns latency and API latency!",
    args: "",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging...`)
        const description = `🏓 Latency: ${msg.createdTimestamp - message.createdTimestamp}ms\n🏓 API Latency: ${Math.round(client.ws.ping)}ms`
        await reply(message, await createAuthorEmbed(description, process.env.MAIN_EMBED_COLOUR, message.author))
    }
}