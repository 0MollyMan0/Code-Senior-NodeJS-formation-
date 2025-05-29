const express = require('express')
const helper = require ('./helper')
let pokemons = require('./mock-pokemon')

const app = express()
const port = 3000


app.use((req, res, next) => {
    console.log(`URL : ${req.url}`);
    next()
})

app.get('/', (req,res) => res.send('Hello, Express!'))

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    const message = 'Tiens ton pokemon fdp'
    res.json(helper.success(message, pokemon))
});

app.get('/api/pokemons', (req, res) => {
    const message = 'Tiens tes pokemons fdp'
    res.json(helper.success(message, pokemons))
});

app.listen(port, () =>console.log(`Notre application Node est démarée sur : http://localhost:${port}`))


