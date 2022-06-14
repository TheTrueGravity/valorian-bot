import {
    Client
} from 'discord.js'

export enum TaskTypes {
    onClientEvent = 1,
    scheduled
}

export default interface ITask {
    name: string;
    enabled: boolean;
    taskType: TaskTypes;
    description: string;
    development?: boolean;
    init?: (client: Client) => Promise<void>;
    run: (client: Client, ...args: any[]) => void;
}