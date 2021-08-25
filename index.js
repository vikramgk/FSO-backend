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

app.get('/api/persons', (req, res, error) => {
    Person.find({})
        .then(persons => res.json(persons))
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const reqData = req.body
    console.log("coming in:", reqData)

    // handle empty request body
    if (reqData === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    // create new person object, id is added automatically by mongo
    const person = new Person({
        name: reqData.name,
        number: reqData.number
    })

    // save the person to the db and send back the new person
    person.save()
        .then(savedPerson => res.json(savedPerson))
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => res.json(person))
        .catch(error => next(error))
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

app.put('/api/persons/:id', (req, res, next) => {
    console.log("put", req.body)
    Person.findOneAndUpdate(
        { "name": req.body.name }, // filter
        { "number": req.body.number }, // update
        { new: true })
        .then(result => {
            delete result.__v
            console.log("recv", result.__v)
            res.json(result)
        })
})


// middleware handling

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformmated id' })
    }

    // pass on to default error handler if not a cast error
    next(error)
}

app.use(errorHandler)


// helper functions

const getRandomInt = max => Math.floor(Math.random() * max)


// listener

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})