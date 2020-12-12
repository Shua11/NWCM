const Discord = require('discord.js')
const mongo = require('./../mongo')
const craftingSchema = require('./../schemas/crafting-schema')
const addReactions = (message, reactions) => {
    message.react(reactions[0])
    reactions.shift()
    if (reactions.length > 0) {
        setTimeout(() => addReactions(message, reactions), 750)
    }
}

module.exports = async (client, id, text, message) => {
    const { member } = message
    const channel = await client.channels.fetch(id)
    // console.log(channel)

    text = `Welcome to the Crafting channel. 
    Use this channel to post your professions and their levels.
    `


    const cache = {} // guildId: [channelId, text]

    const { guild } = member

    let data = cache[guild.id]

    if (!data) {
        console.log('FETCHING FROM DATABASE')

        await mongo().then(async (mongoose) => {
            try {
                const result = await craftingSchema.findOne({ _id: guild.id })

                cache[guild.id] = data = [result.memberId, result.professionLevel]
            } finally {
                mongoose.connection.close()
            }
        })
    }


    console.log(`From Mongo: crafting: data: ${data}`)
    const user = client.users.cache.find(user => user.id === data[0])
    console.log(user.username);


    let embedNames = []
    let embedLevels = []

    embedNames.push(`${user.username}:`)
    embedLevels.push(`${data[1]}`)

    const embedFields = [
        {
            name: 'Smelters:',
            value: embedNames,
            inline: true
        },
        {
            name: 'Level:',
            value: embedLevels,
            inline: true
        }]

    // Create the embed
    const embed = new Discord.MessageEmbed()
        .setTitle('Crafting Menu')
        .setDescription('Crafters and their levels.')
        // .setFooter('New World Company Manager')
        .setColor('BLUE')
        .addFields(embedFields)
    // Send the help embed to the user
    // channel.send(embed)




    channel.messages.fetch().then((messages) => {

        // for (const message in messages) {
        //   console.count(message[1])
        // }




        if (messages.size === 0) {
            // Send a new message
            channel.send(text, embed).then((message) => {
                // addReactions(message, reactions)
            })
        } else {
            // Edit the existing message
            for (const message of messages) {
                message[1].edit(text, embed)
                // addReactions(message[1], reactions)
            }
        }
    })
}
