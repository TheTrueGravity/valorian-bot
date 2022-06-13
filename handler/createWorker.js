"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const worker_threads_1 = require("worker_threads");
function createWorker(workerPath, workerName, workerConfig, LOGGER, workerOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!worker_threads_1.isMainThread) {
            throw new Error('This function can only be called from the main thread');
        }
        var recievedResponse = false;
        var started = false;
        LOGGER.log(logger_1.LogLevel.INFO, `Creating worker ${workerName}`);
        const worker = new worker_threads_1.Worker(workerPath, Object.assign({ argv: process.argv.slice(2), env: Object.assign(Object.assign({}, workerConfig), process.env) }, workerOptions));
        LOGGER.log(logger_1.LogLevel.INFO, `(${workerName}) Worker created`);
        worker.on('message', (message) => {
            switch (message.type) {
                case 'log':
                    LOGGER.log(message.level, `(${workerName}) ${message.message}`);
                    break;
                case 'error':
                    LOGGER.log(logger_1.LogLevel.ERROR, `(${workerName}) ${message.message}`);
                    break;
                case 'pong':
                    recievedResponse = true;
                    break;
                case 'init':
                    if (message.success) {
                        LOGGER.log(logger_1.LogLevel.INFO, `(${workerName}) Worker initialized`);
                    }
                    else {
                        LOGGER.log(logger_1.LogLevel.ERROR, `(${workerName}) Worker initialization failed`);
                    }
                    break;
                case 'start':
                    if (message.success) {
                        LOGGER.log(logger_1.LogLevel.INFO, `(${workerName}) Worker started`);
                        started = true;
                    }
                    else {
                        LOGGER.log(logger_1.LogLevel.ERROR, `(${workerName}) Worker start failed`);
                    }
                    break;
                default:
                    LOGGER.log(logger_1.LogLevel.ERROR, `(${workerName}) Unknown message type: ${message.type}`);
                    break;
            }
        });
        worker.on('error', (error) => {
            LOGGER.log(logger_1.LogLevel.ERROR, `(${workerName}) ${error.message}`);
        });
        worker.on('exit', (code) => {
            if (code !== 0) {
                LOGGER.log(logger_1.LogLevel.ERROR, `(${workerName}) Worker exited with code ${code}`);
            }
        });
        worker.on('online', () => {
            LOGGER.log(logger_1.LogLevel.INFO, `(${workerName}) Worker online`);
        });
        worker.postMessage({
            type: 'ping'
        });
        while (!recievedResponse) {
            yield new Promise((resolve) => setTimeout(resolve, 100));
        }
        worker.postMessage({
            type: 'init'
        });
        worker.postMessage({
            type: 'start'
        });
        while (!started) {
            yield new Promise((resolve) => setTimeout(resolve, 100));
        }
        return worker;
    });
}
exports.default = createWorker;
