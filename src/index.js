const {
    Client,
    Collection
} = require('discord.js')
const {
    argParse
} = require('./handler/args')

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

const client = new Client({
    intents: ['DIRECT_MESSAGES', 'GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
})

client.commands = new Collection()
client.aliases = new Collection()
client.categories = new Collection()

commands = require('./handler/command')(client, process.env.COMMANDS_FOLDER)

console.log(commands.toString())

client.on("ready", async () => {
    console.log()
    console.log('Logged in as:      ', client.user.username)
    console.log('Client ID:         ', client.user.id)
    console.log('-------------------------------------------')
    await client.user.setActivity('The official valorian discord bot!', {
        type: 'PLAYING',
        name: 'VALORIAN SURVIVAL',
        url: 'https://www.twitch.tv/springfulofficial'
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
    } = require('../package.json')
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
            if (!(testers.includes(message.author.id)) && command.name != "deployment") return
        } else {
            for (var category of client.categories.get("categories")) {
                if (category.name == command.category) {
                    if (category.mod) {
                        if (!await client.isMod(message)) return
                    } else if (command.development) {
                        if (!arguments.development) return
                    }
                }
            }
        }
        console.log(`${message.author.username}#${message.author.discriminator} (${message.author.id}) ran command: ${command.name}`)
        
        const run = await command.run(client, message, args, args1)

        console.log(run)

        if (run instanceof Error) {
            console.error(run)
            return message.reply("There was an error running this command!")
        }
    } else return
})

client.login(process.env.TOKEN)