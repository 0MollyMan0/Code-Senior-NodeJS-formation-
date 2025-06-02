const express = require('express')
const morgan = require("morgan")
const favicon = require("serve-favicon")
const helper = require ('./helper')
const bodyParser = require('body-parser')
const { Sequelize, DataTypes } = require('sequelize')
let pokemons = require('./mock-pokemon')
const PokemonModel = require('./src/models/pokemons')


const app = express()
const port = 3000

const sequelize = new Sequelize(
    'pokedex', // Nom de la base
    'root', // Nom de l'admin
    '', // MDP
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2'
        },
        logging: false
    })
    
sequelize.authenticate()
 .then(_ => console.log('La connexion à la base de données a bien été établie.'))
 .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))

const Pokemon = PokemonModel(sequelize, DataTypes) // Instanciation de la table Pokemons en utilisant le modèle Pokemon

sequelize.sync({force: true}) // Synchronise tout les modèles de l'API REST avec la BDD
 .then(_ => {
    console.log('La base de données "Pokedex" a bien été synchronisée.') 

    pokemons.map(pokemon => {
        Pokemon.create({
            name: pokemon.name,
            hp: pokemon.hp,
            cp: pokemon.cp,
            picture: pokemon.picture,
            types: pokemon.types.join()
           }).then(bulbizarre => console.log(bulbizarre.toJSON()));
    }) 
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


