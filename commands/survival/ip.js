const { reply, createAuthorEmbed } = require("../../src/handler/embeds")

module.exports = {
    name: "ip",
    category: "survival",
    description: "Sends the ip to valorian survival!",
    args: "",
    run: async (client, message, args) => {
        await reply(message, await createAuthorEmbed("The Valorian Survival IP is valorian.net!", process.env.MAIN_EMBED_COLOUR, message.author))
    }
}