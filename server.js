const express = require('express');
const app = express();
const games = require('./games');

app.get('/api/games', (req, res) => {res.json(games)});

app.get('/api/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id);
    const foundGame = games.find(game => game.id === gameId);
    res.json(foundGame);
} );

app.listen(3000, () => {console.log('Server is running on port 3000')});