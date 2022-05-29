const {
    Role
} = require('../../src/types/roleTypes')
const {
    createAuthorEmbed
} = require('../../src/handler/embeds')
const {
    Client,
    Message
} = require('discord.js')

module.exports = {
    name: "createmessage",
    category: "roles",
    description: "Creates a reaction message!",
    args: "",
    development: true,
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
        const mainEmbed = await createAuthorEmbed("Reaction Roles!", process.env.MAIN_EMBED_COLOUR, client.user)

        await message.channel.send({
            embeds: [await createAuthorEmbed("Please type the channel for the message to be created in!", process.env.MAIN_EMBED_COLOUR, message.author)]
        })
        var _channel = await message.channel.awaitMessages({
            filter: m => m.author.id == message.author.id,
            max: 1,
            time: 60000,
            errors: ['time']
        }).then(async collected => {
            if (collected.first().content.toLowerCase() === "cancel") {
                return message.channel.send({
                    embeds: [await createAuthorEmbed("Cancelled!", process.env.MAIN_EMBED_COLOUR, message.author)]
                })
            }
            return collected.first().content
        }).catch(() => {
            return message.channel.send("An error occured!")
            // return message.channel.send({
            //     embeds: [await createAuthorEmbed("Timed out!", process.env.MAIN_EMBED_COLOUR, message.author)]
            // })
        })

        let channelId = 0
        if (_channel.startsWith('<#')) {
            channelId = _channel.substring(2, _channel.length - 1)
        } else if (parseInt(_channel)) {
            channelId = _channel
        }

        const channel = await message.guild.channels.fetch(channelId)

        const startMessage = await message.channel.send({
            embeds: [await createAuthorEmbed(`The channel <#${channel.id}> will now be used!\nPlease type a role followed by the reaction emoji!`, process.env.MAIN_EMBED_COLOUR, message.author)]
        })

        var roles = []
        var emojis = []

        var done = false;
        while (!done) {
            const _message = await message.channel.awaitMessages({
                filter: m => m.author.id == message.author.id,
                max: 1,
                time: 60000,
                errors: ['time']
            }).then(async collected => {
                if (collected.first().content.toLowerCase() === "cancel") {
                    return message.channel.send({
                        embeds: [await createAuthorEmbed("Cancelled!", process.env.MAIN_EMBED_COLOUR, message.author)]
                    })
                }
                return collected.first().content
            }).catch(() => {
                return message.channel.send("An error occured!")
            })

            if (_message === "done") {
                done = true
                break
            }

            const role = _message.split(" ")[0]
            roles.push(role.substring(3, role.length - 1))
            emojis.push(_message.split(" ")[1])
        }
        console.log(roles, emojis)

        
    }
}