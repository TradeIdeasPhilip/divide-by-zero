/*
 * Plotting a sine wave!
 *
 * And a good start toward plotting any function.
 */

import { initializedArray, makeLinear } from "phil-lib/misc";

/**
 * To make a smooth plot I need three pieces of data about each point: x, y and y′.
 */
type DerivativePoint = {
  readonly x: number;
  readonly y: number;
  readonly yPrime: number;
};

/**
 * Each input describes a tangent line.
 * @param p1 Start
 * @param p2 End
 * @returns Each input describes a tangent line.  Return the point where the two tangent lines intersect.
 * Returns undefined on any sort of error.  For example, if the inputs describe two parallel ines, there is no correct answer.
 */
function quadraticControlPoint(
  p1: DerivativePoint,
  p2: DerivativePoint
): { x: number; y: number } {
  /**
   * In case of any trouble, return this.  This will draw a straight line between the
   * two points.  That's a quick and dirty solution.  It's probably good enough in
   * the examples where I've seen trouble.  The trouble's always in the flat part of
   * a sine wave.
   *
   * There are more general solutions.  Maybe return undefined and the caller breaks
   * the segment into two smaller segments.  This is good enough for now.
   */
  const error = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  {
    const directLineSlope = (p2.y - p1.y) / (p2.x - p1.x);
    if (
      (p1.yPrime > directLineSlope && p2.yPrime > directLineSlope) ||
      (p1.yPrime < directLineSlope && p2.yPrime < directLineSlope)
    ) {
      //console.log({directLineSlope, p1, p2});
      return error;
    }
  }
  // (y - p1.y) / (x - p1.x) = p1.yPrime      First tangent line
  // y - p1.y = (x - p1.x) ⨉ p1.yPrime
  // y = (x - p1.x) ⨉ p1.yPrime + p1.y
  //   and
  // y = (x - p2.x) ⨉ p2.yPrime + p2.y        Second tangent line
  //   so
  // (x - p1.x) ⨉ p1.yPrime + p1.y           = (x - p2.x) ⨉ p2.yPrime + p2.y
  // x ⨉ p1.yPrime - p1.x ⨉ p1.yPrime + p1.y = x ⨉ p2.yPrime - p2.x ⨉ p2.yPrime + p2.y
  // x ⨉ p1.yPrime - x ⨉ p2.yPrime           = p1.x ⨉ p1.yPrime - p1.y - p2.x ⨉ p2.yPrime + p2.y
  // x ⨉ (p1.yPrime - p2.yPrime)             = (p1.x ⨉ p1.yPrime - p1.y - p2.x ⨉ p2.yPrime + p2.y)
  // x = (p1.x ⨉ p1.yPrime - p1.y - p2.x ⨉ p2.yPrime + p2.y) / (p1.yPrime - p2.yPrime)
  const x =
    (p1.x * p1.yPrime - p1.y - p2.x * p2.yPrime + p2.y) /
    (p1.yPrime - p2.yPrime);
  if (!isFinite(x)) {
    console.log({ x, p1, p2 });
    return error;
  }
  const y = (x - p1.x) * p1.yPrime + p1.y;
  if (!isFinite(y)) {
    console.log({ y, x, p1, p2 });
    return error;
  }
  //console.log({p1, p2, x, y});
  return { x, y };
}
(window as any).quadraticControlPoint = quadraticControlPoint;

/**
 * Given inputs like ['a', 'b', 'c', 'd', 'e', 'f'] and 3, yield
 * ['a', b', 'c'], ['b', 'c', 'd'], ['c', 'd', 'e'] then finally
 * ['d', 'e', 'f'].
 * @param input A list of elements to redistribute.
 * @param count How many elements to give on each call to the iterator.
 * This larger this number is, the fewer items the iterator will yield.
 */
function* nOverlapping<T>(input: Iterable<T>, count = 2) {
  // TODO move this into phil-lib.
  if (count < 1 || (count | 0) != count) {
    throw new Error("wtf");
  }
  const collection: T[] = [];
  for (const element of input) {
    collection.push(element);
    if (collection.length == count) {
      yield collection;
      collection.shift();
    }
  }
}

/**
 *
 * @param input A series of points, in order from left to right.
 * @returns A string suitable for
 */
function functionToPath(input: readonly DerivativePoint[]): string {
  let result = "";
  for (const [start, end] of nOverlapping(input)) {
    if (result == "") {
      result = `M ${start.x},${start.y}`;
    }
    const controlPoint = quadraticControlPoint(start, end);
    result += ` Q ${controlPoint.x},${controlPoint.y} ${end.x},${end.y}`;
  }
  return result;
}

/**
 * Describe a sin function.
 *
 * `Math.sin((x - x0) * frequencyMultiplier) * amplitude + yCenter`
 */
