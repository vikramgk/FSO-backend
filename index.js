const { response } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

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

app.get('/', (req, res) => {
    res.send(`<h1>how're ya doin' there bud</h1>`)
})

app.get('/info', (req, res) => {
    const currentDate = new Date()
    console.log(currentDate)
    response_html = `<p>Phonebook has info for ${persons.length} people</p>
                    <p>${currentDate}</p>`
    res.send(response_html)
})

app.get('/api/persons', (req, res) => {
    console.log('sup')
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    const reqData = req.body
    const person = {
        "id": getRandomInt(MAX_ID),
        "name": reqData.name,
        "number": reqData.number
    }
    
    persons.push(person)
    res.json(person)
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
    console.log('del', persons)
    res.sendStatus(404).end
})

// helper functions

const getRandomInt = max => Math.floor(Math.random() * max)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})