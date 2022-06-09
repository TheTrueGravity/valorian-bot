import {
    Worker, isMainThread, WorkerOptions
} from 'worker_threads'

export default class WorkerThread {
    public worker: Worker | null

    private _workerName: string
    private _path: string
    private _options: WorkerOptions | undefined

    constructor(workerName: string, path: string, options?: WorkerOptions | undefined) {
        if (!isMainThread) {
            throw new Error('This file should only be run in the main thread.')
        }

        this.worker = null

        this._path = path
        this._options = options
        this._workerName = workerName
    }

    public startWorker(): void {
        console.log(this.path, this.options)
        const _path = '' + this.path
        this.worker = new Worker(_path)
    }

    public terminate(): void {
        this.worker?.terminate()
    }

    public get workerName(): string {
        return this._workerName
    }
    private set workerName(workerName: string) {
        this._workerName = workerName
    }

    public get path(): string {
        return this._path
    }
    private set path(path: string) {
        this._path = path
    }

    public get options(): WorkerOptions | undefined {
        return this._options
    }
    private set options(options: WorkerOptions | undefined) {
        this._options = options
    }

    public static toJSON(workerThread: WorkerThread): any {
        return {
            path: workerThread.path,
            options: workerThread.options
        }
    }

    public static fromJSON(json: any): WorkerThread {
        return new WorkerThread(json.path, json.options)
    }
}

