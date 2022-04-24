import {
    existsSync,
    fstat,
    PathLike,
    PathOrFileDescriptor,
    readFileSync,
    writeFileSync
} from 'fs'
export interface ILogger {
    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
    debug(message: string): void;
    verbose(message: string): void;
}

export function getDateAsString(forFileName: boolean = false): string {
    const date_ob = new Date()
        
    var date = ("0" + date_ob.getDate()).slice(-2)
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
    var year = date_ob.getFullYear()
    var hours = date_ob.getHours()
    var minutes = date_ob.getMinutes()
    var seconds = date_ob.getSeconds()

    if (forFileName) {
        return `${date}-${month}-${year}_${hours}-${minutes}-${seconds}`
    } else {
        return `${date}-${month}-${year} ${hours}:${minutes}:${seconds}`
    }
}

export default class Logger implements ILogger {
    private logFolder: PathLike
    private logFileName: string
    private logFilePath(): PathOrFileDescriptor {
        return this.logFolder + '/' + this.logFileName
    }

    constructor(logFolder: PathLike) {
        this.logFolder = logFolder

        this.logFileName = `${getDateAsString(true)}.log`

        console.log(`Logging to ${this.logFilePath()}`)

        writeFileSync(this.logFilePath(), '', {
            encoding: 'utf8'
        })

        this.writeFile('------------------------------------------------------')
        this.info('Logger initialized')
    }

    private writeFile(message: String) {
        const file = `${this.logFolder}/${this.logFileName}`
        var fileData = readFileSync(file, {
            encoding: 'utf8'
        })

        fileData += message
        writeFileSync(file, fileData, {
            encoding: 'utf8'
        })
    }

    public error(message: string | Error): void {
        const msg =  getDateAsString() + " -> " + '[ERROR] ' + message
        console.error(msg)
        this.writeFile(msg)
    }
    public warn(message: string): void {
        const msg = getDateAsString() + " -> " + '[WARN] ' + message
        console.log(msg)
        this.writeFile(msg)
    }
    public info(message: string): void {
        const msg = getDateAsString() +  " -> " + '[INFO] ' + message
        console.log(msg)
        this.writeFile(msg)
    }
    public debug(message: string): void {
        const msg = getDateAsString() + " -> " + '[DEBUG] ' + message
        console.log(msg)
        this.writeFile(msg)
    }
    public verbose(message: string): void {
        const msg = getDateAsString() + " -> " + '[VERBOSE] ' + message
        console.log(msg)
        this.writeFile(msg)
    }
}