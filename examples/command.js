const { Client, Message } = require('discord.js')

module.exports = {
    // Name of the command
    name: "command",

    // Category command is in
    category: "category",

    // The commands description
    description: "description",

    /**
     * Code to run when command is called
     * 
     * @param {Client} client The client object
     * @param {Message} message The message sent
     * @param {String[]} args An array of the command parameters
     * @param {String} args1 The raw string of the command parameters
     * 
    **/
    run: async (client, message, args, args1) => {
        // Run code here
    }
}