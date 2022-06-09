import {
    isMainThread, WorkerOptions
} from 'worker_threads'

import WorkerThread from './workerThread'

export default class WorkerHandler {
    private workers: { [key: string]: WorkerThread } = {}

    constructor(json?: any) {
        if (!isMainThread) {
            throw new Error('This file should only be run in the main thread.')
        }

        if (json["workers"]) {
            for (const workerName in json["workers"]) {
                this.addWorker(WorkerThread.fromJSON(json[workerName]))
            }
        }
    }

    public getWorker(workerName: string): WorkerThread {
        return this.workers[workerName]
    }

    public addWorker(worker: WorkerThread) {
        this.workers[worker.workerName] = worker
        this.workers[worker.workerName].startWorker()
        console.log(this.workers)
    }

    public removeWorker(worker: WorkerThread): void {
        if (this.workers[worker.workerName]) {
            worker.terminate()
            delete this.workers[worker.workerName]
        } else {
            throw new Error(`Worker with path ${worker.workerName} does not exist.`)
        }
    }

    public terminateAllWorkers(): void {
        for (const workerName in this.workers) {
            this.workers[workerName].terminate()
        }
        this.workers = {}
    }

    public toJSON(): any {
        const out: { [key: string]: any } = {}
        for (const workerName in this.workers) {
            out[workerName] = WorkerThread.toJSON(this.workers[workerName])
        }
        return out
    }
}