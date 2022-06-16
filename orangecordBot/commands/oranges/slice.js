const { ServerHandler } = require('../../handlers/serverHandler')
const { createTitleEmbed, reply } = require('../../modules/embeds')
const json = require('../../modules/json')

async function getTime() {
    const timeNow = parseInt((new Date().getTime() / 1000).toFixed(0))
    return timeNow
}

const isCooldown = {}

module.exports = {
    name: "slice",
    category: "oranges",
    description: "Slices a message into multiple messages!",
    args: ["slice"],
    run: async (client, message, args, args1) => {
        const serverHandler = ServerHandler.getInstance()

        const servers = await json.read(process.env.BOT_CONFIG_DIR + '/servers.json')
        const server = servers[message.guild.id]
        const cooldown = server.cooldown
        const timeNow = await getTime()

        if (cooldown <= timeNow && !isCooldown[message.guild.id]) {
            isCooldown[message.guild.id] = true
            setTimeout(() => {
                isCooldown[message.guild.id] = false
            }, 2000)
            await reply(await createTitleEmbed(
                `Orange Cord created by Gravity!`,
                `<@${message.author.id}>, Here, have a slice!`,
                process.env.MAIN_EMBED_COLOUR,
                message.author,
                process.env.GOOD_ORANGE
            ))

            const cooldownTime = parseInt(process.env.DEFAULT_COOLDOWN_TIME)

            serverHandler.bump(message.guild, message.author, timeNow + cooldownTime)
        }
    }
}