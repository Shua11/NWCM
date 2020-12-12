const mongo = require('../../mongo')
const craftingSchema = require('../../schemas/crafting-schema')
const craftingInfo = require('../../utilities/crafting-info')

module.exports = {
    commands: ['initcrafting', 'craftinginit'],
    description: 'Sets channel designated for crafting and makes those related commands available in that channel',
    // expectedArgs: '<@person> <role>',
    // minArgs: '',
    maxArgs: 0,
    permissions: ['ADMINISTRATOR'],
    permissionError: 'You do not have permission to run this command.',
    // requiredRoles: '',
    // requiredChannels: '',
    callback: (message, args, text, client) => {

        text = `Welcome to the Crafting channel. 
        Use this channel to post your professions and their levels.
        Typing !help in this channel will tell you all the commands available here.`

        craftingInfo(client, '749755276130910310', text, message)
    }
}