import {
    Client,
    Message,
    Role
} from 'discord.js'

export default interface ICommand {
    name: string,
    category: string,
    description: string,
    args: string | string[],
    run(client: Client, message: Message, args: Array<string>, args1: string): Promise<void | Error>,
}