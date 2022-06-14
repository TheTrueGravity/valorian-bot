import { ImageURLOptions, Message, User } from 'discord.js'
import { EmbedFieldData } from 'discord.js'
import {
    ColorResolvable,
    EmbedAuthorData,
    MessageEmbed
} from 'discord.js'

// Return an embed with a given description and colour.
export async function createBasicEmbed(description: string, colour: ColorResolvable): Promise<MessageEmbed> {
    const embed = new MessageEmbed()
        .setDescription(description)
        .setColor(colour)
    return embed
}

// Return an embed with a given title, description, colour and author.
export async function createTitleEmbed(title: string, description: string, colour: ColorResolvable, author: EmbedAuthorData | User, thumbnail?: string): Promise<MessageEmbed> {
    const _author: EmbedAuthorData = author instanceof User ? { name: author.username, iconURL: author.avatarURL()! } : author
    const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(colour)
        .setAuthor(_author)
    
        if (thumbnail) embed.setThumbnail(thumbnail)
    return embed
}

// Return an embed with a given description, colour, and author.
export async function createAuthorEmbed(description: string, colour: ColorResolvable, author: EmbedAuthorData | User): Promise<MessageEmbed> {
    const _author: EmbedAuthorData = author instanceof User ? { name: author.username, iconURL: author.avatarURL()! } : author
    const embed = new MessageEmbed()
        .setDescription(description)
        .setColor(colour)
        .setAuthor(_author)
    return embed
}

// Return an embed with a given description, colour, and thumbnail.
export async function createThumbnailEmbed(description: string, colour: ColorResolvable, thumbnail: string, author: EmbedAuthorData | User): Promise<MessageEmbed> {
    const _author: EmbedAuthorData = author instanceof User ? { name: author.username, iconURL: author.avatarURL()! } : author
    const embed = new MessageEmbed()
        .setDescription(description)
        .setColor(colour)
        .setThumbnail(thumbnail)
        .setAuthor(_author)
    return embed
}

// Return an error embed with a given description and author
export async function createErrorEmbed(description: string, author: EmbedAuthorData | User, thumbnail?: string): Promise<MessageEmbed> {
    const _author: EmbedAuthorData = author instanceof User ? { name: author.username, iconURL: author.avatarURL()! } : author
    const embed = new MessageEmbed()
        .setDescription(description)
        .setColor('#ff0000')
        .setAuthor(_author)
        
        if (thumbnail) embed.setThumbnail(thumbnail)
    return embed
}

// Return an embed with a given title, colour, author and fields.
export async function createFieldsEmbed(title: string, colour: ColorResolvable, author: EmbedAuthorData | User, fields: EmbedFieldData[]): Promise<MessageEmbed> {
    const _author: EmbedAuthorData = author instanceof User ? { name: author.username, iconURL: author.avatarURL()! } : author
    const embed = new MessageEmbed()
        .setTitle(title)
        .setColor(colour)
        .setAuthor(_author)
        .addFields(fields)
    return embed
}

// Reply to a given message with an embed.
export async function reply(message: Message, embed: MessageEmbed): Promise<Message<boolean>> {
    return message.channel.send({
        embeds: [embed]
    })
}