import { Guild, User } from "discord.js"
import * as json from '../modules/json'
import {
    Buffer
} from '../modules/buffer'

export interface IServerHandler {
    bump(guild: Guild, user: User): Promise<void>
    setCooldown(guild: Guild, time: number): Promise<void>
    changePrefix(guild: Guild, prefix: string): Promise<void>
    getPrefix(guild: Guild): Promise<string>
    getCooldown(guild: Guild): Promise<number>
}

export class ServerHandler implements IServerHandler {
    public static instance: ServerHandler
    
    private writeBuffer: Buffer<any>
    private bumped: { [key: string]: boolean } = {}

    private constructor() {
        if (ServerHandler.instance) {
            throw new Error("ServerHandler is a singleton class and cannot be instantiated more than once.")
        }

        this.writeBuffer = new Buffer()

        console.log(this.writeBuffer)

        ServerHandler.instance = this

        setInterval(async () => await ServerHandler.instance.flush(), 1000)
    }

    private async flush(): Promise<void> {
        const flush = this.writeBuffer.flush()

        const servers = await json.read(process.env.BOT_CONFIG_DIR + "/servers.json")

        for (var f in flush) {
            const _flush = flush[f]

            switch (_flush.type) {
                case "bump":
                    if (this.bumped[_flush.guild]) {
                        continue
                    }
                    if (servers[_flush.guild]['user_bumps'][_flush.author]) {
                        servers[_flush.guild]['user_bumps'][_flush.author]++
                    } else {
                        servers[_flush.guild]['user_bumps'][_flush.author] = 1
                    }
                    setTimeout(() => {
                        this.bumped[_flush.guild] = false
                    }
                    , 1000)
                    break
                case "setCooldown":
                    servers[_flush.guild]['cooldown'] = _flush.time
                    break
                case "changePrefix":
                    servers[_flush.guild]['prefix'] = _flush.prefix
                    break
                default:
                    break
            }
        }

        await json.write(process.env.BOT_CONFIG_DIR + "/servers.json", servers)
    }

    public static getInstance(): ServerHandler {
        if (!ServerHandler.instance) {
            new ServerHandler()
        }
        return ServerHandler.instance
    }

    public async bump(guild: Guild, user: User): Promise<void> {
        this.bumped[guild.id] = true
        this.writeBuffer.add({
            type: "bump",
            guild: guild.id,
            user: user.id
        })
    }

    public async setCooldown(guild: Guild, time: number): Promise<void> {
        this.writeBuffer.add({
            type: "setCooldown",
            guild: guild.id,
            time: time
        })
    }

    public async changePrefix(guild: Guild, prefix: string): Promise<void> {
        this.writeBuffer.add({
            type: "changePrefix",
            guild: guild.id,
            prefix: prefix
        })
    }

    public async getPrefix(guild: Guild): Promise<string> {
        return ""
    }

    public async getCooldown(guild: Guild): Promise<number> {
        return 0
    }
}