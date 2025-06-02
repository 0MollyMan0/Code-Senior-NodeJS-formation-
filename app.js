const express = require('express')
const morgan = require("morgan")
const favicon = require("serve-favicon")
const helper = require ('./helper')
const bodyParser = require('body-parser')
const { Sequelize } = require('sequelize')
let pokemons = require('./mock-pokemon')

const app = express()
const port = 3000

const sequelize = new Sequelize(
    'pokedex',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2'
        },
        logging: false
    })
    


app
 .use(morgan('dev'))
 .use(bodyParser.json())

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

app.post('/api/pokemons', (req, res) => {
    const id = helper.getUniqueId(pokemons);
    const pokemonCreated = { ...req.body, ...{id: id, created: new Date()}}
    const message = `Le pokemon ${pokemonCreated.name} a bien été crée.`
    res.json(helper.success(message, pokemonCreated))
})

app.put('/api/pokemons/:id', (req, res) => {
    let id = parseInt(req.params.id)
    let pokemonUpdated = { ...req.body, id: id}
    pokemons = pokemons.map( pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    })
    const message = `Le pokemon ${pokemonUpdated} a bien été modifié.`
    res.json(helper.success(message, pokemonUpdated))
})

app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemons => pokemons.id === id)
    pokemons.filter(pokemon => pokemon.id !== id)
    const message = `Le pokemon ${pokemonDeleted.name} a bien été supprimé.`
    res.json(helper.success(message, pokemonDeleted))
})

app.listen(port, () =>console.log(`Notre application Node est démarée sur : http://localhost:${port}`))


