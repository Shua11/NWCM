const mongo = require('./../../mongo')
const languageSchema = require('./../../schemas/language-schema')
const { languages } = require('./../../translations/lang.json')
const { setLanguage } = require('../../translations/language')
const { botSend, botReply } = require('../../utilities/bot-send')

module.exports = {
    commands: ['setlang', 'setlanguage'],
    description: 'Change the language',
    expectedArgs: '<language>',
    minArgs: '1',
    maxArgs: '1',
    permissions: ['ADMINISTRATOR'],
    callback: async (message, args, text) => {
        const { guild } = message

        const targetLanguage = args[0].toLowerCase()
        if (!languages.includes(targetLanguage)) {
            botSend(message.channel, 'Specified language is not yet supported.')
            return
        }

        setLanguage(guild, targetLanguage)

        await mongo().then(async (mongoose) => {
            try {
                await languageSchema.findOneAndUpdate({
                    _id: guild.id
                }, {
                    _id: guild.id,
                    language: targetLanguage
                }, {
                    upsert: true
                })

                // Delete the bot's message
                botSend(message.channel, 'Language set')

            } finally {
                mongoose.connection.close()
            }
        })
    },
}