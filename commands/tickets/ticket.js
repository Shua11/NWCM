const { botSend } = require('./../../utilities/bot-send')
const categoryId = '785675967305220146' // Ticket category
const channelId = '786360499645317161' // open-tickets channel
let registered = false

// TODO: 
// Create a new channel for each ticket dynamically.
// Create a closed ticket log. 
// Create ability to re-open tickets?
// Create ticket category if there isn't one.

module.exports = {
    commands: ['ticket', 'support'],
    description: 'Create a ticket to resolve an issue directly with admins/moderators',
    expectedArgs: '<short description>',
    minArgs: '1',
    callback: (message, args, text, client) => {
        const { guild, member } = message

        const name = text

        const everyoneRole = guild.roles.cache.find((role) => {
            return role.name === '@everyone'
        })

        const adminRole = guild.roles.cache.find((role) => {
            return role.name === 'Admin'
        })

        const modRole = guild.roles.cache.find((role) => {
            return role.name === 'Moderator'
        })

        guild.channels.create(name, {
            type: 'text',
            parent: categoryId,
            permissionOverwrites: [
                {
                    id: everyoneRole.id,
                    deny: ['VIEW_CHANNEL']
                },
                {
                    id: member.id,
                    allow: ['VIEW_CHANNEL']
                },
                {
                    id: adminRole.id,
                    allow: ['VIEW_CHANNEL']
                },
                {
                    id: modRole.id,
                    allow: ['VIEW_CHANNEL']
                }
            ]

        }).then(test => {

            const newName = args.join('-')

            let newChannel = guild.channels.cache.find(channel => channel.name === newName);

            registerEvent(client)

            // const channel = newChannel
            newChannel.send(`A ticket has been submitted by: <@${member.id}>
            "${text}"\n
            Click ${'✅'} when this issue is resolved.`)
                .then((ticketMessage) => {
                    ticketMessage.react('✅')

                    const reply = `Your ticket has been submitted.`
                    botSend(message.channel, reply)
                })
        })
    },
}

// Register an onClick event for the checkmark reaction
const registerEvent = client => {
    if (registered) {
        return
    }
    registered = true
    client.on('messageReactionAdd', (reaction, user) => {
        // The bot will select the reaction. We don't want that to trigger the event
        if (user.bot) {
            return
        }

        console.log('Reaction clicked')

        // Delete the ticket when someone clicks the checkmark.
        reaction.message.channel.delete()
    })
}