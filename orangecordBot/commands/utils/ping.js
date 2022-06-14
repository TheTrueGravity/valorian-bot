const { reply, createThumbnailEmbed } = require("../../modules/embeds")

module.exports = {
    name: "ping",
    category: "utils",
    description: "Returns latency and API latency!",
    args: "",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging...`)
        const description = `🏓 Latency: ${msg.createdTimestamp - message.createdTimestamp}ms\n🏓 API Latency: ${Math.round(client.ws.ping)}ms`
        await msg.delete()
        await reply(message, await createThumbnailEmbed(
            description,
            process.env.MAIN_EMBED_COLOR,
            process.GOOD_ORANGE,
            message.author
        ))
    }
}