const {
    argParse
} = require('./handler/args')
// const {
//     default: WorkerHandler
// } = require('./workers/workerHandler')
// const {
//     default: WorkerThread
// } = require('./workers/workerThread')
const {
    isMainThread,
    Worker
} = require('worker_threads')
const {
    default: Logger,
    LogLevel
} = require('./handler/logger')
const {
    writeFileSync
} = require('fs')

require('dotenv').config()

const arguments = argParse("", [{
        name: '--development',
        alias: '-d',
        options: {
            action: 'store_true',
            help: 'Enable development mode'
        },
    },
    {
        name: '--beta',
        alias: '-b',
        options: {
            action: 'store_true',
            help: 'Enable beta mode'
        }
    }
])

const loggerConfig = arguments.development ? {
    logToFile: false
} : {
    logFolder: process.env.LOG_DIR
}
const logger = new Logger(loggerConfig)

logger.log(LogLevel.DEBUG, "Logger initialized!")

// const workerHandlerConfig = require('../config/workerHandler.json')
// const workerHandler = new WorkerHandler(workerHandlerConfig)

async function createClientWorker() {
    var recievedResponse = false
    logger.log(LogLevel.INFO, 'Creating client worker...')

    const clientWorker = new Worker('./bot/src/threads/client.js', {
        argv: process.argv.slice(2, process.argv.length)
    })

    clientWorker.on('message', async message => {
        if (message.type == 'error') {
            logger.log(LogLevel.ERROR, `(Client Thread) ${message.error}`)
        } else if (message.type == 'log') {
            logger.log(message.level, `(Client Thread) ${message.message}`)
        } else if (message.type == 'pong') {
            recievedResponse = true
        } else {
            console.log(message)
        }
    })

    clientWorker.on('online', () => {
        logger.log(LogLevel.INFO, 'Client worker online!')
    })

    clientWorker.on('error', (err) => {
        logger.log(LogLevel.ERROR, `(Client Thread) ${err}`)
    })
    
    logger.log(LogLevel.INFO, 'Pinging client worker...')

    clientWorker.postMessage({
        type: 'ping'
    })

    while (!recievedResponse) {
        await new Promise(resolve => setTimeout(resolve, 100))
    }

    logger.log(LogLevel.INFO, 'Recieved response from the client worker!')

    clientWorker.postMessage({
        type: 'init'
    })
}

async function run() {
    if (!isMainThread) {
        throw new Error('This script must be run in the main thread!')
    }
    createClientWorker()
}

// process.on('SIGINT', function () {
//     writeFileSync('./bot/config/workerHandler.json', JSON.stringify(workerHandler.toJSON()))
//     process.exit(0)
// })

if (isMainThread) {
    logger.log(LogLevel.DEBUG, "Main thread started!")
    run()
}