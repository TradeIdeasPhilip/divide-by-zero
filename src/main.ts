import {
  assertClass,
  initializedArray,
  makeBoundedLinear,
  zip,
} from "phil-lib/misc";
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

(["mousemove", "mouseenter"] as const).forEach((eventName) =>
  mouseListenerElement.addEventListener(eventName, (mouseEvent) => {
    setArrowPosition(mousePointerElement, mouseToCircle(mouseEvent));
  })
);

class Zoom {
  private static centerX = 0;
  private static centerY = 0;
  private static ratio = 1;
  /**
   * While the mouse is down we pause the animation.  So the user can drag the mouse anywhere.
   * On mouseup we restart the animation.  #animate is a closure including a lot of the animation settings.
   */
  static #animate: ((time: number) => void) | undefined;
  static animationIsRunning() {
    return this.#animate !== undefined;
  }
  static #animationHasBeenInitialized = false;
  static readonly #zoomTextGroup = getById("zoomText", SVGGElement);
  static readonly #zoomTextElement = assertClass(
    this.#zoomTextGroup.firstElementChild,
    SVGTextElement
  );
  /**
   * Start the zooming-in animation.
   * If the animation is already running, do nothing.
   */
  static startAnimation() {
    if (!this.animationIsRunning()) {
      this.restartAnimation();
    }
  }
  /**
   * Start the animation.  If it's already running, clear the old animation
   * and replace it with a new one.
   */
  static restartAnimation(initialPause = 0) {
    const startTime = performance.now() + initialPause;
    /**
     * Top end is limited to 300 because of a bug described in a different comment.
     * It takes 10 seconds to go from start to all the way zoomed in.
     */
    const logOfZoom = makeBoundedLinear(
      startTime,
      0,
      startTime + 10000,
      Math.log(300)
    );
    /**
     * Don't display the arrow at all until 1 second has passed.
     * And even then, make it fade in from nothing.
     * Initially the square is all the user needs.
     * But as the square shrinks from view, the arrow appears to take over.
     */
    const opacity = makeBoundedLinear(
      startTime + 1000,
      0,
      startTime + 10000,
      0.75
    );
    /**
     * The animation runs for 10 seconds then is idle for 5 more.
     * Then we restart in a random position.
     *
     * If we restart this way there is an extra pause.  We reset to show the initial zoom of 1x.
     * Then we pause for 1/2 second.  Then we continue the animation as always.  If the user clicks, then we skip this pause.
     * Also, when this program first initializes we skip this pause.
     */
    const restartTime = startTime + 15000;
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
        // That's how it will restart the animation.
        this.restartAnimation(500);
      } else {
        const newZoom = Math.exp(logOfZoom(time));
        this.setNewZoom(newZoom);
        const newOpacity = opacity(time);
        currentlyCenteredPointerElement.style.opacity = newOpacity.toString();
      }
    };
    hideMousePointer();
    this.setNewZoom(1);
    if (!this.#animationHasBeenInitialized) {
      this.#animationHasBeenInitialized = true;
      requestAnimationFrame(this.onAnimationFrame);
    }
  }

  /**
   * Stop responding to the animation timer.
   *
   * And reset the zoom to 1.
   */
  static stopAnimation() {
    this.#animate = undefined;
    this.setNewZoom(1);
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
  private static setNewZoom(ratio: number) {
    this.ratio = ratio;
    this.updateGUI();
  }
}

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
  Zoom.startAnimation();
});

(["mouseenter", "mouseup", "mousedown"] as const).forEach((eventName) => {
  mouseListenerElement.addEventListener(eventName, (mouseEvent) => {
    const shouldAutoZoom = mouseEvent.buttons == 0;
    if (shouldAutoZoom) {
      Zoom.startAnimation();
    } else {
      Zoom.stopAnimation();
    }
  });
});

// Put it into a valid state.
Zoom.selectNewTarget({ x: 0, y: 2 });
Zoom.startAnimation();

