const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "ping",
    category: "utils",
    description: "Returns latency and API latency!",
    args: "",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging...`)
        const embed = new MessageEmbed()
            .setColor('LIGHT_GREY')
            .setDescription(`🏓 Pong!\nClient latnecy is ${Math.floor(msg.createdAt.getTime() - message.createdAt.getTime())}ms\nAPI latency is ${Math.round(client.ws.ping)}ms!`)
        await msg.delete()
        await message.channel.send({ embeds: [embed] })
    }
}