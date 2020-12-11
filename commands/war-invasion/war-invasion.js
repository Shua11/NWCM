const mongo = require('../../mongo')

const { botSend } = require('./../../utilities/bot-send')
const oldWarInvasionSchema = require('../../schemas/war-invasion-schema')

const groupChannel = '750073075265175602' // Groups category

module.exports = {
    commands: ['startwar', 'startinvasion', 'warstart', 'invasionstart'],
    description: 'Start a war (same as invasion) with a start time',
    expectedArgs: '<time>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ['ADMINISTRATOR'],
    permissionError: 'You do not have permission to run this command.',
    // requiredRoles: '',
    // requiredChannels: '',
    callback: async (message, args) => {

        const { guild } = message
        const guildId = guild.id

        const newTextChannel = await guild.channels.create('war-invasion', {
            type: 'text',
            parent: groupChannel,
            position: 1,
        })
        const newVoiceChannel = await guild.channels.create('war-invasion', {
            type: 'voice',
            parent: groupChannel,
            position: 1,
            userLimit: 50,
        })



        const expires = new Date()
        // console.log(expires)

        const time = +args

        expires.setMinutes(expires.getMinutes() + time)

        botSend(message.channel, `Creating Text and Voice channels for the war. They will last ${time}mins.`)
        newTextChannel.send("Welcome to the war/invasion.\n\nWe will need everyone's help!\nPlease post if you can make it!\nThank you")

        await mongo().then(async (mongoose) => {
            try {
                await oldWarInvasionSchema.findOneAndUpdate({
                    guildId: guild.id,
                }, {
                    guildId: guild.id,
                    channelTextId: newTextChannel.id,
                    channelVoiceId: newVoiceChannel.id,
                    expires: expires,
                }, {
                    upsert: true,
                })
            } finally {
                mongoose.connection.close()
            }
        })
    }
}