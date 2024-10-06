import { Shape } from "./shape.js"
import { GameMap } from "./gameMap.js"
import { PlayerInfo } from "./playerInfo.js"

/**
 * Parent class for all messages used to communicate between server and client.
 */
export class Message {
    constructor(data) {
        this.data = data
    }
}

/**
 * Message describing a request by the client to rotate their shape
 */
export class RotateMessage extends Message {
    /**
     * @param {String} direction The direction of rotation : either "left" or "right".
     */
    constructor(direction) {
        super(direction)
    }

    getDirection() {
        return this.data
    }
}

/**
 * Message describing a request by the client to move their shape.
 */
export class MoveMessage extends Message {
    /**
     * @param {Number} col The column the shape should be moved to.
     */
    constructor(col) {
        super(col)
    }

    getCol() {
        return this.data
    }
}

/**
 * Message describing a request by the client to drop their shape.
 */
export class DropMessage extends Message {
    constructor() {
        super()
    }
}

/**
 * Message describing a notification by the server of a player's new state.
 */
export class SetPlayerMessage extends Message {
    /**
     * @param {PlayerInfo} player The PlayerInfo describing the player's new state.
     */
    constructor(player) {
        super(player);
    }

    /**
     * @returns {Shape} An instance of Shape describing the player's shape.
     */
    getShape() {
        return new Shape(this.data.shape.shapeType, this.data.shape.playerId, this.data.shape.col, this.data.shape.row, this.data.shape.rotation);
    }

    getPlayerId() {
        return this.data.id;
    }

    getClearedLines() {
        return this.data.clearedLines;
    }

    /**
     * @returns {PlayerInfo} An instance of PlayerInfo describing the player's new state, including all fields of the class in the correct type.
     */
    getPlayer() {
        return new PlayerInfo(this.getPlayerId(), this.getShape(), this.getClearedLines());
    }
}

/**
 * Message describing a notification by the server of a player's removal.
 */
export class RemovePlayerMessage extends Message {
    /**
     * @param {Number} playerId The id of the player to be removed.
     */
    constructor(playerId) {
        // TODO
        super(playerId);
    }

    getPlayerId() {
        // TODO
        return this.data;
    }
}

/**
 * Message describing a notification by the server of a new game map state.
 */
export class UpdateMapMessage extends Message {
    /**
     * @param {GameMap} map The new game map state.
     */
    constructor(map) {
        super(map);
    }

    getMap() {
        const map = new GameMap(this.data.width, this.data.height);
        map.map = this.data.map;
        return map;
    }
}

/**
 * Message describing a notification by the server that the game is over.
 */
export class GameOverMessage extends Message {
    constructor() {
        // TODO
        super();
    }
}

/**
 * Message describing a notification by the server that a new player has joined.
  */
export class JoinMessage extends Message {
    /**
     * @param {Number} playerId The id of the new player.
     */
    constructor(playerId) {
        super(playerId);
    }

    getPlayerId() {
        return this.data;
    }
}

/**
 * Codec for encoding and decoding messages.
 */
export class MessageCodec {
    static types = { MoveMessage, RotateMessage, DropMessage, SetPlayerMessage, RemovePlayerMessage, UpdateMapMessage, JoinMessage, GameOverMessage }

    /**
     * Encodes a message into a string in JSON format.
     */
    static encode(message) {
        const type = message.constructor.name;
        return JSON.stringify({ type, data: message.data });
    }

    /**
     * Decodes a message from a string in JSON format into an instance of the corresponding message class.
     * @param {String} string The string to be decoded.
     * @returns {Message} An instance of the corresponding message class.
     */
    static decode(string) {
        // TODO decode the string into an object, ensuring that this object is an instance of the correct message class
        const obj = JSON.parse(string);
        const type = MessageCodec.types[obj.type];
        return new type(obj.data);
    }
}
