import express from 'express'
import expressWs from 'express-ws'

import { gameCols, gameRows, port, stepIntervalMs } from '../common/index.js';
import { Game } from '../common/index.js';
import { GameOverMessage, JoinMessage, MessageCodec } from '../common/index.js';
import { GameMap } from '../common/index.js';
import { PlayerInfo } from '../common/index.js';

const app = express()
expressWs(app)

// TODO Create a new Game instance and start a game loop
function messageSender(message) {
    connected.forEach((socket) => {
        socket.send(MessageCodec.encode(message));
    });
}

const gameMap = new GameMap(gameCols, gameRows);
const game = new Game(gameMap, messageSender, () => {
    nextPlayerId = 1;

    connected.forEach(socket => {
        const playerId = nextPlayerId++;
        game.introduceNewPlayer(new PlayerInfo(playerId));

        // re-create the player.
        socket.send(MessageCodec.encode(new JoinMessage(playerId)));
    })
});
let nextPlayerId = 1;

setInterval(() => {
    game.step();
}, stepIntervalMs);

const connected = [];

// Serve the public directory
app.use(express.static('public'))

// Serve the src directory
app.use('/src', express.static('src'))

// Websocket game events
app.ws('/', (socket) => {
    try {
        // TODO handle new websocket connections.
        connected.push(socket);
        const playerId = nextPlayerId++;

        game.introduceNewPlayer(new PlayerInfo(playerId));

        // TODO The first message the client receives should be a JoinMessage, containing its player id. The server then sends all current state to that client. Received messages from the client should be forwarded to the game instance.
        socket.send(MessageCodec.encode(new JoinMessage(playerId)));

        socket.on("message", (data) => {
            const message = MessageCodec.decode(data);
            game.onMessage(playerId, message);
        });

        // TODO Ensure the game is notified of a player quitting when the socket is closed.
        socket.on("close", () => {
            game.quit(playerId);
        });
    } catch (e) {
        console.error(e);
    }
});

app.listen(port)

console.log("App started.")