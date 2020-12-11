const mongoose = require('mongoose')

const commandPrefixSchema = mongoose.Schema({
    // Guild Id
    _id: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true
    }
})

// Model takes name for the table and a schema
module.exports = mongoose.model('guild-prefixes', commandPrefixSchema)
