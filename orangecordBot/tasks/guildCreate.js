"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task = {
    name: 'guildCreate',
    description: 'Gets called when a guild is created',
    development: false,
    run: (client, ...args) => {
        console.log('Guild created');
    }
};
exports.default = Task;
