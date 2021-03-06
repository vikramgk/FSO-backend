// imports

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// db connection

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.set('runValidators', true)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Too few characters'],
        required: true,
        unique: true
    },
    number: {
        type: String,
        minLength: [8, 'Too few numbers'],
        required: true
    },
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// export model
module.exports = mongoose.model('Person', personSchema)