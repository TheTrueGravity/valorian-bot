const {
    MessageEmbed,
    Client,
    Message
} = require('discord.js')
const {
    reply,
    createAuthorEmbed
} = require('../../src/handler/embeds')

module.exports = {
    // Name of the command
    name: "trello",

    // Category command is in
    category: "bot",

    // The commands description
    description: "Get a link to the Valorian bots trello board!",

    // The commands args
    args: "",

    /**
     * Code to run when command is called
     * 
     * @param {Client} client The client object
     * @param {Message} message The message sent
     * @param {String[]} args An array of the command parameters
     * @param {String} args1 The raw string of the command parameters
     * 
     **/
    run: async (client, message, args, args1) => {
        await reply(message, await createAuthorEmbed("Track the bots progress at https://trello.com/b/NpJeJGYU/valorian-bot!", process.env.MAIN_EMBED_COLOUR, message.author))
    }
}