# Overview

For #SoME3
https://3blue1brown.substack.com/p/some3-begins

I have some ideas I'd like to put into a document.

[This document](https://tradeideasphilip.github.io/divide-by-zero/) will become my final presentation.
It's a work in progress.
The parts near the top are pretty close to complete.
My notes to myself have a yellow background.
‼️ means that I plan to add a picture.

Some pictures require programming.
Mostly it's just screenshots and static SVG.
But there's currently one animation that includes user interaction.

The backgrounds for my pictures come from Desmos.
This was the quickest, easiest way to graph a function.
And most of the pictures include a hyperlink back to the original Desmos graph, so the user can explore further without me.

I added my own annotations using SVG.
It was easy to scale the SVG so my annotations would match the original graph.
And I have the option to animate any SVGs.

The words seem pretty close to what I want.
I've been cleaning them up as I add pictures.
The pictures will take some time.
The animation took a lot longer than I expected.

# Problem

In Desmos I'm having trouble showing undefined points.
https://cl.desmos.com/t/in-the-grarh-ui-show-undefined-points/3904/2
If I drag my mouse, Desmos will show the correct value at each place, including "(0, undefined)" where x=0.
But that's easy to miss.
Normally you'd draw a big open circle at that point.
I've tried a few things and nothing has worked well in Desmos.

## Parabolas in SVG

I wasn't having much luck with other approaches, so I decided to draw some things in SVG.
SVG gives high quality results.
And it knows how to draw parabolas.

The problem is that SVG uses a different format for specifying parabolas than we use in algebra and calculus.
I couldn't find a good reference on the subject, so here's what I discovered by trial and error.

<svg
  style="height: 400px; width: 400px; background-color: antiquewhite"
  viewBox="-5 -5 10 10"
  xmlns="http://www.w3.org/2000/svg"
  stroke-width="0.1"
  transform="scale(1 -1)">
<g id="grid" stroke-width="0.05" fill="none" stroke="lightgray">
<path d="M -5,-4 H 5"></path>
<path d="M -5,-3 H 5"></path>
<path d="M -5,-2 H 5"></path>
<path d="M -5,-1 H 5"></path>
<path d="M -5,1 H 5"></path>
<path d="M -5,2 H 5"></path>
<path d="M -5,3 H 5"></path>
<path d="M -5,4 H 5"></path>
<path d="M -4,-5 V 5"></path>
<path d="M -3,-5 V 5"></path>
<path d="M -2,-5 V 5"></path>
<path d="M -1,-5 V 5"></path>
<path d="M 1,-5 V 5"></path>
<path d="M 2,-5 V 5"></path>
<path d="M 3,-5 V 5"></path>
<path d="M 4,-5 V 5"></path>
<path stroke="black" d="M -5,0 L 5,0 M 0,-5 0,5"></path>
</g>
<g fill="orange">
<circle id="startingPoint" cx="-2" cy="4" r="0.2"></circle>
<circle id="endingPoint" cx="2" cy="4" r="0.2"></circle>
<circle id="controlPoint" cx="0" cy="-4" r="0.2" fill="violet"></circle>
</g>
<g id="tangentLines" fill="none" stroke="blue">
<path d="M -3,8 L 1,-8"><!--  y = -4x - 4  --></path>
<path d="M 3,8 L -1,-8"><!--  y = 4x - 4  --></path>
</g>
<path
    id="parabola"
    fill="none"
    stroke="lime"
    d="M -2,4 Q 0,-4 2,4">
</path>
</svg>

[Sample SVG Graphic](./parabola.svg)

I have to specify a starting and ending point.
These are shown here as orange circles.
In the real presentation I will put these at the edge of the image, or slightly past the edge.
In this example I put all the points well inside the image, to help me find any problems.

Finally I need a _control point_, shown here as a violet circle.
I had to do a little math to compute that, but not much.
I need to draw a line that goes through the starting point and is tangent to the parabola.
(That requires very simple calculus, just the derivative of the parabola.)
And a second tangent line through the ending point.
Where those two lines cross, that's the control point.

`<path id="parabola" fill="none" stroke="lime" d="M -2,4 Q 0,-4 2,4"></path>` draws the actual parabola.
Notice the three sets of coordinates describing the start, control, and end points.
The `Q` means "quadratic."
See the source code for more details.

Of course I'm not going to draw the circles or tangent lines in my final presentation.
Those only exist as math behind the scenes.

GitHub stripped the `<svg>` tags from my markdown.
So I will still need to make my own HTML file for my presentation.
That will also allow me to add some simple animations, and possibly some user interaction.
