"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ServerHandler = void 0;
const json = __importStar(require("../modules/json"));
const buffer_1 = require("../modules/buffer");
class ServerHandler {
    constructor() {
        this.bumped = {};
        if (ServerHandler.instance) {
            throw new Error("ServerHandler is a singleton class and cannot be instantiated more than once.");
        }
        this.writeBuffer = new buffer_1.Buffer();
        console.log(this.writeBuffer);
        ServerHandler.instance = this;
        setInterval(() => __awaiter(this, void 0, void 0, function* () { return yield ServerHandler.instance.flush(); }), 1000);
    }
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            const flush = this.writeBuffer.flush();
            const servers = yield json.read(process.env.BOT_CONFIG_DIR + "/servers.json");
            for (var f in flush) {
                const _flush = flush[f];
                switch (_flush.type) {
                    case "bump":
                        if (this.bumped[_flush.guild]) {
                            continue;
                        }
                        if (servers[_flush.guild]['user_bumps'][_flush.author]) {
                            servers[_flush.guild]['user_bumps'][_flush.author]++;
                        }
                        else {
                            servers[_flush.guild]['user_bumps'][_flush.author] = 1;
                        }
                        setTimeout(() => {
                            this.bumped[_flush.guild] = false;
                        }, 1000);
                        break;
                    case "setCooldown":
                        servers[_flush.guild]['cooldown'] = _flush.time;
                        break;
                    case "changePrefix":
                        servers[_flush.guild]['prefix'] = _flush.prefix;
                        break;
                    default:
                        break;
                }
            }
            yield json.write(process.env.BOT_CONFIG_DIR + "/servers.json", servers);
        });
    }
    static getInstance() {
        if (!ServerHandler.instance) {
            new ServerHandler();
        }
        return ServerHandler.instance;
    }
    bump(guild, user, time) {
        return __awaiter(this, void 0, void 0, function* () {
            this.bumped[guild.id] = true;
            this.writeBuffer.add({
                type: "bump",
                guild: guild.id,
                user: user.id,
                time: time
            });
        });
    }
    changePrefix(guild, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            this.writeBuffer.add({
                type: "changePrefix",
                guild: guild.id,
                prefix: prefix
            });
        });
    }
    getPrefix(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            return "";
        });
    }
    getCooldown(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            return 0;
        });
    }
}
exports.ServerHandler = ServerHandler;
