import {
  LinearFunction,
  assertClass,
  count,
  initializedArray,
  makeBoundedLinear,
  makeLinear,
  pick,
  sleep,
  zip,
} from "phil-lib/misc";
import "./style.css";

import { getById } from "phil-lib/client-misc";
import { SineWaveOptions, sineWavePath } from "./svg-sine-wave";

//const zoomInSvg = getById("zoomIn", SVGSVGElement);
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
     * The animation runs for 10 seconds then is idle for 3 more.
     * Then we restart in a random position.
     *
     * If we restart this way there is an extra pause.  We reset to show the initial zoom of 1x.
     * Then we pause for 1/2 second.  Then we continue the animation as always.  If the user clicks, then we skip this pause.
     * Also, when this program first initializes we skip this pause.
     */
    const restartTime = startTime + 13000;
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
  constructor(private readonly onWake: (time: DOMHighResTimeStamp) => void) {
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
      this.onWake(time);
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
    makeEaseInOut(0, 1, activePeriodMS, 6 / 110);

  const graphics = new DerivativeApproximation(
    150,
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
  const suffixes = [
    ".000001",
    ".999997",
    ".3125",
    ".3̅", // Unicode combining Overline
    ".16̅",
    ".1̅4̅2̅8̅5̅7̅",
    ".0̅9̅",
    " ½", // Unicode THIN SPACE
    " ¼",
    " ¾",
    " ⅐",
    " ⅑",
    " ⅒",
    " ⅓",
    " ⅔",
    " ⅕",
    " ⅖",
    " ⅗",
    " ⅘",
    " ⅙",
    " ⅚",
    " ⅛",
    " ⅜",
    " ⅝",
    " ⅞",
  ];
  let lastNumber = 1001;
  let lastSuffix = "";
  setInterval(() => {
    lastNumber++;
    if (Math.random() > 0.75) {
      // Change the suffix.
      if (Math.random() < 0.7) {
        // The common case.
        lastSuffix = "";
      } else {
        lastSuffix = pick(suffixes);
      }
    }
    // This is not perfect.  For some locales this might use periods for
    // thousands separators.  But the code will always use a period as
    // as decimal point in the suffix.  I'm going to call this a bug
    // but a very, very low priority one.
    anyNumberSpan.innerText = lastNumber.toLocaleString() + lastSuffix;
  }, 1500);
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

/**
 * An arrow.  A wrapper around an SVG element.
 */
class Pointer {
  /**
   * This class uses this.element.points and this.element.style.strokeWidth.
   * Otherwise you can do anything you want with the element.
   *
   * You may stroke the arrow.  Just use this.setStrokeWidth, rather than
   * setting the element's stroke-width directly.  That way this class
   * can leave extra space for the stroke.  So the edge of the visible part
   * of the Pointer will be exactly at the origin.
   */
  readonly element: SVGPolygonElement;
  /**
   * Some arrows are just to highlight a point.
   * Other arrows need to be a specific size.
   */
  static DEFAULT_LENGTH = 10;
  /**
   * If you fill the polygon and set the stroke to none, i.e. keep the defaults, this will be the width of the shaft
   * of the arrow.  If you want to stroke a path that is consistent with this arrow, use this for the stroke-width.
   */
  static COMPATIBLE_STROKE_WIDTH = 1.6;
  /**
   * If you choose to stroke this arrow, this is a reasonable size.
   */
  static RECOMMENDED_STROKE_WIDTH = 0.25;
  #length: number;
  #originAtHead = true;
  #strokeWidth = 0;
  constructor(initialLength = Pointer.DEFAULT_LENGTH) {
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    this.#length = initialLength;
    this.redraw();
    this.element.setAttribute("stroke-width", "0");
    this.element.setAttribute("stroke-miterlimit", "10");
  }
  private redraw() {
    const length = this.#length;
    // 27/20 was measured quickly on my screen.  I'm sure I could make it a little more accurate with a better test.
    // Or do the math but that would be a pain.
    // I think it's off by a hair, but it looks good enough for the current application.
    const offset = this.#originAtHead
      ? (-this.#strokeWidth * 27) / 20
      : length + this.#strokeWidth / 2;
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
      `0,${0 - offset} 2.4,${headRatio * 6 - offset} 0.6,${
        headRatio * 4.4 - offset
      } 0.6,${length - offset} -0.6,${length - offset} -0.6,${
        headRatio * 4.4 - offset
      } -2.4,${headRatio * 6 - offset} 0,${0 - offset}`
    );
  }
  get length() {
    return this.#length;
  }
  set length(newValue) {
    // Warning.  This value is only accurate is if the stroke-width is 0.
    // I could fix that, but this is good enough for this project.
    // If I ever move this class to a library I should fix that.
    this.#length = newValue;
    this.redraw();
  }
  /**
   * If you set this to true, the default, the head of the arrow will be at 0,0.
   * If you set this to false, the tail of the arrow will be at 0,0.
   * Setting this to false will move the arrow up.
   */
  get originAtHead() {
    return this.#originAtHead;
  }
  set originAtHead(newValue) {
    this.#originAtHead = newValue;
    this.redraw();
  }
  get originAtTail() {
    // This property exists mostly to help document the originAtHead property.
    return !this.originAtHead;
  }
  set originAtTail(newValue) {
    this.originAtHead = !newValue;
  }
  setStrokeWidth(strokeWidth = Pointer.RECOMMENDED_STROKE_WIDTH) {
    this.#strokeWidth = strokeWidth;
    this.element.setAttribute("stroke-width", strokeWidth.toString());
    this.redraw();
  }
  removeStroke() {
    this.setStrokeWidth(0);
  }
}
(window as any).Pointer = Pointer;

/**
 * Get the size and shape of your SVG element in SVG units.
 *
 * To go the other way, to see the size and shape of an SVG element
 * in screen coordinates, consider using element.getBoundingClientRect().
 * @param svg The element to measure.
 * @param coordinatesRelativeTo Which coordinate system to use for the result.
 * Defaults to `svg`.
 * @returns A description of the svg in svg units.
 *
 * In the simplest case this will be exactly what you requested with viewBox.
 *
 * However, with the default preserveAspectRatio setting, the system might
 * add additional space to the edges of your SVG just to fit into the layout.
 */
function getSizeInSvgCoordinates(
  svg: SVGSVGElement,
  coordinatesRelativeTo: SVGGraphicsElement = svg
) {
  /**
   * Convert **from** screen coordinates.
   */
  const svgMatrix = coordinatesRelativeTo.getScreenCTM()!;
  /**
   * Convert the SVGMatrix to a DomMatrix.
   * According to TypeScript and the MDN docs this should not be necessary.
   * When I tried with Chrome the svgMatrix did not have a getScreenCTM() method.
   */
  const domMatrix = new DOMMatrix([
    svgMatrix.a,
    svgMatrix.b,
    svgMatrix.c,
    svgMatrix.d,
    svgMatrix.e,
    svgMatrix.f,
  ]);
  /**
   * Convert **to** screen coordinates.
   */
  const screenToSvg = domMatrix.inverse();
  /**
   * The space reserved for the SVG element.
   * This is in screen coordinates.
   */
  const rect = svg.getBoundingClientRect();
  const { x, y } = screenToSvg.transformPoint(rect);
  const { x: x1, y: y1 } = screenToSvg.transformPoint({
    x: rect.right,
    y: rect.bottom,
  });
  const height = y1 - y;
  const width = x1 - x;
  const result = new DOMRectReadOnly(x, y, width, height);
  return result;
}

// Physics stuff:
{
  /**
   * We share the environment between several animations.
   * They all oscillate in time with each other.
   */
  type CurrentState = {
    /**
     * The x value to put into the function.
     *
     * If you are only going to apply the function at this input,
     * consider using `position` instead.
     *
     * In practice the X that we give to the function is usually the same as the X that we give to SVG elements.
     * Most of the time I use a transform on the top level group to make the SVG's coordinates match the function's coordinates.
     */
    readonly functionX: number;
    /**
     * Where the item is.
     * That might be the weight on a spring or the weight on a pendulum or an electron in a wire.
     * 0 is the center or average point.  1 and -1 are the extremes.
     */
    readonly position: number;
    /**
     * How fast the position is changing.
     * Scaled the same as position, 0 at the center, 1 and -1 at the extremes.
     */
    readonly velocity: number;
    /**
     * The second derivative of position.
     * Scaled the same as position, 0 at the center, 1 and -1 at the extremes.
     */
    readonly acceleration: number;
  };

  /**
   * This controls the animation of the electron in the LC circuit.
   */
  class Electron {
    private constructor() {
      throw new Error("wtf");
    }
    static readonly #circles: readonly SVGCircleElement[] = Array.from(
      getById("electron", SVGGElement).querySelectorAll("circle")
    );
    static readonly #arrow = getById("electricCurrentArrow", SVGPolygonElement);
    static readonly #initialArrowTransform =
      this.#arrow.getAttribute("transform");
    /**
     * Takes the output of `sin()` and converts that into an svg x coordinate.
     */
    static readonly #toExternal = makeLinear(-1, 85, 1, 215);
    static updateDisplay({ functionX, velocity }: CurrentState) {
      this.#circles.forEach((circle, index) => {
        const x = this.#toExternal(Math.sin(functionX - 0.1 * index));
        circle.cx.baseVal.value = x;
      });
      this.#arrow.setAttribute(
        "transform",
        `${this.#initialArrowTransform} scale(${velocity} 1)`
      );
    }
  }

  /**
   * This class controls the animation with three sine waves in the physics section.
   */
  class SineWaves {
    /**
     * We need access to the entire SVG to know it's size and shape.
     * It can change aspect ratio.
     */
    static readonly #container = getById(
      "threeSineWavesContainer",
      SVGSVGElement
    );
    /**
     * The text shown on the left, including some minor special effects.
     */
    static readonly #pastTextG = getById("threeSineWavesPast", SVGGElement);
    /**
     * The text shown on the right, including some minor special effects.
     */
    static readonly #futureTextG = getById("threeSineWavesFuture", SVGGElement);
    /**
     * The three sine waves we are plotting.
     */
    static readonly #waves = (
      [
        ["red", 0],
        ["magenta", Math.PI / 2],
        ["blue", Math.PI],
      ] as const
    ).map(([color, offset]) => {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      const parent = getById("threeSineWaves", SVGGElement);
      parent.appendChild(path);
      path.style.strokeWidth = "0.056";
      path.style.fill = "none";
      path.style.stroke = color;
      return { path, offset };
    });
    /**
     * Update this to make sure it always goes to the edges of the available space.
     */
    static readonly #grid = getById("threeSineWavesGrid", SVGPathElement);
    /**
     * Call this once per animation frame.
     */
    static updateDisplay({ functionX }: CurrentState) {
      const { top, left, bottom, right } = getSizeInSvgCoordinates(
        this.#container
      );

      this.#pastTextG.setAttribute("transform", `translate(${left / 2})`);
      this.#futureTextG.setAttribute("transform", `translate(${right / 2})`);

      this.#grid.setAttribute(
        "d",
        `M ${left},0 ${right},0 M 0,${top} 0,${bottom}`
      );

      this.#waves.forEach(({ path, offset }) => {
        const options: SineWaveOptions = {
          left,
          amplitude: -1,
          yCenter: 0,
          right,
          x0: -functionX - offset,
          frequencyMultiplier: 1,
        };
        const d = sineWavePath(options);
        path.setAttribute("d", d);
      });
    }
  }

  //
  // Pendulum one time setup.
  //

  const pendulumContainer = getById("pendulumContainer", SVGSVGElement);

  const positionPointer = new Pointer();
  positionPointer.originAtTail = true;
  pendulumContainer.appendChild(positionPointer.element);
  positionPointer.element.setAttribute("fill", "red");
  positionPointer.element.setAttribute(
    "transform",
    "translate(50,90) rotate(90)"
  );
  const velocityPointer = new Pointer();
  velocityPointer.originAtTail = true;
  pendulumContainer.appendChild(velocityPointer.element);
  velocityPointer.element.setAttribute("fill", "violet");
  velocityPointer.element.setAttribute(
    "transform",
    "translate(50,80) rotate(90)"
  );
  const accelerationPointer = new Pointer();
  accelerationPointer.originAtTail = true;
  pendulumContainer.appendChild(accelerationPointer.element);
  accelerationPointer.element.setAttribute("fill", "blue");
  accelerationPointer.element.setAttribute(
    "transform",
    "translate(50,80) rotate(90)"
  );
  {
    const textObjects = pendulumContainer.querySelectorAll("text");
    if (textObjects.length != 3) {
      throw new Error("wtf");
    }
    const [left, center, right] = textObjects;
    const moveRight = (left.getBBox().width - right.getBBox().width) / 2;
    center.setAttribute("transform", `translate(${50 + moveRight},98)`);
  }

  class Spring {
    static updateDisplay({ position, functionX }: CurrentState) {
      /**
       * Half of the height of each ellipse used on the left side of the spring.
       */
      const leftRadius = this.#leftHeight(-position);
      /**
       * Half of the height of ellipse used on the right side of the spring.
       */
      const rightRadius = this.#rightHeight(-position);
      /**
       * Half of the width of the ellipses used in the spring.
       */
      const horizontalRadius = this.#getLoopWidth(-position);
      const d =
        `M 50,${this.#TOP}` +
        (
          ` a ${horizontalRadius},${leftRadius},180,0,0,0,${2 * leftRadius}` +
          ` a ${horizontalRadius},${rightRadius},180,0,0,0,${-2 * rightRadius}`
        ).repeat(this.#LOOP_COUNT) +
        ` a ${horizontalRadius},${leftRadius},180,0,0,${-horizontalRadius},${leftRadius} h ${horizontalRadius} v ${
          this.#FINAL_DROP
        }`;
      this.#path.setAttribute("d", d);

      // Overlay.  The white parts that cover the black lines in the back.
      const heightPerLoop = 2 * (leftRadius - rightRadius);
      const d1 =
        `M ${50 - horizontalRadius},${this.#TOP + leftRadius - heightPerLoop}` +
        (
          ` a ${leftRadius} ${horizontalRadius} 90 0 0 ${horizontalRadius} ${leftRadius}` +
          ` a ${rightRadius},${horizontalRadius},90,0,0,${horizontalRadius},${-rightRadius}` +
          ` m ${-horizontalRadius * 2},${heightPerLoop / 2}`
        ).repeat(this.#LOOP_COUNT + 1);
      this.#overlayPath.setAttribute("d", d1);

      const weightYCenter =
        this.#TOP +
        this.#LOOP_COUNT * heightPerLoop +
        leftRadius +
        this.#FINAL_DROP;
      this.#weight.cy.baseVal.value = weightYCenter;

      const { left, right } = getSizeInSvgCoordinates(
        this.#container,
        this.#wave
      );
      const scale = (this.#MAX_WEIGHT_Y_CENTER - this.#MIN_WEIGHT_Y_CENTER) / 2;
      const options: SineWaveOptions = {
        left,
        amplitude: -1 * scale,
        yCenter: (this.#MAX_WEIGHT_Y_CENTER + this.#MIN_WEIGHT_Y_CENTER) / 2,
        right,
        x0: -functionX * scale,
        frequencyMultiplier: 1 / scale,
      };
      this.#wave.setAttribute("d", sineWavePath(options));
    }
    static readonly #container = getById("springContainer", SVGSVGElement);
    /**
     * The spring itself.  Everything in a black line of the same width.
     */
    static readonly #path = getById("springPath", SVGPathElement);
    /**
     * Parts of the spring will be drawn a second and third time, on top of `this.#path`.
     * This is the part of the spring that is closer to the viewer.
     * That part of the spring has a border around it so you can distinguish it from the back part of the spring.
     */
    static readonly #overlayPath = getById("springOverlay", SVGPathElement);
    /**
     * The weight hanging on the end of the spring.
     */
    static readonly #weight = getById("springWeight", SVGCircleElement);
    /**
     * The sine wave showing what the weight's position looks like over
     * time.
     */
    static readonly #wave = getById("springSineWave", SVGPathElement);
    static readonly #MIN_LEFT_HEIGHT = 10;
    static readonly #MAX_LEFT_HEIGHT = 15;
    static readonly #leftHeight = makeLinear(
      -1,
      this.#MIN_LEFT_HEIGHT,
      1,
      this.#MAX_LEFT_HEIGHT
    );
    static readonly #MIN_RIGHT_HEIGHT = 7.5;
    static readonly #MAX_RIGHT_HEIGHT = 10;
    static readonly #rightHeight = makeLinear(
      -1,
      this.#MIN_RIGHT_HEIGHT,
      1,
      this.#MAX_RIGHT_HEIGHT
    );
    static readonly #getLoopWidth = makeLinear(-1, 19, 1, 15);
    static readonly #TOP = -17;
    static readonly #LOOP_COUNT = 7;
    /**
     * How far is it from the bottom of the springy part to the center of the weight.
     */
    static readonly #FINAL_DROP = 21;
    static readonly #MIN_WEIGHT_Y_CENTER =
      this.#TOP +
      this.#LOOP_COUNT * 2 * (this.#MIN_LEFT_HEIGHT - this.#MIN_RIGHT_HEIGHT) +
      this.#MIN_LEFT_HEIGHT +
      this.#FINAL_DROP;
    static readonly #MAX_WEIGHT_Y_CENTER =
      this.#TOP +
      this.#LOOP_COUNT * 2 * (this.#MAX_LEFT_HEIGHT - this.#MAX_RIGHT_HEIGHT) +
      this.#MAX_LEFT_HEIGHT +
      this.#FINAL_DROP;
  }

  function updatePhysics(t: DOMHighResTimeStamp) {
    const functionX = t / 1000;
    const position = Math.sin(functionX);
    const velocity = Math.cos(functionX);
    const acceleration = -Math.sin(functionX);

    const currentState: CurrentState = {
      functionX,
      position,
      velocity,
      acceleration,
    };
    Electron.updateDisplay(currentState);
    {
      // Pendulum
      const unscaledPendulumX = position / 2; //const maxPendulumDegrees = 30;  I should make the connection between these two things more obvious.
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
      positionPointer.length = unscaledPendulumX * 70;

      velocityPointer.element.setAttribute(
        "transform",
        `translate(${pendulumX},${pendulumY}) rotate(90)`
      );
      velocityPointer.length = velocity * 35;

      accelerationPointer.element.setAttribute(
        "transform",
        `translate(${pendulumX},${
          pendulumY - 10 + Pointer.COMPATIBLE_STROKE_WIDTH / 2
        }) rotate(90)`
      );
      accelerationPointer.length = acceleration * 35;
    }
    SineWaves.updateDisplay(currentState); // Three sine waves.
    Spring.updateDisplay(currentState);
  }

  new AnimationLoop((time) => {
    updatePhysics(time);
  });
}

class DeadReckoning {
  private static f(x: number): number {
    return (
      0.5 * x +
      0.5 * Math.sin(x) +
      0.25 * Math.sin(2.3 * x + 0.7) +
      0.05 * Math.cos(5.11 * x - 0.2)
    );
  }
  static fPrime(x: number): number {
    return (
      0.5 +
      0.5 * Math.cos(x) +
      2.3 * 0.25 * Math.cos(2.3 * x + 0.7) +
      5.11 * 0.05 * -Math.sin(5.11 * x - 0.2)
    );
  }
  readonly #polyline: SVGPolylineElement;
  readonly #pointerGroup: SVGGElement;
  constructor(suffix: string) {
    this.#polyline = getById(
      "deadReckoningEstimate" + suffix,
      SVGPolylineElement
    );
    this.#pointerGroup = getById("deadReckoningPointers" + suffix, SVGGElement);
  }
  static readonly WIDTH = 8.2;
  update(segmentFraction: number) {
    this.#pointerGroup.innerHTML = "";
    const segmentCount = Math.ceil(1 / segmentFraction);
    const sizeOfSegment = DeadReckoning.WIDTH * segmentFraction;
    let points = "";
    /**
     * Our estimate is initialized with the correct value, but will
     * drift over time.
     */
    let estimatedY = DeadReckoning.f(0);
    for (let i = 0; i <= segmentCount; i++) {
      const x = sizeOfSegment * i;
      points += ` ${x}, ${estimatedY}`;
      const yPrime = DeadReckoning.fPrime(x);
      const dy = sizeOfSegment * yPrime;
      const actualY = DeadReckoning.f(x);
      const angleInDegrees = (Math.atan(yPrime) / Math.PI) * 180;
      const pointerUp = new Pointer();
      this.#pointerGroup.appendChild(pointerUp.element);
      pointerUp.element.setAttribute(
        "transform",
        `translate(${x} ${actualY}) scale(0.05) rotate(${angleInDegrees + 180})`
      );
      const pointerDown = new Pointer();
      this.#pointerGroup.appendChild(pointerDown.element);
      pointerDown.element.setAttribute(
        "transform",
        `translate(${x} ${estimatedY}) scale(0.05) rotate(${angleInDegrees})`
      );
      if (i % 2) {
        pointerUp.element.style.opacity = pointerDown.element.style.opacity =
          "0.333";
      }
      estimatedY += dy;
    }
    this.#polyline.setAttribute("points", points);
  }
  static startDemo() {
    const initialPauseTime = 500;
    const moveTime = 20000;
    const finalPauseTime = 1500;
    const period = initialPauseTime + moveTime + finalPauseTime;
    const getSegmentFraction = makeBoundedLinear(
      initialPauseTime,
      1 / 2.5,
      initialPauseTime + moveTime,
      1 / 40
    );
    const instance = new this("");
    new AnimationLoop((time) => {
      const localTime = time % period;
      const segmentFraction = getSegmentFraction(localTime);
      instance.update(segmentFraction);
    });
  }
}
DeadReckoning.startDemo();

