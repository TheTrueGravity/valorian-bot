const {
    read,
    write
} = require('../../src/handler/json')
const parseRole = require('../../src/handler/parseRole')
const {
    reply,
    createErrorEmbed,
    createBasicEmbed
} = require('../../src/handler/embeds')
const {
    Client,
    Message,
    Role
} = require('discord.js')

module.exports = {
    name: "addrole",
    category: "roles",
    description: "Adds a role to the reaction list!",
    args: "{messageID} {Role name or id} {Reaction emoji}",
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
        try {
            const role = parseRole(message.guild, args[1])
            if (!role) return await reply(message, await createErrorEmbed('Invalid role!', message.author))

            const config = await read(process.env.VALORIAN_BOT_CONFIG_DIR + '/reactionRoles.json')

            if (parseInt(args[0]) >= config.currentMessageID) throw new Error('Invalid message ID!')

            for (const r in config) {
                if (parseInt(args[0]) === config[r].messageID) {
                    config[r].roles.push({
                        roleID: role.id,
                        emoji: args[2]
                    })

                    // Get the message matching r as the message ID
                    const channel = await message.guild.channels.cache.get(config[r].channelID)
                    const msg = await channel.messages.fetch(r)

                    var embedBody = config[r].embedBody += `\nReact with ${args[2]} to get <@&${role.id}>`

                    const embed = await createBasicEmbed(embedBody, process.env.VALORIAN_MAIN_EMBED_COLOUR)

                    embed.setFooter({
                        text: `Message ID: ${config[r].messageID}`
                    })
                    
                    await msg.edit({
                        embeds: [embed]
                    })

                    await msg.react(args[2])

                    write(process.env.VALORIAN_BOT_CONFIG_DIR + '/reactionRoles.json', config)
                    return await reply(message, await createBasicEmbed(`Added ${role.name} to the reaction roles!`, process.env.VALORIAN_MAIN_EMBED_COLOUR))
                }
            }
        } catch (err) {
            return err
        }
    }
}