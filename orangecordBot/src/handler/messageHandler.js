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
const logger_1 = require("../../../handler/logger");
const embeds_1 = require("./embeds");
function handleMessage(client, message, Logger) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        var hasPrefix = false;
        var prefix = '';
        for (const _prefix of client.getPrefixes()) {
            if (message.content.toLowerCase().startsWith(_prefix)) {
                hasPrefix = true;
                prefix = message.content.slice(0, _prefix.length);
            }
        }
        if (message.author.bot)
            return;
        if (!message.guild)
            return;
        if (!hasPrefix)
            return;
        const args = message.content.slice(prefix.length).trim().replace(prefix, '').split(/ +/g);
        const args1 = message.content.slice(prefix.length).trimStart().replace(prefix, '').replace(args[0], '').trimStart();
        const cmd = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        try {
            var command = client.commands.get(cmd);
        }
        catch (_b) {
            return message.reply("Invalid command!");
        }
        if (!command) {
            command = client.commands.get(client.aliases.get(cmd));
        }
        if (command) {
            if (client.arguments.development) {
                if (!client.testers.includes(message.author.id) && command.name != "deployment")
                    return;
            }
            else {
                for (var category of client.categories.get("categories")) {
                    if (category.name == command.category && category.mod) {
                        if (!(yield client.isMod(message)))
                            return;
                    }
                }
            }
            if (command.devOnly) {
                if (!client.testers.includes(message.author.id))
                    return;
            }
            if (!command.development) {
                if (client.arguments.development)
                    return;
            }
            else {
                if (!client.arguments.development)
                    return;
            }
            try {
                const run = yield command.run(client, message, args, args1);
                if (run instanceof Error) {
                    Logger.log(logger_1.LogLevel.ERROR, run);
                    return yield (0, embeds_1.reply)(message, yield (0, embeds_1.createErrorEmbed)(`There was an error running the command: ${command.name}`, message.author));
                }
            }
            catch (e) {
                let error = e;
                Logger.log(logger_1.LogLevel.ERROR, error);
                return yield (0, embeds_1.reply)(message, yield (0, embeds_1.createErrorEmbed)(`There was an error running the command: ${command.name}`, message.author));
            }
            Logger.log(logger_1.LogLevel.VERBOSE, `${message.author.username}#${message.author.discriminator} (${message.author.id}) successfully ran the command: ${command.name}`);
        }
        else
            return;
    });
}
exports.default = handleMessage;
