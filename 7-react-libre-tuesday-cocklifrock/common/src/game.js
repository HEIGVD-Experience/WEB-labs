import { Shape } from "./shape.js"
import { GameOverMessage, Message, RemovePlayerMessage, SetPlayerMessage, UpdateMapMessage } from "./messages.js";
import { scorePerLine } from "./constants.js";

/**
 * A game of Tetris that can be drawn by a renderer.
 */
export class DrawableGame extends Map {
    constructor(gameMap) {
        super()
        this.map = gameMap
    }

    /**
     * Returns shape of given player, or undefined if no such player or shape.
     * @param {Number} id Id of the player whose shape is to be returned.
     */
    getShape(id) {
        return this.get(id)?.getShape()
    }

    /**
     * Executes the provided function on each shape in the game.
     * @param {Function} f The function to be executed. It takes a shape as unique parameters, and its return value is ignored.
     */
    forEachShape(f) {
        this.forEach((p) => f(p.getShape()))
    }

    /**
     * Computes and returns the total scores of every player in the game.
     *
     * The total score of a player is {@link scorePerLine} times the number of lines they have cleared, minus the number of blocks belonging to them that are still on the map.
     */
    getTotalScores() {
        // TODO
        const finalScoreMap = new Map();
        const actualPlayerMap = this.map.getBlocksPerPlayer();

        this.forEach((player, id) => {
            finalScoreMap.set(id, player.getClearedLines() * scorePerLine);
        });

        actualPlayerMap.forEach((blocks, id) => {
            finalScoreMap.set(id, (finalScoreMap.get(id) ?? 0) - blocks);
        });

        return finalScoreMap;
    }
}

/**
 * A game of Tetris that lives on the server and handles the game logic.
 */
export class Game extends DrawableGame {
    /**
     *
     * @param {GameMap} gameMap The map on which the game is played.
     * @param {Function} messageSender A function that will broadcast any message passed to it to all connected players.
     * @param {Function} onGameOver A function that will be called when the game is over.
     */
    constructor(gameMap, messageSender, onGameOver) {
        super(gameMap)
        this.onGameOver = onGameOver
        this.sendMessage = messageSender
    }

    /**
     * Moves the given shape to the given column, if possible.
     * @param {Number} id The id of the player whose shape should be moved.
     * @param {Number} col The column to which the shape should be moved.
     */
    moveShape(id, col) {
        const player = this.get(id)
        const shape = player?.getShape()
        if (shape === undefined) {
            console.log("Shape " + id + " does not exist ; cannot move it")
            return
        }
        if (this.map.testShape(shape, shape.row, col)) {
            shape.col = col
            this.sendMessage(new SetPlayerMessage(player));
        }
    }

    /**
     * Rotates the given shape in the given direction, if possible.
     * @param {Number} id The id of the player whose shape should be rotated.
     * @param {String} rotation The direction of the rotation, either "left" or "right"
     */
    rotateShape(id, rotation) {
        const player = this.get(id)
        const shape = player?.getShape()
        if (shape === undefined) {
            console.log("Shape " + id + " does not exist ; cannot rotate it")
            return
        }

        rotation = (shape.rotation + ((rotation === "left") ? 3 : 1)) % 4

        if (this.map.testShape(shape, shape.row, shape.col, rotation)) {
            shape.rotation = rotation
            this.sendMessage(new SetPlayerMessage(player));
        }
    }

    /**
     * Tries to drop the given player's shape, i.e. move it down until it touches something if necessary, and then fixing it onto the map.
     * @param {Number} playerId The id of the player whose shape should be dropped
     */
    dropShape(playerId) {
        const player = this.get(playerId)
        if (player === undefined) {
            console.log("Cannot find player " + playerId + "; ignoring")
            return
        }

        const shape = player.shape
        if (shape === undefined) {
            console.log("Shape " + playerId + " does not exist; cannot drop it; ignoring")
            return
        }

        this.map.dropShape(shape)

        player.clearedLines += this.map.clearFullRows();

        // Replace this shape and any overlapping falling
        this.addNewShape(player.id)

        this.forEach((p, id) => {
            const shape = p.shape
            if (shape !== undefined && id !== player.id) {
                if (!this.map.testShape(shape)) {
                    this.addNewShape(id)
                }
            }
        })

        this.sendMessage(new UpdateMapMessage(this.map));
    }

