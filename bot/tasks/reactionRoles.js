module.exports = {
    name: 'reactionRoles',
    development: true,
    init: async function (client) {
        client.on('messageReactionAdd', async (reaction, user) => {
            console.log(reaction.message)
            parentPort.postMessage({
                type: 'messageReactionAdd',
                reaction: reaction.toJSON(),
                user: user.toJSON()
            })
        })
        client.on('messageReactionRemove', async (reaction, user) => {
            console.log(reaction.message)
            parentPort.postMessage({
                type: 'messageReactionRemove',
                reaction: reaction.toJSON(),
                user: user.toJSON()
            })
        })
    }
}