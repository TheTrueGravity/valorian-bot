const {
    reply,
    createErrorEmbed,
    createAuthorEmbed,
    createTitleEmbed
} = require('../../src/handler/embeds')

module.exports = {
    name: "help",
    category: "utils",
    description: "Help command of the bot!",
    args: ["", "{Category name}", "{Command name}"],
    run: async (client, message, args) => {
        const categories = client.categories.get('categories')
        if (!args[0]) {
            var description = ''

            for (var category of categories) {
                console.log(category, client.arguments)
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
                        const commands = client.categories.get(category.name)

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
                        const command = await client.commands.get(commands.find(e => e.name.toLowerCase() == args[0].toLowerCase()).name)

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