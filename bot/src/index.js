const {
    Client,
    Collection
} = require('discord.js')
const {
    argParse
} = require('./handler/args')
const {
    default: Logger
} = require('./handler/logger')
const { reply, createErrorEmbed } = require('./handler/embeds')

require('dotenv').config()

const arguments = argParse("", [{
        name: '--development',
        alias: '-dev',
        options: {
            action: 'store_true',
            help: 'Enable development mode'
        }
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

const testers = process.env.TESTERS.split(' ')
const prefixes = process.env.PREFIXES.split(' ')
const logger = new Logger(process.env.LOG_DIR)

const client = new Client({
    intents: ['DIRECT_MESSAGES', 'GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
})

client.logger = logger
client.testers = testers
client.arguments = arguments
client.aliases = new Collection()
client.commands = new Collection()
client.categories = new Collection()

commands = require('./handler/command')(client, process.env.COMMANDS_FOLDER)

console.log(commands.toString())

client.on("ready", async () => {
    logger.info(`Logged in as ${client.user.tag}!`)
    logger.info(`Client id: ${client.user.id}`)
    logger.info(`Deployment: ${await client.getDeployment()}`)
    logger.info(`Version: ${await client.getVersion()}`)
    logger.info('-------------------------------------------')

    client.user.setActivity(`${prefixes[0]}help`, {
        type: 'LISTENING'
    })
})

client.on("error", (e) => {
    console.log(e.name, e.message)
    return
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
client.getDeployment = async function () {
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

client.on('message', async message => {
    var hasPrefix = false;
    var prefix = ''

    for (const _prefix of prefixes) {
        if (message.content.startsWith(_prefix)) {
            hasPrefix = true;
            prefix = _prefix
        }
    }

    if (message.author.bot) return
    if (!message.guild) return
    if (!hasPrefix) return

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

        if (command.development) {
            if (!arguments.development) return
        }
        if (command.devOnly) {
            if (!testers.includes(message.author.id)) return
        }

        try {
            const run = await command.run(client, message, args, args1)
            if (run instanceof Error) {
                return await reply(message, await createErrorEmbed(`There was an error running the command: ${command.name}`, message.author))
            }
        } catch (error) {
            console.error(error)
            return await reply(message, await createErrorEmbed(`There was an error running the command: ${command.name}`, message.author))
        }

        console.log(`${message.author.username}#${message.author.discriminator} (${message.author.id}) successfully ran the command: ${command.name}`)
    } else return
})

logger.info('Client logging in...')
client.login(process.env.TOKEN)
logger.info('Client logged in!')