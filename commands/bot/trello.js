const { MessageEmbed, Client, Message } = require('discord.js')

module.exports = {
    // Name of the command
    name: "trello",

    // Category command is in
    category: "bot",

    // The commands description
    description: "Get a link to the Valorian bots trello board!",

    // The commands args
    args: "trello",

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
        const embed = new MessageEmbed()
            .setDescription(`Track the bots progress at https://trello.com/b/NpJeJGYU/valorian-bot!`)
        await message.channel.send({ embeds: [embed] })
    }
}