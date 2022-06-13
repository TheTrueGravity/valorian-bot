const {
    Role
} = require('../../src/types/roleTypes')
const {
    createAuthorEmbed,
    createBasicEmbed
} = require('../../src/handler/embeds')
const {
    Client,
    Message
} = require('discord.js')
const {
    readFileSync,
    writeFileSync
} = require('fs')

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

        if (!channelId) {
            return message.channel.send({
                embeds: [await createAuthorEmbed("Invalid channel!", process.env.MAIN_EMBED_COLOUR, message.author)]
            })
        }

        const channel = await message.guild.channels.fetch(channelId)

        await message.channel.send({
            embeds: [await createAuthorEmbed(`The channel <#${channel.id}> will now be used!\nFor each role, please type the role followed by an emoji, in seperate messages!\nWhen finished, please send "done"`, process.env.MAIN_EMBED_COLOUR, message.author)]
        })

        var roles = []

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

            if (_message.toLowerCase() === "done") {
                done = true
                break
            }

            const roleID = _message.split(" ")[0].substring(3, _message.split(" ")[0].length - 1)

            roles.push({
                roleID: roleID,
                emoji: _message.split(" ")[1]
            })
        }

        var embedBody = "Reaction roles!\n"

        for (const role of roles) {
            embedBody += `React with ${role.emoji} to get <@&${role.roleID}>\n`
        }

        const config = JSON.parse(readFileSync(process.env.BOT_CONFIG_DIR + '/reactionRoles.json'))

        const embed = await createBasicEmbed(embedBody, process.env.MAIN_EMBED_COLOUR)

        const currentMessageID = config.currentMessageID

        embed.setFooter({
            text: `Message ID: ${currentMessageID}`
        })

        config.currentMessageID += 1

        const messageEmbed = await channel.send({
            embeds: [embed]
        })

        if (config[messageEmbed.id]) {
            throw new Error("Message already exists!")
        }

        config[messageEmbed.id] = {
            roles: roles,
            channel: channel.id,
            messageID: currentMessageID,
            embedBody: embedBody,
            channelID: channelId
        }

        writeFileSync(process.env.BOT_CONFIG_DIR + '/reactionRoles.json', JSON.stringify(config, null, 4))

        for (const role of roles) {
            await messageEmbed.react({
                name: role.emoji
            })
        }

        await message.channel.send({
            embeds: [await createAuthorEmbed("Message created!", process.env.MAIN_EMBED_COLOUR, message.author)]
        })
    }
}