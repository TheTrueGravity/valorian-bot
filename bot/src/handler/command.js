const {
    readdirSync
} = require("fs");
const ascii = require("ascii-table");
const table = new ascii().setHeading("Command", "Load status");

module.exports = (client, commandsFolder) => {
    const categories = []
    
    readdirSync(commandsFolder).forEach(dir => {
        const commands = readdirSync(`${commandsFolder}/${dir}/`).filter(f => f.endsWith(".js"))
        const temp = []

        for (let file of commands) {
            let pull = require(`${commandsFolder}/${dir}/${file.split('.')[0]}`)

            if (file == '_category.js') {
                categories.push(pull)
                continue
            }

            
            temp[temp.length] = {
                name: pull.name,
                aliases: pull.aliases,
                category: pull.category,
                description: pull.description,
                devOnly: pull.devOnly
            }

            if (pull.name) {
                client.commands.set(pull.name, pull)
                table.addRow(file, "✅")
            } else {
                table.addRow(file, '❌ -> missing something?')
                continue
            }

            if (pull.aliases && Array.isArray(pull.aliases)) {
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name))
            }
        }
        client.categories.set(dir, temp)

        client.categories.set('categories', categories)
    })

    return table
}