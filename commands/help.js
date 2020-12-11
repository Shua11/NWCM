// TODO: Make this look awsome with an embed!
const Discord = require('discord.js')
const { prefix } = require('../config.json')
const loadCommands = require('./../utilities/load-commands')

module.exports = {
    commands: ['help', 'helpme'],
    description: "Defines all available commands",
    expectedArgs: '',
    minArgs: '0',
    callback: (message, args, text) => {
        const { channel, guild } = message

        let embedValues = []
        let embedValuesOverflow = []

        // Get commands that the user has permissions to use
        const commands = loadCommands()
        // console.log(commands)

        // Sort the commands by the command name value
        // This makes it easier to find a command in the list
        commands.sort(function (a, b) {
            var x = a.commands
            var y = b.commands
            // console.log(x, y)
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0
        })

        // Loop through all the commands 
        for (const command of commands) {

            // Remove commands that cannnot be ran in this channel
            let requiredChannel = command.requiredChannels

            if (requiredChannel) {
                if (requiredChannel !== channel.name) {
                    continue
                }
            }

            // Remove commands the the user doesn't have permission for
            let permissions = command.permissions

            if (permissions) {
                let hasPermission = true
                if (typeof permissions === 'string') {
                    permissions = [permissions]
                }
                for (const permission of permissions) {
                    if (!message.member.hasPermission(permission)) {
                        hasPermission = false
                        break
                    }
                }
                if (!hasPermission) {
                    // console.log('continue')
                    continue
                }
            }

            // Format the commands, args, and descriptions for the embed
            const mainCommand = typeof command.commands === 'string' ? command.commands : command.commands[0]
            const mainArgs = command.expectedArgs ? ` ${command.expectedArgs}` : ''
            const { description } = command

            let line = `**${prefix}${mainCommand}${mainArgs}** = ${description}`

            // Hit max character size in the embed fields...
            // This is a quick fix. Should maybe think of a better one at some point
            if (embedValues.length < 10) {
                embedValues.push(line)
            } else {
                embedValuesOverflow.push(line)
            }

            if (embedValuesOverflow.length === 0) {
                embedValuesOverflow.push(`need more perms`)
            }
        }
        // Create the embed
        const embed = new Discord.MessageEmbed()
            .setTitle('Help Menu')
            .setDescription('Specific commands available for this channel and your current permissions level.')
            .setFooter('New World Company Manager', message.guild.iconURL())
            .setColor('#000')
            .addFields(
                {
                    name: 'Commands:',
                    value: embedValues
                },
                {
                    name: 'Commands continued:',
                    value: embedValuesOverflow
                })
        // Send the help embed to the user
        message.channel.send(embed).then((message) => {
            message.delete({
                timeout: 1000 * 60
            })
        })
    },
}