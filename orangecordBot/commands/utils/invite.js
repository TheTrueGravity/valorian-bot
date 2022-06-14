const { MessageEmbed } = require("discord.js")
const { reply, createThumbnailEmbed } = require("../../modules/embeds")

module.exports = {
    name: "invite",
    category: "utils",
    description: "Returns the bot invite link!",
    args: "",
    run: async (client, message, args) => {
        await reply(message, await createThumbnailEmbed(
            `Invite me to your server!\n[Invite](${process.env.INVITE_LINK})`,
            process.env.MAIN_EMBED_COLOUR,
            process.env.GOOD_ORANGE,
            message.author
        ))
    }
}