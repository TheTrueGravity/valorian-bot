"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class Logger {
    constructor(logFile, errorFile) {
        this.logFile = logFile;
        this.errorFile = errorFile;
        if (!fs_1.existsSync(logFile)) {
            fs_1.writeFileSync(logFile, '', {
                encoding: 'utf8'
            });
        }
        if (!fs_1.existsSync(errorFile)) {
            fs_1.writeFileSync(errorFile, '', {
                encoding: 'utf8'
            });
        }
        this.verbose('Logger initialized');
    }
    writeFile(file, message) {
        var fileData = fs_1.readFileSync(file, {
            encoding: 'utf8'
        });
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let date_string = date + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
        fileData += `${date_string} ${message}\n`;
        fs_1.writeFileSync(file, fileData, {
            encoding: 'utf8'
        });
    }
    log(message) {
        const msg = '[LOG] ' + message;
        console.log(msg);
        this.writeFile(this.logFile, msg);
    }
    error(message) {
        const msg = '[ERROR] ' + message;
        console.error(msg);
        this.writeFile(this.errorFile, msg);
    }
    warn(message) {
        const msg = '[WARN] ' + message;
        console.log(msg);
        this.writeFile(this.logFile, msg);
    }
    info(message) {
        const msg = '[INFO] ' + message;
        console.log(msg);
        this.writeFile(this.logFile, msg);
    }
    debug(message) {
        const msg = '[DEBUG] ' + message;
        console.log(msg);
        this.writeFile(this.logFile, msg);
    }
    verbose(message) {
        const msg = '[VERBOSE] ' + message;
        console.log(msg);
        this.writeFile(this.logFile, msg);
    }
}
exports.default = Logger;
