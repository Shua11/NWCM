require('events').EventEmitter.defaultMaxListeners = 20;

const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const { loadLanguages } = require('./translations/language')


const loadCommands = require('./utilities/load-commands')
const commandHandler = require('./utilities/command-handler')
const channelScaling = require('./utilities/channel-scaling')
const polls = require('./utilities/advanced-polls');
const welcome = require('./utilities/welcome');
const oldWarInvasionDelete = require('./utilities/war-invasion-delete')


client.on('ready', async () => {
    console.log('NWCM is online!')

    // Set bot Discord status
    const { prefix } = config
    client.user.setPresence({
        activity: { name: `"${prefix}help" for help` }
    })

    welcome(client)

    commandHandler.loadPrefixes(client)
    loadLanguages(client)

    loadCommands(client)

    channelScaling(client)

    polls(client)

    oldWarInvasionDelete(client)

})

// Log into Discord with the secret Bot token
client.login(config.token)