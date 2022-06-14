export class Buffer<T> {
    private buffer: Array<T>

    constructor() {
        this.buffer = []
    }

    private clear() {
        this.buffer = []
    }

    public add(data: any) {
        this.buffer[this.buffer.length] = data
    }

    public read(position: number) {
        return this.buffer[position]
    }

    public flush() {
        var send = this.buffer
        this.clear()
        return send
    }
}