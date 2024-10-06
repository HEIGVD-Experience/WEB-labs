import { cellPixelSize, shapeColors, style } from "./constants.js";
import { Game } from "./game.js";
import { Shape } from "./shape.js";
import { GameMap } from "./gameMap.js";

function cellToPixel(x) {
    return x * cellPixelSize;
}

export class Renderer {
    constructor(game, context) {
        this.game = game;
        this.context = context;
    }

    /**
     * Draws a shape to the renderer context
     *
     * @param {Shape} shape
     */
    drawShape(shape) {
        // Get the color of players shape based on his playerId
        this.context.fillStyle = shapeColors.at(shape.playerId % shapeColors.length);

        // For each shape block call drawBlock
        for (const [offsetX, offsetY] of shape.getCoordinates()) {
            const [blockX, blockY] = [offsetX + shape.col, offsetY + shape.row];
            this.drawBlock(blockX, blockY);
        }
    }

    /**
     * Draws a block to the render context
     *
     * @param {Number} x
     * @param {Number} y
     */
    drawBlock(x, y) {
        this.context.fillRect(
        cellToPixel(x),
        cellToPixel(y),
        cellPixelSize,
        cellPixelSize
        );
    }

    /**
     * Draws all grounded block based on the game map
     */
    drawGroundedBlocks() {
        for(let row = 0 ; row < this.game.map.width ; row++) {
            for(let col = 0 ; col < this.game.map.height; col++) {
                if(this.game.map.map[col][row] != -1) {
                    this.context.fillStyle = shapeColors.at(this.game.map.map[col][row] % shapeColors.length);
                    this.drawBlock(row, col);
                }
            }
        }
    }


    /**
     * Clears the context and draws all falling and dropped shapes.
     */
    render() {
        this.context.reset();
        this.game.forEachShape((shape) => this.drawShape(shape));
        this.drawGroundedBlocks();
    }
}
