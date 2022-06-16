const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    name: "say",
    category: "admin",
    description: "Sends a specified message in a channel!",
    args: ["{channel name or id} {message}"],
    run: async (client, message, args, args1) => {
        let channelId = ""
        if (args[0].startsWith('<#')) {
            channelId = args[0].substring(2, args[0].length - 1)
        } else if (parseInt(args[0])) {
            channelId = args[0]
        }

        const msg = args1.replace(args[0], '').trimStart()

        var embed = new MessageEmbed()

        const channel = await message.guild.channels.fetch(channelId)

        await channel.send(msg)
    }
}