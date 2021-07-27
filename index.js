// imports

const { response } = require('express')
const express = require('express')
var morgan = require('morgan')

const app = express()

// middleware

app.use(express.json())

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



// constants

const MAX_ID = 10000
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    },
    {
        "id": 5,
        "name": "hey",
        "number": "39-23-6423122"
    }
]

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
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    const reqData = req.body
    const personAlreadyExists = persons.find(person => person.name === reqData.name)

    if (!reqData.name || !reqData.number) {
        errorBody = { error: 'name and number must be not null' }
        res.json(errorBody)
    } else if (personAlreadyExists) {
        errorBody = { error: 'name must be unique' }
        res.json(errorBody)
    } else {
        const person = {
            "id": getRandomInt(MAX_ID),
            "name": reqData.name,
            "number": reqData.number
        }

        persons.push(person)
        res.json(person)
    }

})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (!person) {
        res.sendStatus(404).end
    } else {
        res.json(person)
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.sendStatus(404).end
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// helper functions

const getRandomInt = max => Math.floor(Math.random() * max)

// listener

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})