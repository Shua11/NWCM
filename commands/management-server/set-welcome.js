const mongo = require('../../mongo')
const welcomeSchema = require('../../schemas/welcome-schema')


module.exports = {
    commands: ['setwelcome', 'welcome'],
    description: 'Set a welcome message for new members. <@> will tag them. #channelname will make a link to a channel.',
    expectedArgs: '<message>',
    minArgs: 1,
    // maxArgs: null,
    permissions: ['ADMINISTRATOR'],
    permissionError: 'You do not have permission to run this command.',
    // requiredRoles: '',
    // requiredChannels: '',
    callback: async (message, args, text) => {

        const cache = {} // guildId: [channelId, text]

        const { channel, content, guild } = message

        // let text = content

        // const split = text.split(' ')

        // if (split.length < 2) {
        //     channel.send('Please provide a welcome message')
        //     return
        // }

        // split.shift()
        // text = split.join(' ')

        cache[guild.id] = [channel.id, text]

        await mongo().then(async (mongoose) => {
            try {
                await welcomeSchema.findOneAndUpdate({
                    _id: guild.id,
                }, {
                    _id: guild.id,
                    channelId: channel.id,
                    text,
                }, {
                    upsert: true,
                })
            } finally {
                mongoose.connection.close()
            }
        })
    }
}