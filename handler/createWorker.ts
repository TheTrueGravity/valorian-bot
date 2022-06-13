import {
    ILogger, LogLevel
} from './logger'
import {
    isMainThread, Worker
} from 'worker_threads'

export default async function createWorker(workerPath: string | URL, workerName: string, workerConfig: NodeJS.Dict<string>, LOGGER: ILogger, workerOptions?: WorkerOptions): Promise<Worker> {
    if (!isMainThread) {
        throw new Error('This function can only be called from the main thread')
    }
    
    var recievedResponse = false
    var started = false

    LOGGER.log(LogLevel.INFO, `Creating worker ${workerName}`)

    const worker = new Worker(workerPath, {
        argv: process.argv.slice(2),
        env: {
            ...workerConfig,
            ...process.env,
        },
        ...workerOptions
    })

    LOGGER.log(LogLevel.INFO, `(${workerName}) Worker created`)

    worker.on('message', (message) => {
        switch (message.type) {
            case 'log':
                LOGGER.log(message.level, `(${workerName}) ${message.message}`)
                break
            case 'error':
                LOGGER.log(LogLevel.ERROR, `(${workerName}) ${message.message}`)
                break
            case 'pong':
                recievedResponse = true
                break
            case 'init':
                if (message.success) {
                    LOGGER.log(LogLevel.INFO, `(${workerName}) Worker initialized`)
                } else {
                    LOGGER.log(LogLevel.ERROR, `(${workerName}) Worker initialization failed`)
                }
                break
            case 'start':
                if (message.success) {
                    LOGGER.log(LogLevel.INFO, `(${workerName}) Worker started`)
                    started = true
                } else {
                    LOGGER.log(LogLevel.ERROR, `(${workerName}) Worker start failed`)
                }
                break
            default:
                LOGGER.log(LogLevel.ERROR, `(${workerName}) Unknown message type: ${message.type}`)
                break
        }
    })

    worker.on('error', (error) => {
        LOGGER.log(LogLevel.ERROR, `(${workerName}) ${error.message}`)
    })

    worker.on('exit', (code: number) => {
        if (code !== 0) {
            LOGGER.log(LogLevel.ERROR, `(${workerName}) Worker exited with code ${code}`)
        }
    })

    worker.on('online', () => {
        LOGGER.log(LogLevel.INFO, `(${workerName}) Worker online`)
    })

    worker.postMessage({
        type: 'ping'
    })

    while (!recievedResponse) {
        await new Promise((resolve) => setTimeout(resolve, 100))
    }

    worker.postMessage({
        type: 'init'
    })
    worker.postMessage({
        type: 'start'
    })

    while (!started) {
        await new Promise((resolve) => setTimeout(resolve, 100))
    }

    return worker
}