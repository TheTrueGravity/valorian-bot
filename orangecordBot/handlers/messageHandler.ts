import {
    Message
} from 'discord.js'
import {
    ILogger,
    LogLevel
} from '../../handler/logger'
import {
    createErrorEmbed,
    reply
} from '../modules/embeds'

export default async function handleMessage (client: any, message: Message, Logger: ILogger) {
    var hasPrefix = false;
    var prefix = ''

    for (const _prefix of await client.getPrefixes()) {
        if (message.content.toLowerCase().startsWith(_prefix)) {
            hasPrefix = true;
            prefix = message.content.slice(0, _prefix.length)
        }
    }

    if (message.author.bot) return
    if (!message.guild) return
    if (!hasPrefix) return
    if (client.useSpecificChannels == true) {
        for (const _channel of client.getChannels()) {
            if (message.channel.id == _channel) {
                return
            }
        }
    }

    const args = message.content.slice(prefix.length).trim().replace(prefix, '').split(/ +/g)
    const args1 = message.content.slice(prefix.length).trimStart().replace(prefix, '').replace(args[0], '').trimStart()

    const cmd = args.shift()?.toLowerCase()

    try {
        var command = client.commands.get(cmd)
    } catch {
        return message.reply("Invalid command!")
    }

    if (!command) {
        command = client.commands.get(client.aliases.get(cmd))
    }

    if (command) {
        if (client.arguments.development) {
            if (!client.testers.includes(message.author.id) && command.name != "deployment") return
        } else {
            for (var category of client.categories.get("categories")) {
                if (category.name == command.category && category.mod) {
                    if (!await client.isMod(message)) return
                }
            }
        }

        if (command.devOnly) {
            if (!client.testers.includes(message.author.id)) return
        }
        if (!command.development) {
            if (client.arguments.development) return
        } else {
            if (!client.arguments.development) return
        }

        try {
            const run = await command.run(client, message, args, args1)
            if (run instanceof Error) {
                Logger.log(LogLevel.ERROR, run)
                return await reply(message, await createErrorEmbed(
                    `There was an error running the command: ${command.name}`,
                    message.author,
                    process.env.BAD_ORANGE
                ))
            }
        } catch (e: any) {
            let error: Error = e
            Logger.log(LogLevel.ERROR, error)
            return await reply(message, await createErrorEmbed(
                `There was an error running the command: ${command.name}`,
                message.author,
                process.env.BAD_ORANGE
            ))
        }

        Logger.log(LogLevel.VERBOSE, `${message.author.username}#${message.author.discriminator} (${message.author.id}) successfully ran the command: ${command.name}`)
    } else return
}