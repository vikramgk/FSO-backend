// imports
require('dotenv').config()
const Person = require('./models/person')
const { response } = require('express')
const express = require('express')
const cors = require('cors')
var morgan = require('morgan')

const app = express()


// middleware

// app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())


// constants

const MAX_ID = 10000


// routes

app.get('/', (req, res) => {
    res.send(`<h1>how're ya doin' there bud</h1>`)
})

app.get('/info', (req, res) => {
    const currentDate = new Date()
    response_html = `<p>Phonebook has info for ${persons.length} people</p>
                    <p>${currentDate}</p>`
    res.send(response_html)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => res.json(persons))
})

app.post('/api/persons', (req, res) => {
    const reqData = req.body
    console.log("coming in:", reqData)

    if (reqData === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: reqData.name,
        number: reqData.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
        mongoose.connection.close()
    })

    // const personAlreadyExists = persons.find(person => person.name === reqData.name)

    // if (!reqData.name || !reqData.number) {
    //     errorBody = { error: 'name and number must be not null' }
    //     res.json(errorBody)
    // } else if (personAlreadyExists) {
    //     errorBody = { error: 'name must be unique' }
    //     res.json(errorBody)
    // } else {
    //     const person = {
    //         "id": getRandomInt(MAX_ID),
    //         "name": reqData.name,
    //         "number": reqData.number
    //     }

    //     persons.push(person)
    //     res.json(person)
    // }

})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(person => res.json(person))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            next(error)
        })

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// helper functions

const getRandomInt = max => Math.floor(Math.random() * max)

// listener

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})