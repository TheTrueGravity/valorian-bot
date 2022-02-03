const { Client, Collection } = require('discord.js')
const { Buffer } = require('./handler/buffer')

prefix = "v!"

require('dotenv').config()

const client = new Client()
client.commands = new Collection()
client.aliases = new Collection()
client.categories = new Collection()

const dumpWriteBuffer = () => {
    const flush = writeBuffer.flush()

    var servers = require('./servers.json')

    for (var f in flush) {
        f = flush[f]

        if (f.type == 'bump') {
            if (servers[f.guild]['user_bumps'][f.author]) {
                servers[f.guild]['user_bumps'][f.author] += 1
            } else {
                servers[f.guild]['user_bumps'][f.author] = 1
            }
        } else if (f.type == 'cooldown') {
            servers[f.guild]['cooldown'] = f.time
        } else if (f.type == 'prefix') {
            servers[f.guild]['prefix'] = f.prefix
        } else if (f.type == 'role') {
            servers[f.guild]['roles'][f.level] = f.role.id
        }
    }

    writeJson('./servers.json', servers)
}

setInterval(dumpWriteBuffer, 1000)

commands = require('./handler/command')(client)

console.log(commands.toString())

client.writeDate = (data) => {
    console.log(data)
}

client.on("ready", async () => {
    console.log()
    console.log('Logged in as:      ', client.user.username)
    console.log('Client ID:         ', client.user.id)
    console.log('-------------------------------------------')
    await client.user.setActivity('Take a slice! !o help', {
        type: 'PLAYING',
        url: 'https://orange-cord.web.app/invite'
    })
})

const handleNewServer = async (guild) => {
    const servers = require('./servers.json')

    servers[guild.id.toString()] = {}
    servers[guild.id.toString()]["prefix"] = process.env.DEFAULT_PREFIX
    servers[guild.id.toString()]["cooldown"] = 0
    servers[guild.id.toString()]["user_bumps"] = {}
    servers[guild.id.toString()]["roles"] = {}

    await writeJson('./servers.json', servers)
}

client.on('message', async message => {
    var servers = require('./servers.json')
    if (servers[message.guild.id] == undefined) {
        await handleNewServer(message.guild)
    }

    servers = require('./servers.json')

    const _prefix = await prefix(message.guild.id)

    var hasPrefix = false;

    if (typeof _prefix === 'object') {
        _prefix.forEach(element => {
            if (message.content.toLowerCase().startsWith(element)) {
                hasPrefix = true
            }
        })
    } else {
        if (message.content.startsWith(_prefix)) hasPrefix = true
    }

    if (message.author.bot) return
    if (!message.guild) return
    if (!hasPrefix) return

    const args = message.content.slice(_prefix).trim().split(/ +/g)
    const args1 = message.content.slice(_prefix).trimStart().replace(_prefix, '').replace(args[1], '').trimStart()
    args.shift()
    const cmd = args.shift().toLowerCase()

    var command = client.commands.get(cmd)

    if (!command) {
        command = client.commands.get(client.aliases.get(cmd))
    }

    if (command) {
        if (command.requiredPerms) {
            if (command.requiredPerms == 'mod') {
                var isMod = false;
                ['BAN_MEMBERS', 'DEAFEN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_EMOJIS',
                    'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS'
                ].forEach(permission => {
                    if (message.guild.member(message.author).hasPermission(permission)) isMod = true;
                })
                if (!isMod) return;
            } else if (command.requiredPerms == 'admin') {
                if (!message.guild.member(message.author).hasPermission('ADMINISTRATOR')) return;
            } else if (command.requiredPerms == 'owner') {
                if (!message.guild.member(message.author).hasPermission(null, {
                        checkOwner: true
                    })) return;
            } else {
                command.requiredPerms.forEach(requiredPerm => {
                    if (!message.guild.member(message.author).hasPermission(requiredPerm)) return;
                })
            }
        }
        command.run(client, message, args, args1)
    }
})

client.on('guildCreate', handleNewServer)

client.on('guildDelete', guild => {
    const servers = require('./servers.json')

    delete servers[guild.id.toString()]

    writeFileSync('./servers', JSON.stringify(servers))
})

client.login(process.env.TOKEN)