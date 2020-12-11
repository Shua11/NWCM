module.exports.botSend = (channel, text) => {
    // For debugging
    // console.log(`channel: ${channel}, text: ${text}.`)

    // How long until the message is deleted
    const seconds = 10

    // Let the user know the message will go away
    text += `\n\nThis conversation will self destruct in ${seconds} seconds`

    // Send the actual message from the bot with a delete timer
    channel.send(text)
        .then((message) => {
            message.delete({
                timeout: 1000 * seconds
            })
        })
}

module.exports.botReply = (message, text) => {
    // For debugging
    // console.log(`channel: ${channel}, text: ${text}.`)

    // How long until the message is deleted
    const seconds = 10

    let user = message.member.id
    // Let the user know the message will go away
    text += `\n\nThis conversation will self destruct in ${seconds} seconds`

    let finalMessage = `<@${user}>, `
    finalMessage += text

    // Send the actual message from the bot with a delete timer
    message.channel.send(finalMessage)
        .then((message) => {
            message.delete({
                timeout: 1000 * seconds
            })
        })
}