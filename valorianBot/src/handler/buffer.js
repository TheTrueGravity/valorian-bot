"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buffer = void 0;
class Buffer {
    constructor() {
        this.buffer = [];
    }
    clear() {
        this.buffer = [];
    }
    add(data) {
        this.buffer[this.buffer.length] = data;
    }
    read(position) {
        return this.buffer[position];
    }
    flush() {
        var send = this.buffer;
        this.clear();
        return send;
    }
}
exports.Buffer = Buffer;
