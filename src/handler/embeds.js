const { MessageEmbed } = require('discord.js')

// Return an embed with a given description and colour.
module.exports.createBasicEmbed = async (description, colour) => {
    const embed = new MessageEmbed()
        .setDescription(description)
        .setColor(colour)
    return embed
}

// Return an embed with a given title, description, colour and author.
module.exports.createTitleEmbed = async (title, description, colour, author) => {
    const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(colour)
        .setAuthor({
            name: author.username,
            iconURL: author.avatarURL()
        })
    return embed
}

// Return an embed with a given description, colour, and author.
module.exports.createAuthorEmbed = async (description, colour, author) => {
    const embed = new MessageEmbed()
        .setDescription(description)
        .setColor(colour)
        .setAuthor({
            name: author.username,
            iconURL: author.avatarURL()
        })
    return embed
}

// Return an embed with a given description, colour, and thumbnail.
module.exports.createThumbnailEmbed = async (description, colour, thumbnail) => {
    const embed = new MessageEmbed()
        .setDescription(description)
        .setColor(colour)
        .setThumbnail(thumbnail)
    return embed
}

// Return an error embed with a given description and author
module.exports.createErrorEmbed = async (description, author) => {
    const embed = new MessageEmbed()
        .setDescription(description)
        .setColor('#ff0000')
        .setAuthor({
            name: author.username,
            iconURL: author.avatarURL()
        })
    return embed
}

// Return an embed with a given title, colour, author and fields.
module.exports.createFieldsEmbed = async (title, colour, author, fields) => {
    const embed = new MessageEmbed()
        .setTitle(title)
        .setColor(colour)
        .setAuthor({
            name: author.username,
            iconURL: author.avatarURL()
        })
        .addFields(fields)
    return embed
}

// Reply to a given message with an embed.
module.exports.reply = async (message, embed) => {
    return message.channel.send({
        embeds: [embed]
    })
}