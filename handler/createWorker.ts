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

    LOGGER.log(LogLevel.INFO, `Worker created`, workerName)

    worker.on('message', (message) => {
        switch (message.type) {
            case 'log':
                LOGGER.log(message.level, `${message.message}`, workerName)
                break
            case 'error':
                LOGGER.log(LogLevel.ERROR, `${message.error}`, workerName)
                break
            case 'pong':
                recievedResponse = true
                break
            case 'init':
                if (message.success) {
                    LOGGER.log(LogLevel.INFO, `Worker initialized`, workerName)
                } else {
                    LOGGER.log(LogLevel.ERROR, `Worker initialization failed`, workerName)
                }
                break
            case 'start':
                if (message.success) {
                    LOGGER.log(LogLevel.INFO, `Worker started`, workerName)
                    started = true
                } else {
                    LOGGER.log(LogLevel.ERROR, `Worker start failed`, workerName)
                }
                break
            default:
                LOGGER.log(LogLevel.ERROR, `Unknown message type: ${message.type}`, workerName)
                break
        }
    })

    worker.on('error', (error) => {
        LOGGER.log(LogLevel.ERROR, error)
    })

    worker.on('exit', (code: number) => {
        if (code !== 0) {
            LOGGER.log(LogLevel.ERROR, `Worker exited with code ${code}`)
        }
    })

    worker.on('online', () => {
        LOGGER.log(LogLevel.INFO, `Worker online`)
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