module.exports = {
    commands: ['deletechannel', 'channeldelete'],
    description: 'Deletes the text channel that the command is written in',
    expectedArgs: '',
    minArgs: '0',
    permissions: ['ADMINISTRATOR'],
    permissionError: 'You need admin permissions to run this command',
    requiredRoles: [],
    callback: (message, args, text) => {
        message.channel.delete()
    },
}