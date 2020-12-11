const mongo = require('../mongo')
const oldWarInvasionSchema = require('../schemas/war-invasion-schema')

module.exports = (client) => {
    const checkForExpired = async () => {
        const now = new Date()

        // console.log(now)

        const condition = {
            expires: {
                $lt: now,
            },
        }

        const result = await oldWarInvasionSchema.findOne(condition)

        // console.log(`got result: ${result}`)
        // console.log(`got result id: ${result.channelId}`)

        if (result) {
            // console.log(`got result: ${result}`)
            let { guildId, channelTextId, channelVoiceId } = result

            const guild = client.guilds.cache.get(guildId)

            if (guild) {
                const channel1 = guild.channels.cache.get(channelTextId)
                const channel2 = guild.channels.cache.get(channelVoiceId)
                // console.log(`channel to delete: ${channel1}`)
                // console.log(`channel to delete: ${channel2}`)
                if (channel1) {
                    // console.log('got to the delete')
                    channel1.delete()
                }
                if (channel2) {
                    // console.log('got to the delete')
                    channel2.delete()
                }
            }

            await oldWarInvasionSchema.deleteMany(condition)
        }

        setTimeout(checkForExpired, 1000 * 10 * 60)
    }

    checkForExpired()
}
