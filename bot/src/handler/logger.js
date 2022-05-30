"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateAsString = exports.LogLevel = void 0;
const fs_1 = require("fs");
const os_1 = require("os");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
    LogLevel[LogLevel["VERBOSE"] = 4] = "VERBOSE";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
function getDateAsString(forFileName = false) {
    const date_ob = new Date();
    var date = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var hours = date_ob.getHours();
    var minutes = date_ob.getMinutes();
    var seconds = date_ob.getSeconds();
    if (forFileName) {
        return `${date}-${month}-${year}_${hours}-${minutes}-${seconds}`;
    }
    else {
        return `${date}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }
}
exports.getDateAsString = getDateAsString;
function getMessageAsString(level, message) {
    return `[${getDateAsString()}] ${level} | ${message}\n`;
}
class Logger {
    constructor(config) {
        this.logFolder = config.logFolder ? config.logFolder : os_1.tmpdir();
        this.logFileName = (config === null || config === void 0 ? void 0 : config.logFileName) ? config.logFileName : `${getDateAsString(true)}.log`;
        this.logToFile = ((config === null || config === void 0 ? void 0 : config.logToFile) != null) ? config.logToFile : true;
        if (this.logToFile) {
            console.log(`Logging to ${this.logFilePath()}`);
            fs_1.writeFileSync(this.logFilePath(), '', {
                encoding: 'utf8'
            });
            this.writeFile('------------------------------------------------------');
        }
    }
    logFilePath() {
        return this.logFolder + '/' + this.logFileName;
    }
    getLogLevel(level) {
        switch (level) {
            case LogLevel.ERROR:
                return '[ERROR]';
            case LogLevel.WARN:
                return '[WARN]';
            case LogLevel.INFO:
                return '[INFO]';
            case LogLevel.DEBUG:
                return '[DEBUG]';
            case LogLevel.VERBOSE:
                return '[VERBOSE]';
            default:
                return '[UNKNOWN]';
        }
    }
    writeFile(message) {
        const file = `${this.logFolder}/${this.logFileName}`;
        var fileData = fs_1.readFileSync(file, {
            encoding: 'utf8'
        });
        fileData += message + "\n";
        fs_1.writeFileSync(file, fileData, {
            encoding: 'utf8'
        });
    }
    log(level, message) {
        let msg;
        const logLevel = this.getLogLevel(level);
        const logMessage = (message instanceof Error ? `${message.name}: ${message.message}` : message);
        if (logMessage.includes('\n')) {
            const logMessages = logMessage.split(/\n/);
            msg = "------------------------------------------------------\n";
            msg += getMessageAsString(logLevel, "\n");
            for (let i = 0; i < logMessages.length; i++) {
                msg += logMessages[i] + "\n";
            }
            msg += "------------------------------------------------------\n";
        }
        else {
            msg = getMessageAsString(logLevel, logMessage);
        }
        console.log(msg);
        if (this.logToFile)
            this.writeFile(msg);
    }
}
exports.default = Logger;
