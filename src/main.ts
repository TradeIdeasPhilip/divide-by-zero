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

mouseListenerElement.addEventListener("mousedown", (mouseEvent) => {
  //mouseEvent.stopPropagation();
});

mouseListenerElement.addEventListener("mouseup", (mouseEvent) => {
  //mouseEvent.stopPropagation();
});

function selectNewTarget({ x, y }: { x: number; y: number }) {
  currentlyCenteredCircle.cx.baseVal.value = x;
  currentlyCenteredCircle.cy.baseVal.value = y;
  zoomedInParabolaPath.setAttribute("transform", `translate(${-x}, ${2 - y})`);
}

function updateMouseCursor(mouseEvent: MouseEvent) {
  mouseListenerElement.style.cursor = mouseEvent.buttons
    ? /* Something was pressed.  Releasing the button will zoom in to the current point. */
      "grabbing"
    : /* Nothing is pressed.  Move the mouse to select a new point. */
      "grab";
}
(["mouseup", "mousedown", "mouseenter"] as const).forEach((eventName) => {
  mouseListenerElement.addEventListener(eventName, updateMouseCursor);
});

(["mouseenter", "mousemove", "mousedown"] as const).forEach((eventName) => {
  mouseListenerElement.addEventListener(eventName, (mouseEvent) => {
    if (mouseEvent.buttons) {
      selectNewTarget(mouseToCircle(mouseEvent));
    }
  });
});

/**
 * A tangent line is just a line that touches a function at a point, and has the same slope as the function at that point.
 * The derivative of a function is the slope of the tangent line at each point.
 *
 * This would make a great graphic.  A simple animation.  Start with the 2-x*x picture.  Draw the line moving from one point to the next, back and forth,
 * at a comfortable speed to stare at.  Keep the default ease in and out on both sides.
 *
 * Maybe a summary for the derivate section?  Or where I'm already discussing something related.
 */
