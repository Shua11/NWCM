const mongo = require('./../../mongo')
const mongod = require('./../../mongo')
const commandPrefixSchema = require('./../../schemas/command-prefix-schema')
const { botSend, botReply } = require('../../utilities/bot-send')

module.exports = {
    commands: ['setprefix', 'prefixset'],
    description: 'Set desired prefix for commands with this bot.',
    expectedArgs: '<command prefix>',
    minArgs: '1',
    maxArgs: '1',
    permissions: ['ADMINISTRATOR'],
    permissionError: 'You need admin permissions to run this command',
    callback: async (message, args, text) => {
        await mongo().then(async mongoose => {
            try {
                const guildId = message.guild.id

                await commandPrefixSchema.findOneAndUpdate({
                    _id: guildId
                }, {
                    _id: guildId,
                    prefix: args[0]
                }, {
                    upsert: true
                })

                botSend(message.channel, `Prefix has been changed to ${args[0]}`)
            } finally {
                mongoose.connection.close()
            }
        })
    },
}