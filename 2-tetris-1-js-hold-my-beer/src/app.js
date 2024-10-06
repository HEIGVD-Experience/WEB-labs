import { Renderer } from "./renderer.js";
import { Game } from "./game.js";
import { PlayerInfo } from "./playerInfo.js";
import { GameMap } from "./gameMap.js";
import { gameCols, gameRows, stepIntervalMs } from "./constants.js";
import { Shape } from "./shape.js";

let nextIdPlayer = 0;

const gameMap = new GameMap(gameCols, gameRows);
const game = new Game(gameMap);
const renderer = new Renderer(game, canvas.getContext("2d"));

let shape = new Shape(Shape.getRandomShapeType(), ++nextIdPlayer, gameCols / 2, 0, 0);
const player1 = new PlayerInfo(nextIdPlayer, shape)

game.set(player1.getId(), player1);

function runGame() {
    game.step();
}

setInterval(runGame, stepIntervalMs);

function render() {
    renderer.render();
    requestAnimationFrame(render);
}

render();
