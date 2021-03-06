const {
    isMainThread
} = require('worker_threads')
const {
    argParse
} = require('./handler/args')
const {
    default: createWorker
} = require('./handler/createWorker')
const {
    default: Logger,
    LogLevel
} = require('./handler/logger')
const {
    readdirSync
} = require('fs')
const os = require('os')

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

const server = process.env.SERVER == 'true' ? true : false

const platform = server ? 'SERVER' : os.platform()

console.log(`Platform: ${platform}`)

var envKeys = Object.keys(process.env)

const modules = {}

const PARSED_VARS = {}

for (const key of envKeys) {
    if (key.includes(platform.toUpperCase())) {
        process.env[key.replace(platform.toUpperCase() + '.', '')] = process.env[key]
    }
}

for (const key of envKeys) {
    if (key.includes("WIN32") || key.includes("LINUX") || key.includes("MACOS") || key.includes("SERVER")) {
        delete process.env[key]
    }
}

envKeys = Object.keys(process.env)

for (let i = 0; i < envKeys.length; i++) {
    if (envKeys[i].includes('.')) {
        const VARS = envKeys[i].split('.')

        if (VARS[0] === 'MODULES') {
            if (!modules[VARS[1]]) {
                modules[VARS[1]] = {}
            }

            var isBool = false
            let bool

            if (process.env[envKeys[i]] == "true" || process.env[envKeys[i]] == "false") {
                isBool = true
                bool = process.env[envKeys[i]] == "true"
            }

            modules[VARS[1]][VARS[2]] = isBool ? bool : process.env[envKeys[i]]

            delete process.env[envKeys[i]]

            continue
        }
        
        if (!PARSED_VARS[VARS[0]]) {
            PARSED_VARS[VARS[0]] = {}
        }

        PARSED_VARS[VARS[0]][VARS[1]] = process.env[envKeys[i]]

        delete process.env[envKeys[i]]

        continue
    }
}

const loggerConfig = arguments.development ? {
    logToFile: false
} : {
    logFolder: process.env.LOG_DIR
}
const logger = new Logger(loggerConfig)

logger.log(LogLevel.DEBUG, "Logger initialized!")

async function run() {
    if (!isMainThread) {
        throw new Error('This script must be run in the main thread!')
    }

    for (const module in modules) {
        const MODULE = modules[module]

        if (!MODULE.ENABLED) continue

        modules[module].WORKER = await createWorker(MODULE.WORKER_PATH, module, PARSED_VARS[module], logger)
    }
}

if (isMainThread) {
    logger.log(LogLevel.DEBUG, "Main thread started!")
    run()
}