const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const oldWarInvasionSchema = mongoose.Schema({
    guildId: reqString,
    channelTextId: reqString,
    channelVoiceId: reqString,
    expires: Date,
})

module.exports = mongoose.model('temp-channels', oldWarInvasionSchema)