    /**
     * Advances the game by one step, i.e. moves all shapes down by one, drops any shape that was touching the ground, and replace it with a new one.
     */
    step() {
        const toDrop = []

        // Move all shapes
        for (const player of this.values()) {
            const shape = player.shape
            if (shape === undefined) {
                continue
            }
            const row = shape.row
            if (row === undefined) {
                console.log("Invalid coordinates for shape. Ignoring it.")
                return
            }
            // If they can move down, move them down
            if (this.map.testShape(shape, row + 1)) {
                shape.row++
            } else {
                // If they cannot move down, ground them
                toDrop.push(shape)
                continue
            }
        }

        toDrop.forEach((shape) => {
            const id = shape.playerId
            if (this.map.testShape(shape)) {
                this.dropShape(id)
            } else {
                console.log("Shape was not droppable, doing nothing because assuming that a previous `dropShape` has reset it.")
            }
        })

        this.forEach((player) => {
            this.sendMessage(new SetPlayerMessage(player));
        })
    }

    /**
     * Informs the game that a new player has joined, and gives them a new shape.
     *
     * @param {PlayerInfo} player The player that has joined. If it has a shape, it will be overwritten by a new random one.
     */
    introduceNewPlayer(player) {
        // TODO ensure that that player does not already exist, then add it to the game and give it a new shape.
        if (!!this.get(player.id)) {
            return;
        }

        this.set(player.id, player);
        this.addNewShape(player.id);
    };

    /**
     * Replace current shape of given player id (if any) with a new random shape.
     * @param {Number} id Id of the player whose shape should be replaced.
     */
    addNewShape(id) {
        const col = parseInt(this.map.width / 2)
        const shapeType = Shape.getRandomShapeType()
        const shape = new Shape(shapeType, id, col, 0, 0)
        const player = this.get(id)
        if (player !== undefined) {
            player.shape = shape
        } else {
            throw new Error("Cannot find player with id " + id)
        }

        if (!this.map.testShape(shape)) {
            this.gameOver()
        }

        this.sendMessage(new SetPlayerMessage(player));
    }

    /**
     * Resets the game upon game over.
     */
    gameOver() {
        // Send a new message for each player that it is removed.
        this.sendMessage(new GameOverMessage());

        this.forEach((player) => {
            this.sendMessage(new RemovePlayerMessage(player.getId()));
            this.delete(player.getId())
        })

        this.map.clear();
        this.sendMessage(new UpdateMapMessage(this.map));

        this.onGameOver();
    }

    /**
     * Handles an incoming message.
     * @param {Number} playerId The id of the player that sent this message.
     * @param {Message} message The message to be handled.
     */
    onMessage(playerId, message) {
        switch (message.constructor.name) {
        case "RotateMessage":
            this.rotateShape(playerId, message.getDirection())
            break
        case "MoveMessage":
            this.moveShape(playerId, message.getCol())
            break
        case "DropMessage":
            this.dropShape(playerId)
            break
        default:
            throw new Error("Unknown message type: " + message.constructor.name)
        }
    }

    /**
     * Informs the game that a player has left. The game will then remove the player from the game.
     *
     * @param {number} playerId The id of the player that has left.
     */
    quit(playerId) {
        // TODO
        this.delete(playerId);
        this.sendMessage(new RemovePlayerMessage(playerId));
    }
}

/**
 * A game of Tetris that lives on the client and is only responsible for remaining in sync with the server's instance of the game.
  */
export class Replica extends DrawableGame {
    /**
     * Handles incoming messages from the server.
     * @param {Message} message The message to be handled.
     */
    onMessage(message) {
        switch (message.constructor.name) {
            case "SetPlayerMessage":
                this.set(message.getPlayerId(), message.getPlayer());
                break;
            case "GameOverMessage":
                this.gameOver();
                break;
            case "RemovePlayerMessage":
                this.delete(message.getPlayerId());
                break;
            case "UpdateMapMessage":
                this.map = message.getMap();
                break;
            default:
                throw new Error(
                    "Unknown message type: " + message.constructor.name
                );
        }
    }

    /**
     * Displays a popup informing the player that the game is over, and the id of the winning player, along with their score.
     */
    gameOver() {
        const scores = this.getTotalScores();
        this.clear();

        if (scores.size === 0) {
            alert("Il n'y a aucun gagnant!")
        }

        let winner;

        for (const current of scores.entries()) {
            if (!winner || winner[1] < current[1]) {
                winner = current;
            }
        }

        // We clear the map
        this.map = new GameMap(this.map.width, this.map.height);

        alert(`Le joueur ${winner[0]} a gagné avec un score de ${winner[1]}`);
    }
}
