import { assertClass, makeBoundedLinear } from "phil-lib/misc";
import "./style.css";

import { getById } from "phil-lib/client-misc";

const zoomInSvg = getById("zoomIn", SVGSVGElement);
const mouseListenerElement = getById("mouseListener", SVGRectElement);
const mousePointerElement = getById("mousePointer", SVGGeometryElement);
const currentlyCenteredPointerElement = getById(
  "currentlyCenteredPointer",
  SVGGeometryElement
);
const currentlyCenteredTranslateGroup = getById(
  "currentlyCenteredTranslate",
  SVGGElement
);
const currentlyCenteredZoomGroup = getById(
  "currentlyCenteredZoom",
  SVGGElement
);
const zoomedInParabolaPath = getById("zoomedInParabola", SVGPathElement);

function showMousePointer() {
  mousePointerElement.style.display = "";
}

function hideMousePointer() {
  mousePointerElement.style.display = "none";
}

(["mouseenter", "mousemove", "mousedown"] as const).forEach((eventName) =>
  mouseListenerElement.addEventListener(eventName, () => {
    showMousePointer();
  })
);

mouseListenerElement.addEventListener("mouseleave", () => {
  hideMousePointer();
});

function mouseToCircle({ screenX, screenY }: MouseEvent) {
  const mousePoint = zoomInSvg.createSVGPoint();
  mousePoint.x = screenX;
  mousePoint.y = screenY;
  const svgPoint = mousePoint.matrixTransform(
    mouseListenerElement.getScreenCTM()!.inverse()
  );
  const y = 2 - svgPoint.x * svgPoint.x;
  return { x: svgPoint.x, y };
}

function setArrowPosition(
  arrow: SVGGeometryElement,
  { x, y }: { x: number; y: number }
) {
  const slope = -2 * x;
  const angleInDegrees = (Math.atan(slope) / Math.PI) * 180;
  arrow.setAttribute(
    "transform",
    `translate(${x}, ${y}) rotate(${angleInDegrees})`
  );
}

mouseListenerElement.addEventListener("mousemove", (mouseEvent) => {
  setArrowPosition(mousePointerElement, mouseToCircle(mouseEvent));
});

