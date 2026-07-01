const express = require('express');
const app = express();
const games = require('./games');
//  Filtering games by platform and status
app.get('/api/games', (req, res) => {
      // Grab 'platform' and 'status' from the URL query string
    const {platform, status} = req.query;
    let filteredGames = games;

    // If the user provided a platform, filter the list
    if (platform)
        filteredGames = filteredGames.filter(
            game => game.platform && game.platform.toLowerCase() === platform.toLowerCase()
        );
    
    // If the user provided a status, filter the list
    if (status)
        filteredGames = filteredGames.filter(
            game => game.status && game.status.toLowerCase() === status.toLowerCase()
        );
    
    // Return the filtered list of games as JSON
    res.json(filteredGames);
});

// Endpoint to get game stats
app.get('/api/games/stats', (req, res) => {

    const totalGames = games.length;

    // Count the number of completed games
    const completedCount = games.filter(game => game.status === "Completed").length;


    // Calculate the total hours played across all games
    let totalHours = 0;
    games.forEach(game => {
        totalHours += game.hoursPlayed;
    });

    // Count the number of games currently being played
    let playingGames = 0;
    games.forEach(game => {
        if (game.status === "Playing") {
            playingGames++;
        }
    });

    // Count the number of games in the backlog
    let backlogGames = 0;
    games.forEach(game => {
        if (game.status === "Backlog") {
            backlogGames++;
        }
    });

    res.json({
        totalGames: totalGames,
        completedCount: completedCount,
        totalHours: totalHours,
        playingGames: playingGames,
        backlogGames: backlogGames,
        averageHours: totalGames > 0 ? (totalHours / totalGames).toFixed(1) : 0
    });
});

// Dynamic wildcard routes (like /:id) MUST go last
app.get('/api/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id, 10);
    const foundGame = games.find(game => game.id === gameId);
    res.json(foundGame);
});

app.listen(3000, () => {console.log('Server is running on port 3000')});