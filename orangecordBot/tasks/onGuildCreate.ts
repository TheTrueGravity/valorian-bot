import ITask, { TaskTypes } from '../interfaces/ITask'
import {
    Client, Guild
} from 'discord.js'
import * as json from '../modules/json'

const Task: ITask = {
    enabled: true,
    name: 'guildCreate',
    taskType: TaskTypes.onClientEvent,
    description: 'Gets called when a guild is created',
    development: false,
    init: async (client: Client) => {
        const servers = await json.read(process.env.BOT_CONFIG_DIR + '/servers.json')

        const guilds = await client.guilds.fetch()

        for (const guild of guilds.values()) {
            if (servers[guild.id]) {
                if (servers[guild.id].name != guild.name) {
                    servers[guild.id].name = guild.name
                }
                continue
            }

            servers[guild.id] = {
                name: guild.name,
                prefix: process.env.DEFAULT_PREFIX,
                cooldown: 0,
                cooldownTime: process.env.DEFAULT_COOLDOWN_TIME,
                user_bumps: {},
                roles: {}
            }
        }
        
        await json.write(process.env.BOT_CONFIG_DIR + '/servers.json', servers)
    },
    run: async (client: Client, guild: Guild) => {
        const servers = await json.read(process.env.BOT_CONFIG_DIR + '/servers.json')

        if (servers[guild.id]) return

        servers[guild.id] = {
            name: guild.name,
            prefix: process.env.DEFAULT_PREFIX,
            cooldown: 0,
            user_bumps: {},
            roles: {}
        }

        await json.write(process.env.BOT_CONFIG_DIR + '/servers.json', servers)
    }
}

export default Task