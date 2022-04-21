const { MessageEmbed, Client, Message } = require('discord.js')

module.exports = {
    // Name of the command
    name: "info",

    // Category command is in
    category: "bot",

    // The commands description
    description: "Get info on the bot!",

    // The commands args
    args: "",

    /**
     * Code to run when command is called
     * 
     * @param {Client<true>} client The client object
     * @param {Message} message The message sent
     * @param {String[]} args An array of the command parameters
     * @param {String} args1 The raw string of the command parameters
     * 
    **/
    run: async (client, message, args, args1) => {
        const embed = new MessageEmbed({
            title: "Bot info",
            fields: [
                {
                    name: "Track the bots progress at",
                    value: "https://trello.com/b/NpJeJGYU/valorian-bot!"
                },
                {
                    name: "Github",
                    value: "https://github.com/TheTrueGravity/valorian-bot"
                },
                {
                    name: "Version",
                    value: await client.getVersion()
                },
                {
                    name: "Prefix",
                    value: (await client.getPrefixes()).toString().replace(/,/g, ' ')
                },
                {
                    name: "deployment",
                    value: await client.getDeployment()
                }
            ],
            author: {
                name: message.author.username,
                iconURL: message.author.avatarURL()
            }
        })
        await message.channel.send({ embeds: [embed] })
    }
}