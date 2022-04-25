"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateAsString = exports.LogLevel = void 0;
const fs_1 = require("fs");
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
function getMessageAsString(message) {
    return `[${getDateAsString()}] ->  ${message}`;
}
class Logger {
    constructor(logFolder) {
        this.logFolder = logFolder;
        this.logFileName = `${getDateAsString(true)}.log`;
        console.log(`Logging to ${this.logFilePath()}`);
        fs_1.writeFileSync(this.logFilePath(), '', {
            encoding: 'utf8'
        });
        this.writeFile('------------------------------------------------------');
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
        const logMessage = getMessageAsString((message instanceof Error ? message.message : message));
        if (logMessage.includes('\n')) {
            const logMessages = logMessage.split('\n');
            msg = "------------------------------------------------------\n";
            for (let i = 0; i < logMessages.length; i++) {
                msg += `${getDateAsString()} -> ${logLevel} ${logMessage}\n`;
            }
            msg += "------------------------------------------------------\n";
        }
        else {
            msg = `${getDateAsString()} -> ${logLevel} ${logMessage}\n`;
        }
        console.log(msg);
        this.writeFile(msg);
    }
}
exports.default = Logger;
