const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    name: "throwerror",
    category: "devs",
    description: "Throws a controlled error!",
    args: "",
    devOnly: true,
    run: async (client, message, args, args1) => {
        throw new Error("This is an error!")
    }
}