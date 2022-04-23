const {
    MessageEmbed,
    Client,
    Message
} = require('discord.js')
const {
    reply,
    createBasicEmbed
} = require('../../src/handler/embeds')

module.exports = {
    // Name of the command
    name: "prefix",

    // Category command is in
    category: "bot",

    // The commands description
    description: "Get the bots prefix!",

    // The commands args
    args: "",

    /**
     * Code to run when command is called
     * 
     * @param {Client<true>} client The client object
     * @param {Message} message The message sent
     * @param {String[]} args An array of the command parameters
     * @param {String} args1 The raw string of the command parameters
     **/
    run: async (client, message, args, args1) => {
        const prefixes = await client.getPrefixes()

        await reply(message, await createAuthorEmbed(`The prefixes for this server are: ${prefixes.join(' ')}`, process.env.MAIN_EMBED_COLOUR, message.author))
    }
}