const { MessageEmbed } = require('discord.js')

async function getCategories (client) {
    const categories = client.categories.get('categories')
    const out = []

    for (var category of categories) {
        console.log(category)
        out.push({
            name: category.name,
            description: category.description,
            mod: category.mod
        })
    }

    return out
}

async function getCommands (client, categoryName) {
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

async function getCommand (client, commandName) {
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
    run: async (client, message, args) => {
        const categories = await getCategories(client)

        console.log(args)

        if (!args[0]) {
            console.log(categories)
            var description = ''
            
            for (var category of categories) { description += `${category.name} - ${category.description}\n\n` }
            
            const embed = new MessageEmbed({
                title: 'Help',
                description: description,
                author: {
                    name: message.author.username,
                    iconURL: message.author.avatarURL()
                }
            })

            console.log(description)

            await message.channel.send({ embeds: [embed] })
        } else {
            if (categories.map(x => x.name).find(e => e == args[0].toLowerCase())) {
                for (var category of categories) {
                    if (category.name == args[0].toLowerCase()) {
                        var description = ''
                        const commands = await getCommands(client, category.name)

                        for (var command of commands) {
                            if (command.requiredPerms == 'mod') {
                                if (client.isMod(message)) {
                                    description += 
                                    `**Name:** ${command.name}
                                    **Description**: ${command.description}
                                    **Category**: ${command.category}`
                                    if (command.aliases) {
                                        description += `\n**Aliases** - ${command.aliases.join(', ').substr(0, command.aliases.join(', ').length)}`
                                    }
                                    description += '\n\n'
                                }
                            } else {
                                description += 
                                    `**Name:** ${command.name}
                                    **Description**: ${command.description}
                                    **Category**: ${command.category}`
                                    if (command.aliases) {
                                        description += `\n**Aliases** - ${command.aliases.join(', ').substr(0, command.aliases.join(', ').length)}`
                                    }
                                    description += '\n\n'
                            }
                        }

                        const embed = new MessageEmbed({
                            title: 'Help',
                            description: description,
                            author: {
                                name: message.author.username,
                                iconURL: message.author.avatarURL()
                            }
                        })
                    
                        await message.channel.send({ embeds: [embed] })
                    }
                }
            } else {
                for (var category of categories) {
                    const commands = await getCommands(client, category.name)

                    if (commands.map(x => x.name).find(e => e == args[0].toLowerCase())) {
                        const command = await getCommand(client, commands.find(e => e.name == args[0].toLowerCase()).name)

                        if (command.requiredPerms == 'mod') if (!client.isMod(message)) return

                        var description =
                        `**Name:** ${(await command).name}
                        **Description**: ${command.description}
                        **Category**: ${command.category}`
                        if (command.aliases) {
                            description += `\n**Aliases** - ${command.aliases}`
                        }
                        description += '\n\n'
    
                        const embed = new MessageEmbed({
                            title: 'Help',
                            description: description,
                            author: {
                                name: message.author.username,
                                iconURL: message.author.avatarURL()
                            }
                        })
                    
                        await message.channel.send({ embeds: [embed] })
                    }
                    
                }
            }
        }
    }
}