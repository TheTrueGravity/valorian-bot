const { Client, Collection } = require('discord.js')
const { Buffer } = require('./handler/buffer')

const prefix = "v!"

require('dotenv').config()

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_WEBHOOKS']
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
        name: 'VALORIAN SURVIVAL'
    })
})

client.on('message', async message => {
    var hasPrefix = false;

    if (message.content.startsWith(prefix)) hasPrefix = true

    if (message.author.bot) return
    if (!message.guild) return
    if (!hasPrefix) return

    const args = message.content.slice(prefix).trim().replace(prefix, '').split(/ +/g)
    const args1 = message.content.slice(prefix).trimStart().replace(prefix, '').replace(args[0], '').trimStart()

    const cmd = args.shift().toLowerCase()

    var command = client.commands.get(cmd)

    if (!command) {
        command = client.commands.get(client.aliases.get(cmd))
    }

    if (command) {
        command.run(client, message, args, args1)
    }
})

client.login(process.env.TOKEN)