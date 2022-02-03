export class Buffer {
    private buffer: Array<any>

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