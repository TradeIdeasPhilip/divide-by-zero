import {
  LinearFunction,
  assertClass,
  initializedArray,
  makeBoundedLinear,
  makeLinear,
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

/**
 * Similar to makeBoundedLinear().
 * This will return a new function based on the two input points.
 * If you give x1 or x2 to the new function, the result will be y1 or y2, respectively.
 * Between x1 and x2 the function will be **smooth**.
 * Outside of x1 and x2, including at x1 and 2, the function will have a derivative of 0.
 * I.e. the function will be flat outside of the range, and smooth everywhere.
 * @param x1 One valid input.
 * @param y1 The expected output at x1.
 * @param x2 Another valid input.
 * @param y2 The expected output at x2.
 * @returns A function that takes x as an input.
 */
function makeEaseInOut(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): LinearFunction {
  if (x2 < x1) {
    [x1, y1, x2, y2] = [x2, y2, x1, y1];
  }
  // Now x1 <= x2;
  const transformInput = makeLinear(x1, 0, x2, Math.PI);
  const transformOutput = makeLinear(1, y1, -1, y2);
  return function (x: number) {
    if (x <= x1) {
      return y1;
    } else if (x >= x2) {
      return y2;
    } else {
      return transformOutput(Math.cos(transformInput(x)));
    }
  };
}

new DerivativeApproximation(6, "sampleParabola", "sampleDerivative", 1);

{
  const loopPeriodMS = 4897;
  const activePeriodMS = 2000;
  const size = makeEaseInOut(0, 1, activePeriodMS, 0.5);
  const graphics = new DerivativeApproximation(
    24,
    "animatedParabola1",
    "animatedDerivative1"
  );
  new AnimationLoop((time: DOMHighResTimeStamp) => {
    const timeSinceLoopStart = time % loopPeriodMS;
    graphics.resize(size(timeSinceLoopStart));
  });
}

{
  const loopPeriodMS = 5000;
  const activePeriodMS = 2000;
  const size = makeEaseInOut(0, 6 / 12, activePeriodMS, 6 / 24);
  const graphics = new DerivativeApproximation(
    24,
    "animatedParabola2",
    "animatedDerivative2"
  );
  new AnimationLoop((time: DOMHighResTimeStamp) => {
    const timeSinceLoopStart = time % loopPeriodMS;
    graphics.resize(size(timeSinceLoopStart));
  });
}

{
  const loopPeriodMS = 7000;
  const activePeriodMS = 5000;
  const size = //makeBoundedLinear(0, 1, activePeriodMS, 6 / 48);
    makeEaseInOut(0, 1, activePeriodMS, 6 / 48);

  const graphics = new DerivativeApproximation(
    48,
    undefined,
    "animatedDerivative3"
  );
  new AnimationLoop((time: DOMHighResTimeStamp) => {
    const timeSinceLoopStart = time % loopPeriodMS;
    graphics.resize(size(timeSinceLoopStart));
  });
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

{
  const anyNumberSpan = getById("anyNumber", HTMLSpanElement);
  const current = Array.from("34,567.89");
  setInterval(() => {
    let index = (Math.random() * 7) | 0;
    if (index == 2) {
      index = 7;
    } else if (index == 6) {
      index = 8;
    }
    let newValue: number;
    if (index == 0) {
      newValue = ((Math.random() * 9) | 0) + 1;
    } else {
      newValue = (Math.random() * 10) | 0;
    }
    current[index] = newValue.toString();
    anyNumberSpan.innerText = current.join("");
  }, 500);
}

Array.from(document.querySelectorAll("a:not([href])[id]")).forEach(
  (element) => {
    const anchor = assertClass(element, HTMLAnchorElement);
    if (anchor.innerText != "") {
      anchor.classList.add("self-link");
      anchor.href = "#" + anchor.id;
    }
  }
);

class Pointer {
  readonly element: SVGPolygonElement;
  static DEFAULT_LENGTH = 10;
  constructor(initialLength = Pointer.DEFAULT_LENGTH) {
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    this.setLength(initialLength);
    this.element.setAttribute("stroke-width", "0.25");
    this.element.setAttribute("stroke-miterlimit", "10");
  }
  setLength(length: number) {
    if (!isFinite(length)) {
      this.element.setAttribute("points", "");
      return;
    }
    const minNormalArrowHeadLength = 6;
    const headRatio =
      Math.sign(length) *
      Math.min(1, Math.abs(length) / minNormalArrowHeadLength);
    this.element.setAttribute(
      "points",
      `0,0 2.4,${headRatio * 6} 0.6,${
        headRatio * 4.4
      } 0.6,${length} -0.6,${length} -0.6,${headRatio * 4.4} -2.4,${
        headRatio * 6
      } 0,0`
    );
  }
}
(window as any).Pointer = Pointer;

{
  /**
   *
   * @param t
   * @returns A number between -1 and 1.
   */
  function timeToRange(t: DOMHighResTimeStamp) {
    const speed = 1000;
    return Math.sin(t / speed);
  }

  const pendulumContainer = getById("pendulumContainer", SVGSVGElement);

  const positionPointer = new Pointer();
  pendulumContainer.appendChild(positionPointer.element);
  positionPointer.element.setAttribute("fill", "red");
  positionPointer.element.setAttribute(
    "transform",
    "translate(50,90) rotate(90)"
  );

  const springPath = getById("spring", SVGPathElement);
  const springLeftHeight = makeLinear(-1, 10, 1, 15);
  const springRightHeight = makeLinear(-1, 7.5, 1, 10);
  const getSpringLoopWidth = makeLinear(-1, 22, 1, 18);

  function updatePhysics(t: DOMHighResTimeStamp) {
    const positionInRange = timeToRange(t);
    {
      const unscaledPendulumX = positionInRange / 2; //const maxPendulumDegrees = 30;  I should make the connection between these two things more obvious.
      /**
       * pendulumX and pendulumY are the center of the weight at the end of the pendulum.
       * It seems like there's an easier way to get this.  Maybe SVGGraphicsElement.getCTM()
       */
      const pendulumX = unscaledPendulumX * 70 + 50;
      const angle = Math.asin(unscaledPendulumX);
      const pendulumElement = getById("pendulum", SVGGElement);
      pendulumElement.setAttribute(
        "transform",
        `rotate(${(-angle / Math.PI) * 180})`
      );
      const pendulumY = Math.cos(angle) * 70 + 10;
      const horizontalLine = getById("offsetHorizontal", SVGLineElement);
      horizontalLine.x1.baseVal.value = horizontalLine.x2.baseVal.value =
        pendulumX;
      horizontalLine.y1.baseVal.value = pendulumY;
      positionPointer.setLength(unscaledPendulumX * 70);
      positionPointer.element.setAttribute(
        "transform",
        `translate(${pendulumX},90) rotate(90)`
      );
    }
    {
      // Spring
      //  d="M 50,10 a 20,10,180,0,0,0,20 a 20,7.5,180,0,0,0,-15 a 20,10,180,0,0,0,20 a 20,7.5,180,0,0,0,-15 a 20,10,180,0,0,0,20 a 20,7.5,180,0,0,0,-15 a 20,10,180,0,0,0,20 a 20,7.5,180,0,0,0,-15 a 20,10,180,0,0,0,20"
      const leftHeight = springLeftHeight(positionInRange);
      const rightHeight = springRightHeight(positionInRange);
      const width = getSpringLoopWidth(positionInRange);
      let d = "M 50,10";
      for (let i = 0; ; i++) {
        d += ` a ${width},${leftHeight},180,0,0,0,${2 * leftHeight}`;
        if (i > 5) {
          break;
        }
        d += ` a ${width},${rightHeight},180,0,0,0,${-2 * rightHeight}`;
      }
      springPath.setAttribute("d", d);
    }
  }

  new AnimationLoop((time) => {
    updatePhysics(time);
  });
}
