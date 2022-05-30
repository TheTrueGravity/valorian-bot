const {
    Client
} = require('discord.js')
const {
    LogLevel
} = require('../src/handler/logger')
const { readFileSync } = require('fs')

module.exports = {
    name: 'reactionRoles',
    development: true,

    /**
     * @param {Client<true>} client The client object
     **/
    init: async function (client) {
        client.on('messageReactionAdd', async (reaction, user) => {
            if (user.bot) return

            const config = JSON.parse(readFileSync(process.env.BOT_CONFIG_DIR + '/reactionRoles.json'))

            if (!config[reaction.message.id]) return

            for (const role of config[reaction.message.id]["roles"]) {
                if (reaction.emoji.name == role["emoji"]) {
                    if (role["roleID"]) {
                        const roleObj = reaction.message.guild.roles.cache.get(role["roleID"])
                        if (roleObj) {
                            const _user = await reaction.message.guild.members.fetch({
                                user: user
                            })
                            try {
                                await _user.roles.add(roleObj)
                            } catch (error) {
                                client.logger.log(LogLevel.ERROR, error)
                            }
                        }
                    }
                }
            }
        })
        client.on('messageReactionRemove', async (reaction, user) => {
            if (user.bot) return;

            const config = JSON.parse(readFileSync(process.env.BOT_CONFIG_DIR + '/reactionRoles.json'))

            if (!config[reaction.message.id]) return

            for (const role of config[reaction.message.id]["roles"]) {
                if (reaction.emoji.name == role["emoji"]) {
                    if (role["roleID"]) {
                        const roleObj = reaction.message.guild.roles.cache.get(role["roleID"])
                        if (roleObj) {
                            const _user = await reaction.message.guild.members.fetch({
                                user: user
                            })
                            try {
                                await _user.roles.remove(roleObj)
                            } catch (error) {
                                client.logger.log(LogLevel.ERROR, error)
                            }
                        }
                    }
                }
            }
        })
    }
}