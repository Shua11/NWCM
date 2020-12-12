const mongo = require('../../mongo')
const craftingSchema = require('../../schemas/crafting-schema')

module.exports = {
    commands: ['smelting'],
    description: 'Sets channel designated for crafting and makes those related commands available in that channel',
    expectedArgs: '<level>',
    minArgs: '1',
    // maxArgs: 0,
    // permissions: ['ADMINISTRATOR'],
    // permissionError: 'You do not have permission to run this command.',
    // requiredRoles: '',
    requiredChannels: 'crafting',
    callback: async (message, args, text, client) => {


        const cache = {} // guildId: [channelId, text]

        const { member, channel, guild } = message


        cache[guild.id] = [member.id, text]

        await mongo().then(async (mongoose) => {
            try {
                await craftingSchema.findOneAndUpdate({
                    _id: guild.id,
                }, {
                    _id: guild.id,
                    memberId: member.id,
                    professionLevel: text,
                }, {
                    upsert: true,
                })
            } finally {
                mongoose.connection.close()
            }
        })
    }
}