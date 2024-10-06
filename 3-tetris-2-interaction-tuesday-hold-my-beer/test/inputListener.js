import { assert, expect } from "chai";
import { mouseHandleMove } from "../src/inputListener.js";

describe("Input listener", () => {
  it("Moving mouse to same position should not send message twice", () => {

    let called = 0;

    const messageListener = (message) => {
      called++;
    };

    const testCanvas = {
      getBoundingClientRect: () => {
        return { left: 0, top:0, bottom:600, right:300, width: 500};
      },
    };

    const mouseHandler = mouseHandleMove(testCanvas, messageListener);

    mouseHandler({ clientX: 10, clientY: 10 });

    mouseHandler({ clientX: 10, clientY: 10 });

    expect(called).to.be.equal(1);

  });
});
