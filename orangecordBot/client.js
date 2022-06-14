const {
    Client,
    Collection
} = require('discord.js')
const {
    parentPort, isMainThread
} = require('worker_threads')
const {
    TaskTypes
} = require('./interfaces/ITask')
const {
    default: messageHandler
} = require('./handlers/messageHandler')
const {
    LogLevel
} = require('../handler/logger')
const {
    ServerHandler
} = require('./handlers/serverHandler')
const {
    Buffer
} = require('./modules/buffer')

if (isMainThread) {
    throw new Error('This file is meant to be run in a worker thread!')
}

const serverHandler = ServerHandler.getInstance()

const logger = {
    log: function (level, message) {
        if (level == LogLevel.ERROR) {
            parentPort.postMessage({
                type: 'error',
                error:`${message.name}: ${message.message}`
            })
        } else {
            parentPort.postMessage({
                type: 'log',
                level,
                message
            })
        }
    }
}

const client = new Client({
    intents: ['DIRECT_MESSAGES', 'GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

client.on("ready", async () => {
    logger.log(LogLevel.INFO, '-------------------------------------------')
    logger.log(LogLevel.INFO, `Logged in as ${client.user.tag}!`)
    logger.log(LogLevel.INFO, `Client id: ${client.user.id}`)
    logger.log(LogLevel.INFO, `Deployment: ${await client.getDeployment(arguments)}`)
    logger.log(LogLevel.INFO, `Version: ${await client.getVersion()}`)
    logger.log(LogLevel.INFO, '-------------------------------------------')

    client.user.setActivity(`${prefixes[0]}help`, {
        type: 'LISTENING'
    })

    parentPort.postMessage({
        type: 'start',
        success: true
    })
})

client.on("error", (err) => {
    return logger.log(LogLevel.ERROR, err)
})

client.isMod = async function (message) {
    return (message.guild.ownerId == message.author.id || message.author.id == "487314847470714907")
}
client.getVersion = async function () {
    return process.env.VERSION
}
client.getDeployment = async function (arguments) {
    return process.env.DEPLOYMENT
}
client.getPrefixes = async function () {
    return prefixes
}

client.on('messageCreate', message => messageHandler(client, message, logger))

const testers = process.env.TESTERS.split(' ')
const prefixes = process.env.PREFIXES.split(' ')

async function init() {
    client.logger = logger
    client.testers = testers
    client.arguments = arguments

    parentPort.postMessage({
        type: 'init',
        success: true
    })
}

async function start() {
    require('dotenv').config()

    const platform = require('os').platform()

    const envKeys = Object.keys(process.env)

    for (let i = 0; i < envKeys.length; i++) {
        if (envKeys[i].includes(platform.toUpperCase())) {
            process.env[envKeys[i].replace(platform.toUpperCase()+'.', '')] = process.env[envKeys[i]]
        }
    }

    client.aliases = new Collection()
    client.commands = new Collection()
    client.categories = new Collection()
    
    const tasks = new Collection()
    
    const commands = await require('./modules/command')(client, process.env.BOT_COMMANDS_FOLDER)
    const _tasks = await require('./modules/tasks')(tasks, process.env.BOT_TASKS_FOLDER)

    logger.log(LogLevel.VERBOSE, commands.toString())
    logger.log(LogLevel.VERBOSE, _tasks.toString())
    
    tasks.forEach(async task => {
        if (task.development && !client.arguments.development) return

        if (task.enabled) {
            if (task.init) await task.init(client)
            switch (task.taskType) {
                case TaskTypes.onClientEvent:
                    client.on(task.name, (...args) => task.run(client, ...args))
                    break
                case TaskTypes.scheduled:
                    client.setInterval(() => task.run(client), task.interval)
                    break
                default:
                    break
            }
        }        
    })

    logger.log(LogLevel.INFO, 'Client logging in...')
    client.login(process.env.TOKEN)
}

parentPort?.on('message', async message => {
    if (message.type == "ping") {
        parentPort.postMessage({
            type: "pong"
        })
    } else if (message.type == "init") {
        await init()
    } else if (message.type == "start") {
        await start()
    }
})