import { Renderer } from "./renderer.js"
import { Replica } from "./game.js"
import { GameMap } from "./gameMap.js"
import { gameCols, gameRows, port } from "./constants.js"
import { setListeners } from "./inputListener.js";
import { JoinMessage, MessageCodec } from "./messages.js";

const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")

const gameMap = new GameMap(gameCols, gameRows)
const replica = new Replica(gameMap)
const renderer = new Renderer(replica, context)

// Render loop
function loop() {
    renderer.render()
    requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

// TODO Get hostname from current URL, and use it to open a Web socket to the corresponding `ws://` URL.
const socket = new WebSocket('ws://localhost:3000/');

// TODO Once the socket is open, set the input listener to send messages to the server.
socket.addEventListener('open', () => {
    setListeners(canvas, (message) => {
        socket.send(MessageCodec.encode(message));
    });
});

// TODO Handle messages received on that socket from the server. If the message is a `JoinMessage`, set the player id of the renderer. Otherwise, pass the message to the replica.
socket.addEventListener('message', (event) => {
    const message = MessageCodec.decode(event.data);
    
    if (message instanceof JoinMessage) {
        renderer.setPlayerId(message.getPlayerId());
    } else {
        replica.onMessage(message);
        renderer.updateScores();
    }
});