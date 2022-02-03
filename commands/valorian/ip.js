const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "ip",
    category: "valorian",
    description: "Sends the ip to valorian survival!",
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setDescription(`Join the server @ valorian.net!`)
            
        await message.channel.send({ embeds: [embed] })
    }
}