/**
 * It often makes sense to create on example of an element in the document,
 * then use the code to duplicate that object.  That's the easy way to make
 * sure all of the properties are right.  This class takes care of some of
 * common tasks related to this activity.
 */
class CopyElement<T extends Element> {
  /**
   * The one that we moved out of the document.
   */
  readonly #archetype: T;
  /**
   * This will immediately pull the sample element out of the document, making it invisible.
   * @param parent This is the element where we find the sample and add the new copies.
   * @param type This is the expected & required type of the element to duplicate.
   */
  constructor(readonly parent: SVGGElement, readonly type: { new (): T }) {
    let archetype: T | undefined;
    for (const child of parent.children) {
      if (child instanceof type) {
        archetype = child;
        break;
      }
    }
    if (!archetype) {
      throw new Error("wtf");
    }
    archetype.remove();
    this.#archetype = archetype;
  }
  /**
   *
   * @returns A new copy of the sample element.
   */
  create(): T {
    return assertClass(this.#archetype.cloneNode(true), this.type);
  }
  /**
   * This calls `create()` and also appends this new element to the end of the parent.
   * This is a very common use case, where the copies go back where the sample came from.
   * @returns A new copy of the sample element.
   */
  createParented(): T {
    return this.parent.appendChild(this.create());
  }
}

type Point = { readonly x: number; readonly y: number };

/**
 * Draw the lines in different ways.
 *
 * We start with a few segments.  Then we add more and more.
 */
class DerivativeApproximation {
  readonly #parabolaPoints: readonly SVGCircleElement[];
  readonly #parabolaLines: readonly SVGLineElement[];
  readonly #derivativeSegments: readonly {
    readonly start: SVGCircleElement;
    readonly middle: SVGLineElement;
    readonly end: SVGCircleElement;
  }[];
  /**
   *
   * @param numberOfSegments How many line segments to draw.
   * @param parabolaGroup Where to put the new SVG Elements that we create.
   * And where to find the sample elements to duplicate.
   * Undefined means to skip this graph.
   * @param derivativeGroup  Where to put the new SVG Elements that we create.  And where to find the sample elements to duplicate.
   * @param initialSize The distance between two adjacent points.  Should be ≥ 0.  Will be overwritten by the next call to resize().
   * The default is just enough to fit all of the segments on the charts.
   */
  constructor(
    readonly numberOfSegments: number,
    parabolaGroup: string | undefined,
    derivativeGroup: string,
    initialSize = 6 / numberOfSegments
  ) {
    const parabolaGElement =
      parabolaGroup === undefined
        ? undefined
        : getById(parabolaGroup, SVGGElement);
    const derivativeGElement = getById(derivativeGroup, SVGGElement);
    if (parabolaGElement) {
      {
        const factory = new CopyElement(parabolaGElement, SVGCircleElement);
        this.#parabolaPoints = initializedArray(numberOfSegments + 1, () =>
          factory.createParented()
        );
      }
      {
        const factory = new CopyElement(parabolaGElement, SVGLineElement);
        this.#parabolaLines = initializedArray(numberOfSegments, () =>
          factory.createParented()
        );
      }
    } else {
      this.#parabolaPoints = [];
      this.#parabolaLines = [];
    }
    {
      const circleFactory = new CopyElement(
        derivativeGElement,
        SVGCircleElement
      );
      const lineFactory = new CopyElement(derivativeGElement, SVGLineElement);
      this.#derivativeSegments = initializedArray(numberOfSegments, () => {
        const middle = lineFactory.createParented();
        const start = circleFactory.createParented();
        const end = circleFactory.createParented();
        return { start, middle, end };
      });
    }
    this.resize(initialSize);
  }
  /**
   * Rescale all of the elements.
   * @param size The distance between two adjacent points.  Should be ≥ 0.
   */
  resize(size: number) {
    /** Number of fence posts. */
    const numberOfPoints = this.numberOfSegments + 1;
    const midway = this.numberOfSegments / 2;
    const points: readonly Point[] = initializedArray(numberOfPoints, (n) => {
      const x = (n - midway) * size;
      const y = (x * x) / 2; // y = f(x)  I.e. The function we are going to take the derivative of.
      return { x, y };
    });
    for (const [point, circle] of zip(points, this.#parabolaPoints)) {
      circle.cx.baseVal.value = point.x;
      circle.cy.baseVal.value = point.y;
    }
    const pairs = initializedArray(points.length - 1, (n) => {
      return { first: points[n], second: points[n + 1] };
    });
    for (const [{ first, second }, line] of zip(pairs, this.#parabolaLines)) {
      line.x1.baseVal.value = first.x;
      line.y1.baseVal.value = first.y;
      line.x2.baseVal.value = second.x;
      line.y2.baseVal.value = second.y;
    }
    for (const [{ first, second }, { start, middle, end }] of zip(
      pairs,
      this.#derivativeSegments
    )) {
      const slope = (second.y - first.y) / (second.x - first.x);
      /**
       * The x and y scales are off by a factor of 2.
       * This is the y that the SVG can handle.
       */
      const y = slope / 2;
      start.cx.baseVal.value = middle.x1.baseVal.value = first.x;
      start.cy.baseVal.value = middle.y1.baseVal.value = y;
      end.cx.baseVal.value = middle.x2.baseVal.value = second.x;
      end.cy.baseVal.value = middle.y2.baseVal.value = y;
    }
  }
}

class AnimationLoop {
  constructor(private readonly toDo: (time: DOMHighResTimeStamp) => void) {
    this.callback = this.callback.bind(this);
    this.callback(performance.now());
  }
  #cancelled = false;
  cancel() {
    this.#cancelled = true;
  }
  private callback(time: DOMHighResTimeStamp) {
    if (!this.#cancelled) {
      requestAnimationFrame(this.callback);
      this.toDo(time);
    }
  }
}

new DerivativeApproximation(6, "sampleParabola", "sampleDerivative", 1);

new DerivativeApproximation(
  12,
  "animatedParabola1",
  "animatedDerivative1",
  0.5
); // TODO animate this!!!  From 1 to 0.5, then sits on 0.5 for a while, then jumps back to the beginning.  maybe 2/3 or 3/4 of the time it's paused at the end.

new DerivativeApproximation(24, "animatedParabola2", "animatedDerivative2"); // TODO animate this!!!

{
  const loopPeriodMS = 7000;
  const activePeriodMS = 5000;
  const size = makeBoundedLinear(0, 1, activePeriodMS, 6 / 48);
  const graphics = new DerivativeApproximation(
    48,
    undefined,
    "animatedDerivative3"
  );
  new AnimationLoop((time: DOMHighResTimeStamp) => {
    const timeSinceLoopStart = time % loopPeriodMS;
    graphics.resize(size(timeSinceLoopStart));
  });
  // TODO It's super jerky, especially at the end when it loops back to the beginning.  Do something!
}

class TangentLine {
  static #element = getById("tangentLine", SVGGElement);
  /**
   * Move to a specific position.
   * @param x The x value from the scale on the graph.
   */
  static setPosition(x: number) {
    const y = 2 - x * x;
    const slope = -2 * x;
    const angleInDegrees = (Math.atan(slope) / Math.PI) * 180;
    this.#element.setAttribute(
      "transform",
      `translate(${x}, ${y}) rotate(${angleInDegrees})`
    );
  }
  /**
   *
   * @param r -1 for the furthest left recommended position.
   * 1 for the furthest right recommended position.
   */
  static setRelativePosition(r: number) {
    this.setPosition(r * 2.25);
  }
}

new AnimationLoop((time) =>
  TangentLine.setRelativePosition(Math.sin(time / 2200))
);
