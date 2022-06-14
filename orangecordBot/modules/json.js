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
exports.write = exports.read = void 0;
const fs_1 = require("fs");
function read(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return JSON.parse((0, fs_1.readFileSync)(file).toString());
    });
}
exports.read = read;
function write(file, data) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, fs_1.writeFileSync)(file, JSON.stringify(data, null, 4));
    });
}
exports.write = write;
