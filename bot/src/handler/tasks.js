const {
    readdirSync
} = require("fs");
const ascii = require("ascii-table");
const table = new ascii().setHeading("Command", "Load status");

module.exports = (tasks, tasksDir) => {
    const dir = readdirSync(tasksDir)

    const _tasks = dir.filter(f => f.endsWith(".js"))

    for (let file of _tasks) {
        let pull = require(`${tasksDir}/${file.split('.')[0]}`)

        if (pull.name) {
            tasks.set(pull.name, pull)
            table.addRow(file, "✅")
        } else {
            table.addRow(file, '❌ -> missing something?')
            continue
        }
    }

    return table
}