export type SinOptions = {
  /**
   * The sin function will start here.
   * i.e. f(x0) = 0 and fPrime(x0) > 0
   *
   * Making this number slightly larger will move the entire graph a little to the right.
   *
   * 0 would give you a standard sin function.
   */
  x0: number;
  /**
   * 1 keeps the standard frequency of 1 / (2 * PI).
   * 2 doubles that frequency.
   * 0.5 cuts the standard frequency in half.
   *
   * Should be positive.
   */
  frequencyMultiplier: number;
  /**
   * 0 for a standard sin function.
   * This is the center of the sin's output.
   * Positive numbers move the graph up.
   */
  yCenter: number;
  /**
   * 1 for a standard sin() function.
   * 2 for twice as tall.
   *
   * This is the distance between the center and one of the extremes.
   * This is half the distance between the extremes.
   */
  amplitude: number;
};
function makeSinFunction({
  x0,
  frequencyMultiplier,
  yCenter,
  amplitude,
}: SinOptions) {
  return {
    f(x: number) {
      return Math.sin((x - x0) * frequencyMultiplier) * amplitude + yCenter;
    },
    fPrime(x: number) {
      return (
        Math.cos((x - x0) * frequencyMultiplier) *
        amplitude *
        frequencyMultiplier
      );
    },
  };
}

/**
 * When we actually display the sine wave, we need to know the start and end of what we are plotting.
 */
export type SineWaveOptions = SinOptions & {
  /**
   * The furthest left, in graph coordinates, that we should plot.
   */
  left: number;
  /**
   * The furthest left, in graph coordinates, that we should plot.
   */
  right: number;
  /**
   * Leave this `undefined` for the default.
   * Normally that's what you want.
   * I've added this for testing and artistic value.
   * Too small and this chart will look funny.
   * Too big and you waste memory and CPU.
   *
   * See different values: https://www.youtube.com/shorts/1-BKmXGkuEI
   * "How many parabolas does it take to draw a sine wave? #some3"
   */
  segmentsPerCycle?: number;
};

/**
 * This function decides where we should take samples of the sin function.
 *
 * Currently this function is pretty simple.  It adds enough points that
 * the graph looks right.  However, this could do much more.  It could
 * take more samples in some regions than others, for example.
 * @param param0
 * @returns A list of `x` values that we should put into the sin function.
 */
function getXs({
  left,
  right,
  frequencyMultiplier,
  segmentsPerCycle,
}: SineWaveOptions): number[] {
  if (right <= left) {
    // Nothing to display.
    // Get rid of this case quickly and simply.
    // The inputs are typically hard coded so we'd never see
    // something that strange, barring a typo.
    return [];
  }
  /**
   * Each time we show an entire sine wave we should break it into
   * this many equal segments.
   *
   * 10 seems to work well.  100 isn't noticeably different.
   *
   * I start to see problems around 5.  6 is probably usable but I want to be safe.
   *
   * If you really need fewer segments, try lining them up better.
   * If you start a new segment at every 0 and every extreme, you will need few if any additional segments.
   * I tried that at first, but it was a lot of effort, and just raising this number worked.
   */
  const RECOMMENDED_SEGMENTS_PER_CYCLE = 10;
  segmentsPerCycle ??= RECOMMENDED_SEGMENTS_PER_CYCLE;
  /**
   * More cycles means we need more detail and therefore more segments.
   */
  const numberOfCycles = ((right - left) / (2 * Math.PI)) * frequencyMultiplier;
  const numberOfSegments = Math.max(
    1,
    Math.round(numberOfCycles * segmentsPerCycle)
  );
  const result = initializedArray(
    numberOfSegments + 1,
    makeLinear(0, left, numberOfSegments, right)
  );
  /*
  console.log({
    left,
    right,
    frequencyMultiplier,
    numberOfCycles,
    numberOfSegments,
    result
  });
  */
  return result;
  // I originally tried to line these things up a specific way.  I wanted each point
  // of inflection (second derivative = 0) to be the end of a segment.  But it was
  // a pain to do.  Instead I fixed my model for creating bezier curves.  It does
  // a good job unless you have way too few points.
}

/**
 *
 * @param options A description of what to draw.
 * @returns A list of samples of the requested function within the
 * requested region.  This is in the right format for input to
 * `functionToPath()`.
 */
function sineWavePoints(options: SineWaveOptions): DerivativePoint[] {
  const xs = getXs(options);
  const sin = makeSinFunction(options);
  const points: DerivativePoint[] = xs.map((x) => {
    return { x, y: sin.f(x), yPrime: sin.fPrime(x) };
  });
  return points;
}
/**
 *
 * @param options A description of what to draw.
 * @returns A string suitable for the `d` attribute of a
 * path element.
 */
export function sineWavePath(options: SineWaveOptions) {
  return functionToPath(sineWavePoints(options));
}
(window as any).sineWavePath = sineWavePath;
