const language = require('../../translations/language')
const { botSend, botReply } = require('../../utilities/bot-send')

module.exports = {
    commands: ['add', 'addition'],
    description: 'Adds two numbers together',
    expectedArgs: '<num> <num>',
    minArgs: '2',
    maxArgs: '2',
    permissions: [],
    permissionError: '',
    requiredRoles: [],
    requiredChannels: 'testing',
    callback: (message, args, text) => {
        const { guild } = message

        const num1 = +args[0]
        const num2 = +args[1]

        let reply = `${language(guild, 'THE_SUM_IS')} ${num1 + num2}`

        // botReply(message, reply)
        botSend(message.channel, reply)
    },
}