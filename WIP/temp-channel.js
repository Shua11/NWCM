

module.exports = {
    commands: ['tempchannel'],
    description: 'Create a temporary channel',
    expectedArgs: '<@person> <nickname>',
    minArgs: '2',
    // maxArgs: '2',
    permissions: ['ADMINISTRATOR'],
    // permissionError: '',
    // requiredRoles: [],
    // requiredChannels: '',
    callback: (message, args, text) => {
        const { guild, member } = message

    },
}