// TODO reorganize:
// • setNewZoom should be private (if not completely removed)
// • allowAutoZoom should not be a property.  Does anyone even read it?  And setting it ALWAYS has a side effect.  Just make it a function.
class Zoom {
  private static centerX = 0;
  private static centerY = 0;
  private static ratio = 1;
  static #animate: ((time: number) => void) | undefined;
  static get allowAutoZoom() {
    return this.#animate !== undefined;
  }
  static #animationHasBeenInitialized = false;
  //static readonly #numberHeight = 0.2;
  static readonly #zoomTextGroup = getById("zoomText", SVGGElement);
  static readonly #zoomTextElement = assertClass(
    this.#zoomTextGroup.firstElementChild,
    SVGTextElement
  );
  static set allowAutoZoom(newValue: boolean) {
    if (newValue) {
      const now = performance.now();
      /**
       * Top end is limited to 300 because of a bug described in a different comment.
       * It takes 10 seconds to go from start to all the way zoomed in.
       */
      const logOfZoom = makeBoundedLinear(now, 0, now + 10000, Math.log(300));
      /**
       * Don't display the arrow at all until 1 second has passed.
       * And even then, make it fade in from nothing.
       * Initially the square is all the user needs.
       * But as the square shrinks from view, the arrow appears to take over.
       */
      const opacity = makeBoundedLinear(now + 1000, 0, now + 10000, 0.75);
      /**
       * The animation runs for 10 seconds then is idle for 5 more.
       * Then we restart in a random position.
       */
      const restartTime = now + 15000;
      this.#animate = (time: number) => {
        if (time > restartTime) {
          /**
           * A bell-curve-ish value in the range -2.5 to 2.5.
           * This is the exact same range allowed by a mouse click.
           * Focus on the middle part because it looks more interesting
           * than the edges.
           */
          const x = ((Math.random() + Math.random()) / 2) * 5 - 2.5;
          const y = 2 - x * x;
          this.selectNewTarget({ x, y });
          // The next line will overwrite this.#animate with a new object.
          // I.e. it will restart the animation.
          this.allowAutoZoom = true;
        } else {
          const newZoom = Math.exp(logOfZoom(time));
          this.setNewZoom(newZoom);
          const newOpacity = opacity(time);
          currentlyCenteredPointerElement.style.opacity = newOpacity.toString();
        }
      };
      hideMousePointer();
    } else {
      this.#animate = undefined;
    }
    this.setNewZoom(1);
    if (!this.#animationHasBeenInitialized) {
      this.#animationHasBeenInitialized = true;
      requestAnimationFrame(this.onAnimationFrame);

      /*
      archetype.remove();
      for (let index = 1; index <= 500; index++) {
        const text = assertClass(archetype.cloneNode(true), SVGTextElement);
        text.setAttribute("y", (index * this.#numberHeight).toString());
        text.textContent = `${index}⨉`;
        this.#zoomTextGroup.appendChild(text);
      }
      */
    }
  }
  private static onAnimationFrame(this: unknown, time: number) {
    requestAnimationFrame(Zoom.onAnimationFrame);
    Zoom.#animate?.(time);
  }
  private static updateGUI() {
    zoomedInParabolaPath.setAttribute(
      "transform",
      `scale(${this.ratio}) translate(${-this.centerX}, ${-this.centerY})`
    );
    currentlyCenteredTranslateGroup.setAttribute(
      "transform",
      `translate(${this.centerX}, ${this.centerY})`
    );
    currentlyCenteredZoomGroup.setAttribute(
      "transform",
      `scale(${1 / this.ratio})`
    );
    setArrowPosition(currentlyCenteredPointerElement, {
      x: this.centerX,
      y: this.centerY,
    });
    // This is crazy.  I can't set the stroke width to be less than 0.0003.
    // (That corresponds to a zoom ratio of greater than 500.)
    // (On further testing it seems that 300 is the largest safe ratio.
    // I sometimes see flashing just before 300, but once the program gets to 300 all is good.)
    // If I try to make the stroke-width smaller it suddenly becomes huge.
    // (I had similar problems trying to make something else tiny.  Look for "pt" and the corresponding comments.)
    const strokeWidth = (0.15 / this.ratio).toString();
    //console.log(strokeWidth);
    zoomedInParabolaPath.setAttribute("stroke-width", strokeWidth);
    //this.#zoomTextGroup.setAttribute("transform", `translate(0, ${-this.ratio * this.#numberHeight})`);
    this.#zoomTextElement.textContent = `${
      this.ratio < 10
        ? Math.round(this.ratio * 10) / 10
        : Math.round(this.ratio)
    }⨉`;
  }

  static selectNewTarget({ x, y }: { x: number; y: number }) {
    this.centerX = x;
    this.centerY = y;
    this.ratio = 1;
    this.updateGUI();
  }

  /**
   *
   * @param ratio 1.0 means actual size.  2.0 means double in both dimensions.
   */
  static setNewZoom(ratio: number) {
    this.ratio = ratio;
    this.updateGUI();
  }
}
(window as any).setNewZoom = Zoom.setNewZoom.bind(Zoom);

function updateMouseCursor(mouseEvent: MouseEvent) {
  mouseListenerElement.style.cursor = mouseEvent.buttons
    ? /* Something was pressed.  Releasing the button will zoom in to the current point. */
      "zoom-in"
    : /* Nothing is pressed.  Move the mouse to select a new point.  Only the X matters. */
      "ew-resize";
}
(["mouseup", "mousedown", "mouseenter"] as const).forEach((eventName) => {
  mouseListenerElement.addEventListener(eventName, updateMouseCursor);
});

(["mouseenter", "mousemove", "mousedown"] as const).forEach((eventName) => {
  mouseListenerElement.addEventListener(eventName, (mouseEvent) => {
    if (mouseEvent.buttons) {
      Zoom.selectNewTarget(mouseToCircle(mouseEvent));
    }
  });
});

mouseListenerElement.addEventListener("mouseleave", () => {
  if (!Zoom.allowAutoZoom) {
    Zoom.allowAutoZoom = true;
  }
});

(["mouseenter", "mouseup", "mousedown"] as const).forEach((eventName) => {
  mouseListenerElement.addEventListener(eventName, (mouseEvent) => {
    // I'm trying to avoid the side effects except when this really needs to change.
    const shouldAllowAutoZoom = mouseEvent.buttons == 0;
    if (shouldAllowAutoZoom != Zoom.allowAutoZoom) {
      Zoom.allowAutoZoom = shouldAllowAutoZoom;
    }
  });
});

Zoom.selectNewTarget({ x: 0, y: 2 });
Zoom.allowAutoZoom = true;

/**
 * A tangent line is just a line that touches a function at a point, and has the same slope as the function at that point.
 * This is another way to visualize a derivative.
 *
 * This would make a great graphic.  A simple animation.  Start with the 2-x*x picture.  Draw the line moving from one point to the next, back and forth,
 * at a comfortable speed to stare at.  Keep the default ease in and out on both sides.
 *
 * Maybe a summary for the derivate section?  Or where I'm already discussing something related.
 *
 * Hmmm.  For some reason I thought I'd already mentioned the tangent line.  Then it seemed like a good idea
 * to add a definition.  Now it seems less important.  It would make a nice animation.  I could probably adapt
 * my code for the mouse cursor arrow to make a tangent line demo with very little effort.
 */
