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

export default class Logger implements ILogger {
    private logFile: PathLike
    private errorFile: PathLike

    constructor(logFile: PathLike, errorFile: PathLike) {
        this.logFile = logFile
        this.errorFile = errorFile

        if (!existsSync(logFile)) {
            writeFileSync(logFile, '', {
                encoding: 'utf8'
            })
        }
        if (!existsSync(errorFile)) {
            writeFileSync(errorFile, '', {
                encoding: 'utf8'
            })
        }

        this.info('Logger initialized')
    }

    private writeFile(file: PathOrFileDescriptor, message: String) {
        var fileData = readFileSync(file, {
            encoding: 'utf8'
        })
        let date_ob = new Date()
        
        let date = ("0" + date_ob.getDate()).slice(-2)
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2)
        let year = date_ob.getFullYear()
        let hours = date_ob.getHours()
        let minutes = date_ob.getMinutes()
        let seconds = date_ob.getSeconds()
        
        let date_string = date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;

        fileData += `${date_string} ${message}\n`
        writeFileSync(file, fileData, {
            encoding: 'utf8'
        })
    }

    public error(message: string | Error): void {
        const msg = '[ERROR] ' + message
        console.error(msg)
        this.writeFile(this.errorFile, msg)
    }
    public warn(message: string): void {
        const msg = '[WARN] ' + message
        console.log(msg)
        this.writeFile(this.logFile, msg)
    }
    public info(message: string): void {
        const msg = '[INFO] ' + message
        console.log(msg)
        this.writeFile(this.logFile, msg)
    }
    public debug(message: string): void {
        const msg = '[DEBUG] ' + message
        console.log(msg)
        this.writeFile(this.logFile, msg)
    }
    public verbose(message: string): void {
        const msg = '[VERBOSE] ' + message
        console.log(msg)
        this.writeFile(this.logFile, msg)
    }
}