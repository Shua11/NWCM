// TODO: Make votes only count once!
//  or allow you to switch your vote.

const channels = ['750830582921035858']

module.exports = (client) => {
    client.on('message', (message) => {
        const { content } = message

        // There was a problem where the bot was trying to react to it's own messages
        // This is the fix
        if (message.author.id === '749753458386665533') {
            return
        }

        const eachLine = content.split('\n')

        for (const line of eachLine) {
            if (line.includes('=')) {
                const split = line.split('=')
                const emoji = split[0].trim()
                message.react(emoji)
            }
        }
    })
}