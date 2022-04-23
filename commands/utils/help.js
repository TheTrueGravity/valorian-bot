const {
    MessageEmbed
} = require('discord.js')
const {
    reply,
    createErrorEmbed,
    createAuthorEmbed,
    createTitleEmbed
} = require('../../src/handler/embeds')

async function getCategories(client) {
    const categories = client.categories.get('categories')
    const out = []

    for (var category of categories) {
        out.push({
            name: category.name,
            description: category.description,
            mod: category.mod
        })
    }

    return out
}

async function getCommands(client, categoryName) {
    const commands = client.categories.get(categoryName)

    const out = []

    for (var command of commands) {
        const push = {
            name: command.name,
            category: command.category,
            description: command.description,
            requiredPerms: command.requiredPerms
        }
        if (command.aliases) {
            push['aliases'] = command.aliases
        }

        out.push(push)
    }

    return out
}

async function getCommand(client, commandName) {
    const command = client.commands.get(commandName)

    const out = {
        name: command.name,
        category: command.category,
        description: command.description,
        requiredPerms: command.requiredPerms
    }
    if (command.aliases) {
        var aliases = ''
        for (var alias of command.aliases) {
            aliases += alias + ', '
        }
        out['aliases'] = aliases.slice(0, aliases.length - 2)
    }

    return out
}

module.exports = {
    name: "help",
    category: "utils",
    description: "Help command of the bot!",
    args: ["", "{Category name}", "{Command name}"],
    run: async (client, message, args) => {
        const categories = await getCategories(client)
        if (!args[0]) {
            var description = ''

            for (var category of categories) {
                console.log(category)
                if (category.mod) {
                    if(!await client.isMod(message)) continue
                    description += `${category.name} - ${category.description}\n\n`
                } else if (category.development) {
                    if(!client.arguments.development) continue
                    description += `${category.name} - ${category.description}\n\n`
                } else {
                    description += `${category.name} - ${category.description}\n\n`
                }
            }

            await reply(message, await createTitleEmbed("Help", description, process.env.MAIN_EMBED_COLOUR, message.author))
        } else {
            if (categories.map(x => x.name).find(e => e == args[0].toLowerCase())) {
                for (var category of categories) {
                    if (category.name.toLowerCase() == args[0].toLowerCase()) {
                        if (category.mod && !(await client.isMod(message))) {
                            return await reply(message, await createErrorEmbed('You do not have the required permissions!', message.author))
                        }

                        var description = ''
                        const commands = await getCommands(client, category.name)

                        for (var command of commands) {
                            if (command.development) if(!client.arguments.development) continue
                            description +=
                                `**Name:** ${command.name}\n**Description**: ${command.description}\n**Category**: ${command.category}`
                            if (command.aliases) {
                                description += `\n**Aliases** - ${command.aliases.join(', ').substr(0, command.aliases.join(', ').length)}`
                            }
                            description += '\n\n'
                        }

                        await reply(message, await createTitleEmbed("Help", description, process.env.MAIN_EMBED_COLOUR, message.author))
                    }
                }
            } else {
                for (var category of categories) {
                    const commands = await getCommands(client, category.name)

                    if (commands.map(x => x.name).find(e => e.toLowerCase() == args[0].toLowerCase())) {
                        const command = await getCommand(client, commands.find(e => e.name.toLowerCase() == args[0].toLowerCase()).name)

                        if (command.development) if(!client.arguments.development) {
                            return await reply(message, await createErrorEmbed('That command is currently under development!', message.author))
                        }

                        if (category.mod && !(await client.isMod(message))) {
                            return await reply(message, await createErrorEmbed('You do not have the required permissions!', message.author))
                        }

                        var description =
                            `**Name:** ${(await command).name}\n**Description**: ${command.description}\n**Category**: ${command.category}`
                        if (command.aliases) {
                            description += `\n**Aliases** - ${command.aliases}`
                        }
                        description += '\n\n'

                        await reply(message, await createTitleEmbed("Help", description, process.env.MAIN_EMBED_COLOUR, message.author))
                    }
                }
            }
        }
    }
}