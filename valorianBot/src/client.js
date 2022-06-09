const {
    Client,
    Collection
} = require('discord.js')
const {
    ReactionRoleManager
} = require('discord.js-collector')
const {
    argParse
} = require('./handler/args')
const {
    parentPort, isMainThread
} = require('worker_threads')
const {
    reply,
    createErrorEmbed
} = require('./handler/embeds')
const {
    LogLevel
} = require('./handler/logger')

if (isMainThread) {
    // throw new Error('This file is meant to be run in a worker thread!')
}

parentPort?.on('message', async message => {
    if (message.type == "ping") {
        parentPort.postMessage({
            type: "pong"
        })
    } else if (message.type == "init") {
        await start()
    }
})

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

const arguments = argParse("", [{
        name: '--development',
        alias: '-d',
        options: {
            action: 'store_true',
            help: 'Enable development mode'
        },
    },
    {
        name: '--beta',
        alias: '-b',
        options: {
            action: 'store_true',
            help: 'Enable beta mode'
        }
    }
])

// const testers = process.env.TESTERS.split(' ')
// const prefixes = process.env.PREFIXES.split(' ')
// const bot_channels = process.env.BOT_CHANNELS.split(' ')

const client = new Client({
    intents: ['DIRECT_MESSAGES', 'GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

client.logger = logger
// client.testers = testers
client.arguments = arguments

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
})

client.on("error", (err) => {
    return logger.log(LogLevel.ERROR, err)
})

client.isMod = async function (message) {
    return (message.guild.ownerId == message.author.id || message.author.id == "487314847470714907")
}
client.getVersion = async function () {
    const {
        version
    } = require('../../package.json')
    return version
}
client.getDeployment = async function (arguments) {
    var deployment = "production"
    if (arguments.development) {
        deployment = "development"
    } else if (arguments.beta) {
        deployment = "beta"
    }
    return deployment
}
client.getPrefixes = async function () {
    return prefixes
}

client.on('messageCreate', async message => {
    var hasPrefix = false;
    var prefix = ''

    for (const _prefix of prefixes) {
        if (message.content.toLowerCase().startsWith(_prefix)) {
            hasPrefix = true;
            prefix = message.content.slice(0, _prefix.length)
        }
    }

    if (message.author.bot) return
    if (!message.guild) return
    if (!hasPrefix) return
    if (message.guildId == "923637184332984350" && !bot_channels.includes(message.channel.id)) return

    const args = message.content.slice(prefix).trim().replace(prefix, '').split(/ +/g)
    const args1 = message.content.slice(prefix).trimStart().replace(prefix, '').replace(args[0], '').trimStart()

    const cmd = args.shift().toLowerCase()

    try {
        var command = client.commands.get(cmd)
    } catch {
        return message.reply("Invalid command!")
    }

    if (!command) {
        command = client.commands.get(client.aliases.get(cmd))
    }

    if (command) {
        if (arguments.development) {
            if (!testers.includes(message.author.id) && command.name != "deployment") return
        } else {
            for (var category of client.categories.get("categories")) {
                if (category.name == command.category && category.mod) {
                    if (!await client.isMod(message)) return
                }
            }
        }

        if (command.devOnly) {
            if (!testers.includes(message.author.id)) return
        }
        if (!command.development) {
            if (arguments.development) return
        } else {
            if (!arguments.development) return
        }

        try {
            const run = await command.run(client, message, args, args1)
            if (run instanceof Error) {
                logger.log(LogLevel.ERROR, run)
                return await reply(message, await createErrorEmbed(`There was an error running the command: ${command.name}`, message.author))
            }
        } catch (error) {
            logger.log(LogLevel.ERROR, error)
            return await reply(message, await createErrorEmbed(`There was an error running the command: ${command.name}`, message.author))
        }

        logger.log(LogLevel.VERBOSE, `${message.author.username}#${message.author.discriminator} (${message.author.id}) successfully ran the command: ${command.name}`)
    } else return
})

require('dotenv').config()

const platform = require('os').platform()

const envKeys = Object.keys(process.env)

for (let i = 0; i < envKeys.length; i++) {
    if (envKeys[i].includes(platform.toUpperCase())) {
        process.env[envKeys[i].replace(platform.toUpperCase()+'.', '')] = process.env[envKeys[i]]
    }
}

start()

async function start() {
    client.aliases = new Collection()
    client.commands = new Collection()
    client.categories = new Collection()

    const tasks = new Collection()
    
    const commands = require('./handler/command')(client, process.env.BOT_COMMANDS_FOLDER)
    const _tasks = require('./handler/tasks')(tasks, process.env.BOT_TASKS_FOLDER)

    logger.log(LogLevel.VERBOSE, commands.toString())
    logger.log(LogLevel.VERBOSE, _tasks.toString())
    
    tasks.forEach(async task => {
        if (task.development) {
            if (!client.arguments.development) return
        }
        await task.init(client)
    })

    logger.log(LogLevel.INFO, 'Client logging in...')
    client.login(process.env.TOKEN)
    logger.log(LogLevel.INFO, 'Client logged in!')
}