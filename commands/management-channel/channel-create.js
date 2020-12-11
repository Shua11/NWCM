module.exports = {
    commands: ['createchannel', 'channelcreate'],
    description: 'Creates a channel with a specified name',
    expectedArgs: '<channel name>',
    minArgs: '1',
    permissions: ['ADMINISTRATOR'],
    permissionError: 'You need admin permissions to run this command',
    requiredRoles: [],
    callback: (message, args, text) => {

    },
}