const language = require('../../translations/language')
const { botSend, botReply } = require('../../utilities/bot-send')

module.exports = {
    commands: ['nickname', 'nick'],
    description: 'Changes a persons nickname',
    expectedArgs: '<@person> <nickname>',
    minArgs: '2',
    // maxArgs: '2',
    permissions: ['MANAGE_NICKNAMES', 'CHANGE_NICKNAME'],
    permissionError: ' You need Manage and Change nikname permissions to run this command',
    // requiredRoles: [],
    // requiredChannels: '',
    callback: (message, args, text) => {
        // Make sure the user actually did @person
        const targetUser = message.mentions.users.first()

        // console.log(targetUser)

        if (!targetUser) {
            message.channel.send('Please specify someone to give a role to.')
            return
        }

        args.shift()
        const nickname = args.join(' ')

        const member = message.guild.members.cache.get(targetUser.id)
        member.setNickname(nickname)

        botSend(message.channel, `${targetUser.username} now has the nickname "${nickname}".`)
    },
}