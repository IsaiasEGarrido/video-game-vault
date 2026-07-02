const express = require('express');
const app = express();
const fs = require('fs').promises;

//  Filtering games by platform and status
app.get('/api/games', (req, res) => {

      // Grab 'platform' and 'status' from the URL query string
    const {platform, status} = req.query;

    // Read the vault.json file and parse it into a JavaScript object
    fs.readFile('vault.json', 'utf8').then(rawData => {

        const games = JSON.parse(rawData);
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
    })
    //catch any errors that occur while reading the file
    .catch(err => {
        console.error('Error reading vault.json:', err);
        res.status(500).json({ error: 'Internal Server Error reading vault.json' });
    });
});

// Endpoint to get game stats
app.get('/api/games/stats', (req, res) => {

    fs.readFile('vault.json', 'utf8').then(rawData => {
        const games = JSON.parse(rawData);
        
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
    })
    .catch(err => {
        console.error('Error reading vault.json:', err);
        res.status(500).json({ error: 'Internal Server Error reading vault.json' });
    });
});

// Dynamic wildcard routes (like /:id) MUST go last
app.get('/api/games/:id', (req, res) => {
    const gameId = parseInt(req.params.id, 10);
    if (isNaN(gameId)) {
        return res.status(400).json({ error: 'Invalid game ID' });
    }
    fs.readFile('vault.json', 'utf8').then(rawData => {
        const games = JSON.parse(rawData);
        const foundGame = games.find(game => game.id === gameId);
        if (!foundGame) {
            return res.status(404).json({ error: 'Game not found' });
        }
        res.json(foundGame);
    })
    .catch(err => {
        console.error('Error reading vault.json:', err);
        res.status(500).json({ error: 'Internal Server Error reading vault.json' });
    });
});

app.listen(3000, () => {console.log('Server is running on port 3000')});