import { gameRows, gameCols } from './constants.js';
import { Shape } from "./shape.js";
import { GameMap } from './gameMap.js';
import { PlayerInfo } from './playerInfo.js';

export class Game extends Map {
    constructor(gameMap) {
        super();
        this.map = gameMap;
        this.isGameOver = false;
    }

    /*
     * Returns shape of given player, or undefined if no such player or shape.
     * @param {Number} id Id of the player whose shape is to be returned.
     */
    getShape(id) {
        return this.get(id).getShape();
    }

    /**
     * Executes the provided function on each shape in the game.
     * @param {Function} f The function to be executed. It takes a shape as unique parameters, and its return value is ignored.
     */
    forEachShape(f) {
        this.forEach((playerInfo) => f(playerInfo.getShape()));
    }

    /**
     * Tries to drop the given player's shape, i.e. move it down until it touches something if necessary, and then fixing it onto the map.
     * @param {Number} playerId The id of the player whose shape should be dropped
     */
    dropShape(playerId) {
        // Get the shape for the given playerId and drop it
        this.map.dropShape(this.getShape(playerId));
        
        this.forEachShape((otherShapes) => {
            if (!this.map.testShape(otherShapes)) {
                this.addNewShape(otherShapes.playerId);
            }
        });
    }

    /**
     * Advances the game by one step, i.e. moves all shapes down by one, drops any shape that was touching the ground, and replace it with a new one.
     */
    step() {

        if(this.isGameOver)
            return;

        /**
         * To fit the request that we need to first move all pieces that can and
         * after ground all pieces that can't move
         */
        const shapeToBePlaced = [];

        this.forEachShape((shape) => {
            // Check if the piece can still move
            if (this.map.testShape(shape, shape.row + 1)) {
                shape.row++;
            } else {
                shapeToBePlaced.push(shape);
            }
        });

        shapeToBePlaced.forEach((shape) => {
            const actualPlayerShape = this.get(shape.playerId).getShape();
            if(shapeToBePlaced.includes(actualPlayerShape)) {
                // If the piece can't move than drop it
                this.dropShape(shape.playerId);
            }
        });
    }

    /**
     * Replace current shape of given player id (if any) with a new random shape.
     * @param {Number} id Id of the player whose shape should be replaced.
     */
    addNewShape(id) {
        // Create a new shape
        const shape = new Shape(
            Shape.getRandomShapeType(), 
            id, 
            this.map.width / 2, 
            0, 
            0);

        this.get(id).setShape(shape);

        // If the piece cannot be placed the the game is over
        if (!this.map.testShape(shape)) {
            this.gameOver();
            return;
        }
    }

    /**
     * Resets the game upon game over.
     */
    gameOver() {
        this.isGameOver = true;
    }
}
