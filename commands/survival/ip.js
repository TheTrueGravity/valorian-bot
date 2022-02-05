const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "ip",
    category: "survival",
    description: "Sends the ip to valorian survival!",
    args: "",
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setDescription(`Join the server at valorian.net!`)
        await message.channel.send({ embeds: [embed] })
    }
}