import { gameCols } from "./constants.js";
import { DropMessage, RotateMessage, MoveMessage } from "./messages.js";
/**
 * Sets up all event listeners for user interactions:
 * - A click on the canvas or a key press on the down arrow will send a `DropMessage`.
 * - A movement of the mouse on the canvas will send a `MoveMessage` with the corresponding column.
 * - A key press on the left or right arrow will send a left or right `RotateMessage`.
 * @param canvas The canvas on which the game is drawn
 * @param messageListener The callback function handling the messages to be sent. It expects a `Message` as unique argument.
 */
export function setListeners(canvas, messageListener) {

  canvas.addEventListener("mousemove", mouseHandleMove(canvas, messageListener));

  document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      return messageListener(new RotateMessage("left"));
    case "ArrowRight":
      return messageListener(new RotateMessage("right"));
    case "ArrowDown":
      return messageListener(new DropMessage());
    case "a":
      break;
    case "d":
      break;
    }
  });

  canvas.addEventListener("click", (event) => {
    return messageListener(new DropMessage());
  });
}

export function mouseHandleMove(canvas, messageListener) {
  let oldcol = undefined;
  return (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let col = Math.floor(x / (rect.width / gameCols));

    if(oldcol === col) {
      return;
    }
    
    oldcol = col;
    return messageListener(new MoveMessage(col));
  };
}