/**
 * An arrow highlights a random(-ish) point on the the graph.
 * This code moves the arrow and updates the description of the arrow, in the center of the graph.
 * The arrow moves in a fun, random-ish way.
 * The speeds were all set up so the user could read some numbers, while still seeing a lot of animation.
 */
class SampleGraph {
  private constructor() {
    throw new Error("wtf");
  }
  /**
   * These are the x values where we stop.
   */
  static readonly #destinations: readonly number[] = [
    ...[-3, -2, -1, 0, 1].map((y) => -Math.sqrt(2 - y)),
    ...[2, 1, 0, -1, -2, -3].map((y) => Math.sqrt(2 - y)),
  ];
  /**
   * Index into `#destinations`.
   */
  static #currentDestinationIndex = 0;
  /**
   *
   * @returns Where to place the arrow.
   */
  static #timeToX: LinearFunction = () =>
    this.#destinations[this.#currentDestinationIndex];
  /**
   * Start a new animation.  Move the arrow from the current position to a randomly selected new position.
   * @returns How long in milliseconds the animation will run.
   */
  private static pickNewDestination() {
    let newIndex = Math.floor(Math.random() * (this.#destinations.length - 1));
    if (newIndex == this.#currentDestinationIndex) {
      // We always move to a different destination.
      // You can't "move" to the current location.
      newIndex = this.#destinations.length - 1;
    }
    const startTime = performance.now();
    /**
     * How long will this animation take?
     *
     * It depends on how far the arrow needs to move.
     * The top speed is about the same in all cases.
     */
    const duration =
      250 * (Math.abs(this.#currentDestinationIndex - newIndex) + 1);
    const endTime = startTime + duration;
    this.#timeToX = makeEaseInOut(
      startTime,
      this.#destinations[this.#currentDestinationIndex],
      endTime,
      this.#destinations[newIndex]
    );
    // The next animation will start where this one will end.
    this.#currentDestinationIndex = newIndex;
    return duration;
  }
  /**
   * Where to add things.
   */
  static #group = getById("sampleGraph", SVGGElement);
  static #inputText = getById("sampleGraphInput", SVGTextElement);
  static #outputText = getById("sampleGraphOutput", SVGTextElement);
  static #pointer = new Pointer();
  static #formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 3,
  });
  /**
   * One time initialization.
   *
   * I wish JavaScript had a static class initializer like Java and C#.
   */
  static startDemo() {
    const pointerElement = this.#pointer.element;
    this.#group.appendChild(pointerElement);
    this.setX(this.#destinations[this.#currentDestinationIndex]);
    pointerElement.style.fill = "gold";
    this.#pointer.setStrokeWidth(0.5);
    pointerElement.style.stroke = "rgb(149, 69, 53)";
    new AnimationLoop((time) => this.setX(this.#timeToX(time)));
    (async () => {
      while (true) {
        const animationDuration = this.pickNewDestination();
        const pauseDuration = 2000;
        await sleep(animationDuration + pauseDuration);
      }
    })();
  }
  private static setX(x: number) {
    const formatNumber = (x: number) => {
      const full = this.#formatter.format(x);
      const match = /^(.*)\.000$/.exec(full);
      if (!match) {
        switch (full) {
          case "-2.236": {
            // Overline combining character.  TODO move this to phil-lib.
            // The result looks great!
            return "=-√5\u0305";
          }
          case "2.236": {
            return "=√5\u0305";
          }
          case "-1.732": {
            return "=-√3\u0305";
          }
          case "1.732": {
            return "=√3\u0305";
          }
          case "-1.414": {
            return "=-√2\u0305";
          }
          case "1.414": {
            return "=√2\u0305";
          }
        }
        return `≈${full}`;
      } else if (match[1] == "-0") {
        return "=0";
      } else {
        return `=${match[1]}`;
      }
    };
    this.#inputText.innerHTML = "x" + formatNumber(x);
    const y = 2 - x * x;
    this.#outputText.innerHTML = "y" + formatNumber(y);
    const slope = -2 * x; // It seems like I compute y, y', and angle in multiple places.  Should be reused, not copied!
    const angleInDegrees = (Math.atan(slope) / Math.PI) * 180;
    // TODO Replace most calls to setAttribute() and .style with this:
    // https://css-tricks.com/the-typed-object-model/
    // This interface is much more efficient and appropriate for updates in the animation callback.
    this.#pointer.element.setAttribute(
      "transform",
      `translate(${x}, ${y}) scale(0.075) rotate(${angleInDegrees})`
    );
  }
}
SampleGraph.startDemo();

(async () => {
  const numbers = Array.from(
    getById("integralSquares", SVGGElement).children
  ).map((element) => assertClass(element, SVGTextElement));
  const delay = makeBoundedLinear(0, 1000, numbers.length, 100);
  while (true) {
    numbers.forEach((text) => (text.style.display = "none"));
    await sleep(2000);
    for (const [text, index] of zip(numbers, count())) {
      text.style.display = "";
      await sleep(delay(index));
    }
    await sleep(3000);
  }
})();

/**
 * Heavily inspired by class DeadReckoning.
 * Meant to run in sync.
 */
class AreaUnderTheCurve {
  static readonly #positiveGroup = getById(
    "positiveUnderTheCurve",
    SVGGElement
  );
  static readonly #negativeGroup = getById(
    "negativeUnderTheCurve",
    SVGGElement
  );
  static update(segmentCount: number) {
    this.#positiveGroup.innerHTML = "";
    this.#negativeGroup.innerHTML = "";
    const segmentFraction = 1 / segmentCount;
    const sizeOfSegment = DeadReckoning.WIDTH * segmentFraction;
    segmentCount = Math.ceil(segmentCount);
    for (let i = 0; i <= segmentCount; i++) {
      const x = sizeOfSegment * i;
      const y = DeadReckoning.fPrime(x);
      if (y != 0) {
        const x1 = sizeOfSegment * (i + 1);
        const area = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        area.setAttribute("points", `${x},0 ${x},${y} ${x1},${y} ${x1},0`);
        (y > 0 ? this.#positiveGroup : this.#negativeGroup).appendChild(area);
      }
    }
  }
  static startDemo() {
    const initialPauseTime = 500;
    const moveTime = 30000;
    const finalPauseTime = 3500;
    const period = initialPauseTime + moveTime + finalPauseTime;
    /**
     * Take care of the initial and final pauses.  All outputs will be in the range of 0 to 1.
     */
    const getProgress = makeBoundedLinear(
      initialPauseTime,
      0,
      initialPauseTime + moveTime,
      1
    );
    /**
     * It's like breaking an animation into n equal pieces, then adding an ease-in and an ease-out to each one.
     * See https://www.desmos.com/calculator/r0exglohix for the shame of this timing function.
     * @param x A value between 0 and 1.
     * @returns A value between 0 and 1.
     */
    const insertPauses = (x: number) => {
      const frequency = 4;
      const coefficient = 2 * Math.PI * frequency;
      return x - Math.sin(x * coefficient) / coefficient;
    };
    /**
     * Convert from the internal 0-1 scale to the actual number of segments to display.
     */
    const getSegmentCount = makeLinear(0, 2.5, 1, 164);
    const deadReckoning = new DeadReckoning("1");
    new AnimationLoop((time) => {
      const localTime = time % period;
      const segmentCount = getSegmentCount(
        insertPauses(getProgress(localTime))
      );
      this.update(segmentCount);
      deadReckoning.update(1 / segmentCount);
    });
  }
}
AreaUnderTheCurve.startDemo();

// The GUI to change the font size.
document
  .querySelectorAll('input[type="radio"][name="fontChoice"]')
  .forEach((element) => {
    const input = assertClass(element, HTMLInputElement);
    const label = assertClass(input.nextElementSibling, HTMLLabelElement);
    input.addEventListener("click", () => {
      document.body.style.fontSize = label.style.fontSize;
    });
  });
getById("font12", HTMLInputElement).click();

{
  const svg = getById("fontBackground", SVGSVGElement);

  // Interesting.  This gives different results on Chrome and Safari.
  // Chrome resizes the SVG to take up the entire width before getting
  // here.  Safari doesn't do that first resize until later.
  //console.log(getSizeInSvgCoordinates(svg));

  const waveColors: readonly string[] = ["red", "magenta", "blue"];
  const height = 100;
  const waveHeight = height * 0.5;
  const amplitude = waveHeight / 2;
  const spaceToDivide = height - waveHeight;
  const spaceBetween = spaceToDivide / (waveColors.length - 0.5);
  const initialY = spaceBetween / 4 + amplitude;

  const waves = waveColors.map((color, index) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.appendChild(path);
    path.style.fill = "none";
    path.style.stroke = color;
    path.style.strokeWidth = "0.056";
    path.setAttribute(
      "transform",
      `translate(0, ${initialY + index * spaceBetween}) scale(${amplitude})`
    );
    return path;
  });
  new AnimationLoop((time) => {
    const x0 = -time / 1000;
    const { left, right } = getSizeInSvgCoordinates(svg, waves[0]);
    const options: SineWaveOptions = {
      left,
      amplitude: -1,
      yCenter: 0,
      right,
      x0,
      frequencyMultiplier: 1,
    };
    waves.forEach((path, index) => {
      options.segmentsPerCycle = index / 2 + 2; // 2, 2.5, and 3.
      const d = sineWavePath(options);
      path.setAttribute("d", d);
    });
  });
}
