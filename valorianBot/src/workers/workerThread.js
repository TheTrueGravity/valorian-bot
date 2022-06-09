"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
class WorkerThread {
    constructor(workerName, path, options) {
        if (!worker_threads_1.isMainThread) {
            throw new Error('This file should only be run in the main thread.');
        }
        this.worker = null;
        this._path = path;
        this._options = options;
        this._workerName = workerName;
    }
    startWorker() {
        console.log(this.path, this.options);
        const _path = '' + this.path;
        this.worker = new worker_threads_1.Worker(_path);
    }
    terminate() {
        var _a;
        (_a = this.worker) === null || _a === void 0 ? void 0 : _a.terminate();
    }
    get workerName() {
        return this._workerName;
    }
    set workerName(workerName) {
        this._workerName = workerName;
    }
    get path() {
        return this._path;
    }
    set path(path) {
        this._path = path;
    }
    get options() {
        return this._options;
    }
    set options(options) {
        this._options = options;
    }
    static toJSON(workerThread) {
        return {
            path: workerThread.path,
            options: workerThread.options
        };
    }
    static fromJSON(json) {
        return new WorkerThread(json.path, json.options);
    }
}
exports.default = WorkerThread;
