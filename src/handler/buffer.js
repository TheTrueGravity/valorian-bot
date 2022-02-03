"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buffer = void 0;
var Buffer = /** @class */ (function () {
    function Buffer() {
    }
    Buffer.prototype.clear = function () {
        this.buffer = [];
    };
    Buffer.prototype.add = function (data) {
        this.buffer[this.buffer.length] = data;
    };
    Buffer.prototype.read = function (position) {
        return this.buffer[position];
    };
    Buffer.prototype.flush = function () {
        var send = this.buffer;
        this.clear();
        return send;
    };
    return Buffer;
}());
exports.Buffer = Buffer;
