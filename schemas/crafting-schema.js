const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const craftingSchema = mongoose.Schema({
    _id: reqString,
    memberId: reqString,
    professionLevel: reqString
})

module.exports = mongoose.model('crafting', craftingSchema)