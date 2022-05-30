const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    name: "embed",
    category: "admin",
    description: "Sends an embed in a desired channel! This can be either text or as a json format! Check https://discordjs.guide/popular-topics/embeds.html#using-an-embed-object for an example!",
    args: ["{channel name or id} {text or json formatting}"],
    run: async (client, message, args, args1) => {
        let channelId = 0
        if (args[0].startsWith('<#')) {
            channelId = args[0].substring(2, args[0].length - 1)
        } else if (parseInt(args[0])) {
            channelId = args[0]
        }

        const msg = args1.replace(args[0], '').trimStart()

        var body = ''

        var embed = new MessageEmbed()

        try {
            if (JSON.parse(msg)) {
                const _msg = JSON.parse(msg)
                try {
                    embed = new MessageEmbed({
                        author: _msg.author,
                        color: _msg.color,
                        description: _msg.description,
                        fields: _msg.feilds,
                        footer: _msg.footer,
                        image: _msg.image,
                        provider: _msg.provider,
                        thumbnail: _msg.thumbnail,
                        timestamp: _msg.timestamp,
                        title: _msg.title,
                        url: _msg.url,
                        video: _msg.video
                    })
                } catch (error) {
                    client.logger.error(error)
                    return message.reply("Invalid JSON formatting, please check out https://discordjs.guide/popular-topics/embeds.html#using-an-embed-object an example!")
                }
            }
        } catch {
            if (msg.includes('@everyone') || msg.includes('@here')) {
                body = msg.includes('@everyone') ? '@everyone' : '@here'
                console.log(msg.replace(body, ''))
                msg = msg.replace('@everyone', '')
                msg = msg.replace('@here', '')
            }
            embed = new MessageEmbed({
                description: msg,
                color: process.env.MAIN_EMBED_COLOUR
            })
        }

        const channel = await message.guild.channels.fetch(channelId)

        await channel.send(body)

        await channel.send({
            embeds: [embed]
        })
    }
}