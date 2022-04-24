"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateAsString = void 0;
const fs_1 = require("fs");
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
class Logger {
    constructor(logFolder) {
        this.logFolder = logFolder;
        this.logFileName = `${getDateAsString(true)}.log`;
        console.log(`Logging to ${this.logFilePath()}`);
        fs_1.writeFileSync(this.logFilePath(), '', {
            encoding: 'utf8'
        });
        this.writeFile('------------------------------------------------------');
        this.info('Logger initialized');
    }
    logFilePath() {
        return this.logFolder + '/' + this.logFileName;
    }
    writeFile(message) {
        const file = `${this.logFolder}/${this.logFileName}`;
        var fileData = fs_1.readFileSync(file, {
            encoding: 'utf8'
        });
        fileData +=
            fs_1.writeFileSync(file, fileData, {
                encoding: 'utf8'
            });
    }
    error(message) {
        const msg = getDateAsString() + " -> " + '[ERROR] ' + message;
        console.error(msg);
        this.writeFile(msg);
    }
    warn(message) {
        const msg = getDateAsString() + " -> " + '[WARN] ' + message;
        console.log(msg);
        this.writeFile(msg);
    }
    info(message) {
        const msg = getDateAsString() + "-> " + '[INFO] ' + message;
        console.log(msg);
        this.writeFile(msg);
    }
    debug(message) {
        const msg = getDateAsString() + " -> " + '[DEBUG] ' + message;
        console.log(msg);
        this.writeFile(msg);
    }
    verbose(message) {
        const msg = getDateAsString() + " -> " + '[VERBOSE] ' + message;
        console.log(msg);
        this.writeFile(msg);
    }
}
exports.default = Logger;
