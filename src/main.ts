import {
  LinearFunction,
  assertClass,
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
      if (Math.random() < 0.9) {
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
    const offset = this.#originAtHead ? (-this.#strokeWidth*27/20) : (length + this.#strokeWidth/2);
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
  removeStroke() {this.setStrokeWidth(0);}
}
(window as any).Pointer = Pointer;

{
  type CurrentState = {
    readonly functionX: number;
    readonly position: number;
    readonly velocity: number;
    readonly acceleration: number;
  };

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

  //
  // 3 sine waves one time setup.
  //

// TODO for this and at least one other demo, make the sine waves go all the way to the edge of the allocated
// space, even if we have to shrink other things to deal with the max width or max height.


  const sinWaves = (
    [
      ["red", 0],
      ["magenta", Math.PI / 2],
      ["blue", Math.PI],
    ] as const
  ).map(([color, offset]) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const parent = getById("threeSineWaves", SVGGElement);
    parent.appendChild(path);
    path.style.strokeWidth = "0.056";
    path.style.fill = "none";
    path.style.stroke = color;
    return { path, offset };
  });

  //
  // Spring one time setup.
  //

  /**
   * The spring itself.  Everything in a black line of the same width.
   */
  const springPath = getById("springPath", SVGPathElement);
  /**
   * The weight hanging on the end of the spring.
   */
  const springWeight = getById("springWeight", SVGCircleElement);
  /**
   * The sine wave showing what the weight's position looks like over
   * time.
   */
  const springSineWave = getById("springSineWave", SVGPathElement);
  const springMinLeftHeight = 10;
  const springMaxLeftHeight = 15;
  const springLeftHeight = makeLinear(
    -1,
    springMinLeftHeight,
    1,
    springMaxLeftHeight
  );
  const springMinRightHeight = 7.5;
  const springMaxRightHeight = 10;
  const springRightHeight = makeLinear(
    -1,
    springMinRightHeight,
    1,
    springMaxRightHeight
  );
  const getSpringLoopWidth = makeLinear(-1, 22, 1, 18);
  const springTop = -17;
  const springLoopCount = 7;
  /**
   * How far is it from the bottom of the springy part to the center of the weight.
   */
  const springFinalDrop = 21;
  const minWeightYCenter =
    springTop +
    springLoopCount * 2 * (springMinLeftHeight - springMinRightHeight) +
    springMinLeftHeight +
    springFinalDrop;
  const maxWeightYCenter =
    springTop +
    springLoopCount * 2 * (springMaxLeftHeight - springMaxRightHeight) +
    springMaxLeftHeight +
    springFinalDrop;

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
    {
      // Three sine waves.
      sinWaves.forEach(({ path, offset }) => {
        const options: SineWaveOptions = {
          left: -4,
          amplitude: -1,
          yCenter: 0,
          right: 4,
          x0: -functionX - offset,
          frequencyMultiplier: 1,
        };
        const d = sineWavePath(options);
        path.setAttribute("d", d);
      });
    }
    {
      // Spring
      //  d="M 50,10 a 20,10,180,0,0,0,20 a 20,7.5,180,0,0,0,-15 a 20,10,180,0,0,0,20 a 20,7.5,180,0,0,0,-15 a 20,10,180,0,0,0,20 a 20,7.5,180,0,0,0,-15 a 20,10,180,0,0,0,20 a 20,7.5,180,0,0,0,-15 a 20,10,180,0,0,0,20"
      /**
       * Half of the height of each ellipse used on the left side of the spring.
       */
      const leftRadius = springLeftHeight(-position);
      /**
       * Half of the height of ellipse used on the right side of the spring.
       */
      const rightRadius = springRightHeight(-position);
      /**
       * Half of the width of the ellipses used in the spring.
       */
      const horizontalRadius = getSpringLoopWidth(-position);
      let d = `M 50,${springTop}`;
      for (let i = 0; i < springLoopCount; i++) {
        d += ` a ${horizontalRadius},${leftRadius},180,0,0,0,${2 * leftRadius}`;
        d += ` a ${horizontalRadius},${rightRadius},180,0,0,0,${
          -2 * rightRadius
        }`;
      }
      d += ` a ${horizontalRadius},${leftRadius},180,0,0,${-horizontalRadius},${leftRadius} h ${horizontalRadius} v ${springFinalDrop}`;
      springPath.setAttribute("d", d);
      const weightYCenter =
        springTop +
        springLoopCount * 2 * (leftRadius - rightRadius) +
        leftRadius +
        springFinalDrop;
      springWeight.cy.baseVal.value = weightYCenter;

      const scale = (maxWeightYCenter - minWeightYCenter) / 2;
      const options: SineWaveOptions = {
        left: -3.25 * scale,
        amplitude: -1 * scale,
        yCenter: (maxWeightYCenter + minWeightYCenter) / 2,
        right: +3.25 * scale,
        x0: -functionX * scale,
        frequencyMultiplier: 1 / scale,
      };
      springSineWave.setAttribute("d", sineWavePath(options));
    }
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
  private static fPrime(x: number): number {
    return (
      0.5 +
      0.5 * Math.cos(x) +
      2.3 * 0.25 * Math.cos(2.3 * x + 0.7) +
      5.11 * 0.05 * -Math.sin(5.11 * x - 0.2)
    );
  }
  static readonly #polyline = getById(
    "deadReckoningEstimate",
    SVGPolylineElement
  );
  static readonly #pointerGroup = getById("deadReckoningPointers", SVGGElement);
  static readonly WIDTH = 8.2;
  static update(segmentFraction: number) {
    this.#pointerGroup.innerHTML = "";
    const segmentCount = Math.ceil(1 / segmentFraction);
    const sizeOfSegment = this.WIDTH * segmentFraction;
    let points = "";
    /**
     * Our estimate is initialized with the correct value, but will
     * drift over time.
     */
    let estimatedY = this.f(0);
    for (let i = 0; i <= segmentCount; i++) {
      const x = sizeOfSegment * i;
      points += ` ${x}, ${estimatedY}`;
      const yPrime = this.fPrime(x);
      const dy = sizeOfSegment * yPrime;
      const actualY = this.f(x);
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
    new AnimationLoop((time) => {
      const localTime = time % period;
      const segmentFraction = getSegmentFraction(localTime);
      this.update(segmentFraction);
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
    this.#pointer.element.setAttribute(
      "transform",
      `translate(${x}, ${y}) scale(0.075) rotate(${angleInDegrees})`
    );
  }
}
SampleGraph.startDemo();
