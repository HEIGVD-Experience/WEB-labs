import { gameRows } from "./constants.js";
import { Shape } from "./shape.js";

export class GameMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        /** 2D array storing for each position the id of the player whose block is there, or -1 otherwise. */
        this.map = [];
        this.resetMap();
    }

    /**
     * Drops the given shape, i.e. moves it down until it touches something, and then grounds it.
     * @param {Shape} shape The shape to be dropped.
     */
    dropShape(shape) {
        // While the shape can move down by one then add +1 to row value
        while(this.testShape(shape, shape.row+1)) {
            shape.row++;
        }
        this.groundShape(shape);
    }

    /**
     * Grounds the given shape, i.e. transfers it to the map table.
     * @param {Shape} shape The shape to be grounded.
     */
    groundShape(shape) {
        for (const [offsetX, offsetY] of shape.getCoordinates()) {
            this.map[shape.row + offsetY][shape.col + offsetX] = shape.playerId;
        }

        this.clearFullRows();
    }

    /**
     * Tests whether the given shape is overlapping a block or is out of bounds on the left, right, or bottom of the map.
     * This method allows the test to be done with row, col and/or rotation that are different from those of the shape itself.
     * 
     * Note that we do not consider a shape to be out of bounds if it is (even partly) above the top of the map.
     * 
     * @param {Shape} shape The shape to be tested
     * @param {Number} row Optional row at which the shape should be tested. If omitted, uses that of the shape.
     * @param {Number} col Optional col at which the shape should be tested. If omitted, uses that of the shape.
     * @param {Number} rotation Optional rotation with which the shape should be tested. If omitted, uses that of the shape.
     * @returns true if and only if the shape does not overlap anything and is not out of bounds.
     */
    testShape(shape, row = shape.row, col = shape.col, rotation = shape.rotation) {
        
        // Check all blocks position of the shape
        for (const [offX, offY] of shape.getCoordinates(rotation)) {
            const [x, y] = [col + offX, row + offY];

            // Check if the position of the block is authorized in the game
            if (x < 0 ||
                x > this.width - 1 || y > this.height - 1 ||
                this.map[y][x] != -1) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks wether the row is full or not
     * @param {Number} row The row to check
     */
    isRowFull(row) {
        for (let col = 0; col < this.width; col++) {
            if (this.map[row][col] == -1) {
                return false;
            }
        }
        return true;
    }

    /**
     * Clears any row that is fully complete.
     */
    clearFullRows() {
        for (let row = this.height - 1; row > 0; row--) {
            if (this.isRowFull(row)) {
                this.clearRow(row);
                row++;
            }
        }
    }

    /**
     * Clears the given row, and moves any row above it down by one.
     * @param {Number} row The row to be cleared.
     */
    clearRow(row) {
        for(let i = row ; i > 0 ; i--) {
            this.map[i] = this.map[i-1];
        }
        this.map[0] = new Array(this.width).fill(-1);
    }

    /**
     * Returns the id of the player whose block is grounded at the given position, or -1 otherwise.
     * @param {Number} row the requested row
     * @param {Number} col the requested column
     * @returns the id of the player whose block is grounded at the given position, or -1 otherwise
     */
    getPlayerAt(row, col) {
        return this.map[row][col];
    }

    /**
     * Put all values to -1 to all values in the map
     */
    resetMap() {
        this.map = Array.from({ length: this.height }, () =>
            Array.from({ length: this.width }, () => -1)
        );
    }
}
