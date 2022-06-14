import ITask, { TaskTypes } from '../interfaces/ITask'
import {
    Client, Guild
} from 'discord.js'
import * as json from '../modules/json'

const Task: ITask = {
    enabled: true,
    name: 'guildRemove',
    taskType: TaskTypes.onClientEvent,
    description: 'Gets called when a guild is created',
    development: false,
    run: async (client: Client, guild: Guild) => {
        const servers = await json.read(process.env.BOT_CONFIG_DIR + '/servers.json')

        if (!servers[guild.id]) return
        
        delete servers[guild.id]

        await json.write(process.env.BOT_CONFIG_DIR + '/servers.json', servers)
    }
}

export default Task