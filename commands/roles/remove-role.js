module.exports = {
    commands: ['roleremove', 'removerole'],
    description: 'Removes a role from a person',
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
            message.channel.send('Please specify someone to give a role to.')
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
            message.channel.send(`Specified role "${roleName}" does not exists.`)
            return
        }

        // user object doesn't have the method to add roles, so need to get member object
        const member = guild.members.cache.get(targetUser.id)

        if (member.roles.cache.get(role.id)) {
            member.roles.remove(role)
            message.channel.send(`${targetUser} no longer has the "${roleName}" role.`)
        } else {
            message.channel.send(`That user doesn't have the "${roleName}" role.`)
        }
    }
}