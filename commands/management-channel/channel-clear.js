// TODO: Enable protection in certain channels (i.e closed tickets) so they can't be deleted.

// This is mostly for my own sanity so that I can clear a channel that is cluttered with tests
module.exports = {
    commands: ['clearchannel', 'channelclear', 'cc'],
    description: 'Clears a channel of all messages',
    expectedArgs: '',
    minArgs: '0',
    permissions: ['ADMINISTRATOR'],
    permissionError: 'You need admin permissions to run this command',
    requiredRoles: [],
    callback: (message, args, text) => {
        message.channel.messages.fetch().then((results) => {
            message.channel.bulkDelete(results)
        })
    },
}