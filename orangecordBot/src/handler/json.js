const {
    readFileSync,
    writeFileSync
} = require('fs')

// Read a given JSON file
module.exports.read = function (file) {
    return JSON.parse(readFileSync(file))
}

// Write a given JSON file
module.exports.write = function (file, data) {
    writeFileSync(file, JSON.stringify(data, null, 4))
}