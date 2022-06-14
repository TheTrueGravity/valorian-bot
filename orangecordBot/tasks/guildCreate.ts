import ITask from '../interfaces/ITask'
import {
    Client
} from 'discord.js'

const Task: ITask = {
    name: 'guildCreate',
    description: 'Gets called when a guild is created',
    development: false,
    run: (client: Client, ...args) => {
        console.log('Guild created')
    }
}

export default Task