const path = require('path')
const fs = require('fs')
const commandBase = require('./../utilities/command-handler')


module.exports = (client) => {
    const baseFile = 'command-handler.js'

    const commands = []

    // Recursivly traverse the directory to find all commands
    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        // Is the file a directory? if so call again
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else {
                const option = require(path.join(__dirname, dir, file))
                commands.push(option)
                if (client) {
                    commandBase(client, option)
                }
            }
        }
    }

    readCommands('./../commands')

    return commands
}