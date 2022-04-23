const {
    read,
    write
} = require('../../src/handler/json')
const parseRole = require('../../src/handler/parseRole')
const {
    reply,
    createErrorEmbed
} = require('../../src/handler/embeds')

module.exports = {
    name: "addrole",
    category: "roles",
    description: "Adds a role to the reaction list!",
    args: "{Role name or id} {Reaction emoji} {channel}",
    development: true,
    run: async (client, message, args, args1) => {
        try {
            const role = parseRole(message.guild, args[0])
            if (!role) return await reply(message, await createErrorEmbed('Invalid role!', message.author))

            const config = await read('./config/roles.json')
        } catch (err) {
            return err
        }
    }
}