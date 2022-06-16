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
const ITask_1 = require("../interfaces/ITask");
const json = __importStar(require("../modules/json"));
const Task = {
    enabled: true,
    name: 'guildCreate',
    taskType: ITask_1.TaskTypes.onClientEvent,
    description: 'Gets called when a guild is created',
    development: false,
    init: (client) => __awaiter(void 0, void 0, void 0, function* () {
        const servers = yield json.read(process.env.BOT_CONFIG_DIR + '/servers.json');
        const guilds = yield client.guilds.fetch();
        for (const guild of guilds.values()) {
            if (servers[guild.id]) {
                if (servers[guild.id].name != guild.name) {
                    servers[guild.id].name = guild.name;
                }
                continue;
            }
            servers[guild.id] = {
                name: guild.name,
                prefix: process.env.DEFAULT_PREFIX,
                cooldown: 0,
                cooldownTime: process.env.DEFAULT_COOLDOWN_TIME,
                user_bumps: {},
                roles: {}
            };
        }
        yield json.write(process.env.BOT_CONFIG_DIR + '/servers.json', servers);
    }),
    run: (client, guild) => __awaiter(void 0, void 0, void 0, function* () {
        const servers = yield json.read(process.env.BOT_CONFIG_DIR + '/servers.json');
        if (servers[guild.id])
            return;
        servers[guild.id] = {
            name: guild.name,
            prefix: process.env.DEFAULT_PREFIX,
            cooldown: 0,
            user_bumps: {},
            roles: {}
        };
        yield json.write(process.env.BOT_CONFIG_DIR + '/servers.json', servers);
    })
};
exports.default = Task;
