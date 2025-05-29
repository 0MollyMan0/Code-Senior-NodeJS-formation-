const express = require('express')
let pokemons = require('./mock-pokemon')

const app = express()
const port = 3000

app.get('/', (req,res) => res.send('Hello, Express!'))

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    res.json(pokemon)
});

app.get('/api/pokemons', (req, res) => {
    const nbPokemons = pokemons.length
    res.json(`Il y a ${nbPokemons} pokemons dans le pokedex pour le moment.`)
});

app.listen(port, () =>console.log(`Notre application Node est démarée sur : http://localhost:${port}`))


