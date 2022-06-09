"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const workerThread_1 = __importDefault(require("./workerThread"));
class WorkerHandler {
    constructor(json) {
        this.workers = {};
        if (!worker_threads_1.isMainThread) {
            throw new Error('This file should only be run in the main thread.');
        }
        if (json["workers"]) {
            for (const workerName in json["workers"]) {
                this.addWorker(workerThread_1.default.fromJSON(json[workerName]));
            }
        }
    }
    getWorker(workerName) {
        return this.workers[workerName];
    }
    addWorker(worker) {
        this.workers[worker.workerName] = worker;
        this.workers[worker.workerName].startWorker();
        console.log(this.workers);
    }
    removeWorker(worker) {
        if (this.workers[worker.workerName]) {
            worker.terminate();
            delete this.workers[worker.workerName];
        }
        else {
            throw new Error(`Worker with path ${worker.workerName} does not exist.`);
        }
    }
    terminateAllWorkers() {
        for (const workerName in this.workers) {
            this.workers[workerName].terminate();
        }
        this.workers = {};
    }
    toJSON() {
        const out = {};
        for (const workerName in this.workers) {
            out[workerName] = workerThread_1.default.toJSON(this.workers[workerName]);
        }
        return out;
    }
}
exports.default = WorkerHandler;
