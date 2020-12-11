// TODO: Prefix changing is BUGGY... look into it

const { prefix: globalPrefix } = require('../config.json')
const mongo = require('./../mongo')
const { botSend, botReply } = require('./bot-send')
const commandPrefixSchema = require('./../schemas/command-prefix-schema')
const guildPrefix = {}


// Array of all permissions listed in the Discord API
const validatePermissions = (permissions) => {
    const validPermissions = [
        'ADMINISTRATOR',            // Allows all permissions and bypasses channel permission overwrites
        'CREATE_INSTANT_INVITE',    // Allows creation of instant invites
        'KICK_MEMBERS',             // Allows kicking members
        'BAN_MEMBERS',              // Allows banning members
        'MANAGE_CHANNELS',          // Allows management and editing of channels
        'MANAGE_GUILD',             // Allows management and editing of the guild
        'ADD_REACTIONS',            // Allows for the addition of reactions to messages
        'VIEW_AUDIT_LOG',           // Allows for viewing of audit logs
        'PRIORITY_SPEAKER',         // Allows for using priority speaker in a voice channel
        'STREAM',                   // Allows the user to go live
        'VIEW_CHANNEL',             // Allows guild members to view a channel, which includes reading messages in text channels
        'SEND_MESSAGES',            // Allows for sending messages in a channel
        'SEND_TTS_MESSAGES',        // Allows for sending of /tts messages
        'MANAGE_MESSAGES',          // Allows for deletion of other users messages
        'EMBED_LINKS',              // Links sent by users with this permission will be auto-embedded
        'ATTACH_FILES',             // Allows for uploading images and files
        'READ_MESSAGE_HISTORY',     // Allows for reading of message history
        'MENTION_EVERYONE',         // Allows for using the @everyone tag to notify all users in a channel, and the @here tag to notify all online users in a channel
        'USE_EXTERNAL_EMOJIS',      // Allows the usage of custom emojis from other servers
        'VIEW_GUILD_INSIGHTS',      // Allows for viewing guild insights
        'CONNECT',                  // Allows for joining of a voice channel
        'SPEAK',                    // Allows for speaking in a voice channel
        'MUTE_MEMBERS',             // Allows for muting members in a voice channel
        'DEAFEN_MEMBERS',           // Allows for deafening of members in a voice channel
        'MOVE_MEMBERS',             // Allows for moving of members between voice channels
        'USE_VAD',                  // Allows for using voice-activity-detection in a voice channel
        'CHANGE_NICKNAME',          // Allows for modification of own nickname
        'MANAGE_NICKNAMES',         // Allows for modification of other users nicknames
        'MANAGE_ROLES',             // Allows management and editing of roles
        'MANAGE_WEBHOOKS',          // Allows management and editing of webhooks
        'MANAGE_EMOJIS',            // Allows management and editing of emojis
    ]

    // Make sure the selected permission is listed as real
    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
            throw new Error(`Unkown permission node "${permission}"`)
        }
    }
}

module.exports = (client, commandOptions) => {
    // Default command constructor
    let {
        commands,
        description = '',
        expectedArgs = '',
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        permissionError = 'You do not have permission to run this command.',
        requiredRoles = [],
        requiredChannels = '',
        callback
    } = commandOptions

    // Format command and aliases into an array
    if (typeof commands === 'string') {
        commands = [commands]
    }

    console.log(`Registering command "${commands[0]}"`)

    // Format permissions into an array and valididate
    if (permissions.length) {
        if (typeof permissions === 'string') {
            permissions = [permissions]
        }
        validatePermissions(permissions)
    }

    // Listen for messages
    client.on('message', message => {
        const { channel, content, guild, member } = message

        const prefix = guildPrefix[guild.id] || globalPrefix

        // Look through all commands
        for (const alias of commands) {
            // Find first matching command
            if (content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {

                // Delete the user's message after seconds
                // TODO: Throws and error when useing the clear channel command
                try {
                    message.delete({
                        timeout: 1000 * 11
                    })
                } catch {
                    console.log('User messgae no longer exists')
                }

                // Make sure the command is run in the correct channel
                if (requiredChannels !== channel.name && requiredChannels !== '') {
                    // Search through all the channels in the server and find one that matches 
                    const foundChannel = guild.channels.cache.find((channel) => {
                        return channel.name === requiredChannels
                    })
                    botSend(message.chanel, `This command must be used in <#${foundChannel.id}>`)
                    // message.channel.send()
                    return
                }

                // Make sure user has required permissions
                for (const permission of permissions) {
                    if (!member.hasPermission(permission)) {
                        botReply(message, permissionError)
                        // message.reply(permissionError)
                        return
                    }
                }

                // Make sure user has the required roles
                for (const requiredRole of requiredRoles) {
                    const role = guild.roles.cache.find(role => role.name === requiredRoles)
                    if (!role || !member.roles.cache.has(role.id)) {
                        botReply(message, `You need the "${requiredRole}" role to use this command.`)
                        // message.reply(`You need the "${requiredRole}" role to use this command.`)
                        return
                    }
                }

                // Format command using regex
                const args = content.split(/[ ]+/)
                // Delete the invoked command from the user input
                args.shift()
                // Check number of args
                if (args.length < minArgs || (maxArgs !== null && args.length > maxArgs)) {
                    // If incorrect display error with correct syntax
                    botReply(message, `Incorrect syntax. \nPlease use: ${prefix}${alias} ${expectedArgs}`)
                    // message.reply(`Incorrect syntax. \nPlease use: ${prefix}${alias} ${expectedArgs}`)
                    return
                }

                // Execute the command
                callback(message, args, args.join(' '), client)

                return
            }
        }
    })
}

// Check the database for server specific prefixes and update to it.
// Otherwise servers won't be able to run commands.
module.exports.loadPrefixes = async (client) => {
    await mongo().then(async mongoose => {
        try {
            for (const guild of client.guilds.cache) {
                const result = await commandPrefixSchema.findOne({ _id: guild[1].id })
                guildPrefix[guild[1].id] = result.prefix
            }
        } finally {
            mongoose.connection.close()
        }
    })
}