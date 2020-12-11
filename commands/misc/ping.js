module.exports = {
    commands: 'ping',
    description: 'Latency. Time it takes to send data to the bot',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments, text, client) => {
        message.channel.send('Calculating ping...').then(resultMessage => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp

            resultMessage.edit(`Bot Latency: ${ping}ms, Discord API Latency: ${client.ws.ping}ms`)
                .then((message) => {
                    message.delete({
                        timeout: 1000 * 10
                    })
                })
                .catch((e) => {
                    console.log('Bot Message Delete Failed')
                })
        })
    },
}