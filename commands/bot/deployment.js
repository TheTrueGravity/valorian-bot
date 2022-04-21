const { MessageEmbed, Client, Message } = require('discord.js')

module.exports = {
    // Name of the command
    name: "deployment",

    // Category command is in
    category: "bot",

    // The commands description
    description: "Get the bots deployment version!",

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
        const embed = new MessageEmbed({
            title: "The bots deployment version",
            description: await client.getDeployment(),
            author: {
                name: message.author.username,
                iconURL: message.author.avatarURL()
            }
        })
        await message.channel.send({ embeds: [embed] })
    }
}