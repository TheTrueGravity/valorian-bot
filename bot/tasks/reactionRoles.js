module.exports = {
    name: 'reactionRoles',
    development: true,
    init: async function (client) {
        client.on('messageReactionAdd', async (reaction, user) => {
            console.log(reaction.message)
        })
        client.on('messageReactionRemove', async (reaction, user) => {
            console.log(reaction.message)
        })
    }
}