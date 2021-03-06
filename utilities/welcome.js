const mongo = require('./../mongo')
// const command = require('./command')
const welcomeSchema = require('./../schemas/welcome-schema')

module.exports = (client) => {
    //!setwelcome <message>
    const cache = {} // guildId: [channelId, text]

    // const channelId = '749672482176237658' // welcome channel
    // const targetChannelId = '749676663498866688' // read this channel

    // client.on('guildMemberAdd', (member) => {
    //     const message = `Welcome <@${member.id} to the server. Please read 
    //     ${member.guild.channels.cache.get(targetChannelId).toString()}`

    //     const channel = member.guild.channel.cache.get(channelId)
    //     channel.send(message)
    // })

    const onJoin = async (member) => {
        const { guild } = member

        let data = cache[guild.id]

        if (!data) {
            console.log('FETCHING FROM DATABASE')

            await mongo().then(async (mongoose) => {
                try {
                    const result = await welcomeSchema.findOne({ _id: guild.id })

                    cache[guild.id] = data = [result.channelId, result.text]
                } finally {
                    mongoose.connection.close()
                }
            })
        }

        const channelId = data[0]
        const text = data[1]

        const channel = guild.channels.cache.get(channelId)
        channel.send(text.replace(/<@>/g, `<@${member.id}>`))
    }

    client.on('guildMemberAdd', (member) => {
        onJoin(member)
    })
}