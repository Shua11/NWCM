const { botSend, botReply } = require('../../utilities/bot-send')

module.exports = {
    commands: ['rolegive', 'giverole'],
    description: 'Gives a role to a person',
    expectedArgs: '<@person> <role>',
    minArgs: 2,
    maxArgs: null,
    permissions: ['ADMINISTRATOR'],
    permissionError: 'You do not have permission to run this command.',
    requiredRoles: '',
    requiredChannels: '',
    callback: (message, args) => {

        // Make sure the user actually did @person
        const targetUser = message.mentions.users.first()
        if (!targetUser) {
            botSend(message.channel, 'Please specify someone to give a role to.')
            return
        }


        args.shift()
        const roleName = args.join(' ')
        const { guild } = message

        // Find is role exists
        const role = guild.roles.cache.find((role) => {
            return role.name === roleName
        })

        if (!role) {
            botSend(message.channel, `Specified role "${roleName}" does not exists.`)
            return
        }

        // user object doesn't have the method to add roles, so need to get member object
        const member = guild.members.cache.get(targetUser.id)
        member.roles.add(role)

        botSend(message.channel, `${targetUser} now has the "${roleName}" role.`)
    }
}