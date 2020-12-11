const { Client, DataResolver } = require("discord.js");

module.exports = (client) => {
    const isInvite = async (guild, code) => {
        return await new Promise((resolve) => {
            guild.fetchInvites().then((invites) => {
                for (const invite of invites) {
                    if (code === invite[0]) {
                        resolve(true)
                        return
                    }
                }
                resolve(false)
            })
        })
    }



    client.on('message', async (message) => {
        const { content, member } = message

        // If a message contains discord.gg/balhblah then it's 
        // probably an advertisment to some other server. 
        // We want to delete those posts. 

        const code = content.split('discord.gg/')[1]
        if (content.includes('discord.gg/')) {
            const isOurInvite = await isInvite(guild, '')
            if (!isOurInvite) {
                // Trigger code to respond to other server advertiser.
                // member.kick()
            }
        }
    })
}