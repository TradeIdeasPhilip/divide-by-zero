import { makeBoundedLinear } from "phil-lib/misc";
import "./style.css";

import { getById } from "phil-lib/client-misc";

const zoomInSvg = getById("zoomIn", SVGSVGElement);
const mouseListenerElement = getById("mouseListener", SVGRectElement);
const mousePointerCircle = getById("mousePointer", SVGCircleElement);
const currentlyCenteredCircle = getById("currentlyCentered", SVGCircleElement);
const zoomedInParabolaPath = getById("zoomedInParabola", SVGPathElement);

mouseListenerElement.addEventListener("mouseenter", () => {
  mousePointerCircle.style.display = "";
});

mouseListenerElement.addEventListener("mouseleave", () => {
  mousePointerCircle.style.display = "none";
});

function mouseToCircle({ screenX, screenY }: MouseEvent) {
  const mousePoint = zoomInSvg.createSVGPoint();
  mousePoint.x = screenX;
  mousePoint.y = screenY;
  const svgPoint = mousePoint.matrixTransform(
    mousePointerCircle.getScreenCTM()!.inverse()
  );
  const y = 2 - svgPoint.x * svgPoint.x;
  return { x: svgPoint.x, y };
}

mouseListenerElement.addEventListener("mousemove", (mouseEvent) => {
  const { x, y } = mouseToCircle(mouseEvent);
  mousePointerCircle.cx.baseVal.value = x;
  mousePointerCircle.cy.baseVal.value = y;
});

// TODO reorganize.  #autoZoomAmount should be an action to be called on animation, not a function to be called by another function.
// setNewZoom should be private (if not completely removed)
// allowAutoZoom should not be a property.  Does anyone even read it?  And setting it ALWAYS has a side effect.
class Zoom {
  private static centerX = 0;
  private static centerY = 0;
  private static ratio = 1;
  static #autoZoomAmount: ((time: number) => number) | undefined;
  static get allowAutoZoom() {
    return this.#autoZoomAmount !== undefined;
  }
  static #animationHasBeenInitialized = false;
  static set allowAutoZoom(newValue: boolean) {
    if (newValue) {
      const now = performance.now();
      const linear = makeBoundedLinear(now, 0, now + 5000, Math.log(400));
      this.#autoZoomAmount = (time: number) => {
        return Math.exp(linear(time));
      };
      // performance.now();
    } else {
      this.#autoZoomAmount = undefined;
    }
    this.setNewZoom(1);
    if (!this.#animationHasBeenInitialized) {
      this.#animationHasBeenInitialized = true;
      requestAnimationFrame(this.onAnimationFrame);
    }
  }
  private static onAnimationFrame(this: unknown, time: number) {
    requestAnimationFrame(Zoom.onAnimationFrame);
    if (Zoom.#autoZoomAmount) {
      Zoom.setNewZoom(Zoom.#autoZoomAmount(time));
    }
  }
  private static setTransform() {
    zoomedInParabolaPath.setAttribute(
      "transform",
      `scale(${this.ratio}) translate(${-this.centerX}, ${-this.centerY})`
    );
    // This is crazy.  I can't set the stroke width to be less than 0.0003.
    // (That corresponds to a zoom ratio of greater than 500.)
    // If I try to make the stroke-width smaller it suddenly becomes huge.
    // (I had similar problems trying to make something else tiny.  Look for "pt" and the corresponding comments.)
    const strokeWidth = (0.15 / this.ratio).toString();
    //console.log(strokeWidth);
    zoomedInParabolaPath.setAttribute("stroke-width", strokeWidth);
  }

  static selectNewTarget({ x, y }: { x: number; y: number }) {
    this.centerX = x;
    this.centerY = y;
    this.ratio = 1;
    this.setTransform();
    currentlyCenteredCircle.cx.baseVal.value = x;
    currentlyCenteredCircle.cy.baseVal.value = y;
  }

  /**
   *
   * @param ratio 1.0 means actual size.  2.0 means double in both dimensions.
   */
  static setNewZoom(ratio: number) {
    this.ratio = ratio;
    this.setTransform();
  }
}
(window as any).setNewZoom = Zoom.setNewZoom.bind(Zoom);

function updateMouseCursor(mouseEvent: MouseEvent) {
  mouseListenerElement.style.cursor = mouseEvent.buttons
    ? /* Something was pressed.  Releasing the button will zoom in to the current point. */
      "zoom-in"
    : /* Nothing is pressed.  Move the mouse to select a new point. */
      "cell";
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
 */
