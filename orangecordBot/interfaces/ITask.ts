import {
    Client
} from 'discord.js'

export default interface ITask {
    name: string;
    description: string;
    development?: boolean;
    run: (client: Client, ...args: any[]) => void;
}