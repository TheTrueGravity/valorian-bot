const {
    readdirSync
} = require("fs");
const ascii = require("ascii-table");
const table = new ascii().setHeading("Command", "Load status");

module.exports = (client) => {
    const categories = []

    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith(".js"))
        const temp = []

        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file.split('.')[0]}`)._

            if (file == '_category.js') {
                categories.push(pull)
                break
            }

            
            temp[temp.length] = {
                name: pull.name,
                aliases: pull.aliases,
                category: pull.category,
                description: pull.description,
                requiredPerms: pull.requiredPerms
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