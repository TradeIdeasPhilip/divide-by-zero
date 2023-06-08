See https://tradeideasphilip.github.io/divide-by-zero/ for a newer version of this document.

# How to Divide By Zero

How to Divide By Zero, and other things you will learn in highschool calculus.

This will give you an **overview** of calculus.
This will _not_ replace your calculus textbook.
This will help you understand what you are learning in class, and why.

When I first learned calculus we focused on the mechanics of solving problems.
I wish we'd spent more time discussing **why** we were learning these things and what they meant.

## Intended Audience

- Someone who is about to start highschool calculus.
- Someone who studied calculus in highschool but doesn't know why.
- Someone who enjoys math and wants a different perspective.
- Me, back when I first started studying this subject.

# Prerequisites

You need to remember some algebra to understand this document.
Here is a quick refresher of the relevant facts.

You will need a lot more algebra when you are ready to actually solve calculus problems.

## Graphs of Functions

You should be familiar with graphs of functions.
Graphs are the easiest way to explain and understand calculus.

!!! Insert a simple graph here. Use the same tool that I use to make the graphs below. The words currently say left and bottom. Change that as needed. Most of the graphs described below include negative numbers. Maybe a graph of `2 - x²`

The numbers along the bottom of the graph are the inputs to the function.
These are often things that you can change.
We often call this "the x axis."

The numbers along the left side of the graph are the outputs from the function.
If you give your computer or calculator an input to a function, it can compute the output of that function.
This is "the y axis."
Or sometimes we say `f(x)` instead of y.

## Slope of a Line

Slope is defined as "rise over run."

!!! Insert a graph of `f(x) = 2x ÷ 3`. X should go from -1 to 3, and maybe a little further.

`f(x) = 2x ÷ 3`
In this case you can see that the function moves 2 units _up_ every time it moves 3 units _to the left_.
So the slope is `2 ÷ 3`, or ⅔.

!!! Repeat previous graph, but add a few triangles of width 3 and height 2.

You could also say that the function moves 4 units up every time it moves 6 units to the left.
And it moves 6 units up each time it moves 9 units to the left.
`2 ÷ 3`, `4 ÷ 6`, and `6 ÷ 9` all give you the same answer, ⅔.

!!! Repeat previous graph, but with one triangle of width 6 and one of length 9.

Notice that `g(x) = 2x ÷ 3 + 1` has different values than `f(x) = 2x ÷ 3`, but they both have lines with the same slope.

!!! Plot f(x) and g(x) on the same graph. Show triangles on both.

This graph shows a line going down, so it has a negative slope.

!!! Plot `f(x) = -2x ÷ 3`. Keep the same scale for all of the graphs in this section except this one. This one needs more space in the y < 0 area.

A horizontal line has a slope of 0.

!!! Plot `f(x) = 2`

If the line is vertical, its slope is _undefined_.

!!! Draw a vertical line at y=2 and nothing else. Keep the same size graph in all of these examples.

# Limits

Limits are a way to divide by zero and otherwise make infinity work for you.

In class you will learn a more precise definition of limits, and a lot of rules to help you compute them.
You might have to use limits directly to solve some problems.
Mostly you learn about limits so you can understand the definitions of derivatives and integrals, described below.

## Smoothness

Calculus focuses on smooth functions.

There is a formal definition of smoothness, but your intuition is right.  
Let's look at some examples.

`x²` (x squared) is smooth everywhere.

!!! Plot `x²`

`|x|` (the absolute value of x) is smooth everywhere except at x = 0.

!!! Plot `|x|`

`n!` (n factorial) is not continuous, so it can't be smooth.

!!! Plot `n!`

Smoothness is the opposite of a fractal.
No matter how much you zoom into a fractal you'll always find places where the function is not smooth.

!!! Example: See what I can find on the internet. Maybe the thing where each line segment gets replaces by a V. Show three of these next to each other. Each one should highlight a certain "detail" area, with an arrow pointing to the next picture. Maybe a number, like "9⨉", to make it clear that I'm zooming in. Can I animate the process of zooming in? Seems easy to write in JavaScript, and it will repeat.

!!! Title: How long is the coast of Britain. Lots of good pictures on google. 😀

If you zoom into a smooth function enough, it will eventually look like a straight line.
That makes the function very easy to predict.

!!! I'd like a simple animation here. On the left side is a function, maybe sin(x). One the right is a zoomed in area. Similar to the last two !!!'s. But, over time the highlighted area in the left panel gets smaller and smaller. And the contents of the right panel keep growing. On a loop. Can I insert an iframe here? An animated gif?

## Filling in Missing Values

Let's look at the function `f(x) = x³ ÷ x`.
Naively you might simplify that to `x²`.
That's almost right, but remember that you are not allowed to divide by zero.
So you should really say `x³ ÷ x = x²`, but only when `x ≠ 0`.
`x³ ÷ x` is _undefined_ when x = 0.

!!! Graph `x²`, but only when `x ≠ 0`. Presumably there's a hollow circle at x=0. Presumably I'm getting most of these charts from another tool, so I'll let it do it's thing. What's the name of that free on line graphing calculator? Desmos I think.

In simpler terms, `x³ ÷ x` looks a lot like `x²`, but it has a hole it it!

!!! Show graphs of Graph `x²`, but only when `x ≠ 0`, and normal `x²`. "normal" one is first / on the left (to match the text below.)

If you only had the second graph, you could probably guess what the first graph looks like!
You could fill in that missing value with anything you want, but only one value would make the function smooth.

Congratulations, you just computed a limit!

Calculus class will teach you when it is okay to use the complete version of the function, rather than the original version with the hole.

## Terminology

If you see delta and epsilon in a problem, it is probably talking about limits.
These are written with lowercase Greek letters: 𝛿 and 𝜺.

!!! I bet google has a great image of a delta-epsilon proof. Be sure to link back to the page I stole it from!

# Derivatives

## Definition

A derivate is a rate of change.

For example, lets say `f(x)` tells us the total number of cookies in your house at a given time.
Then the derivate of `f(x)` tells us how quickly you are eating those cookies or baking new ones.

!!! A graph. Y axis is labeled "cookies." X axis is labeled "time." A straight line is going down at a rate of 1 cookie per second. Avoid negative numbers.

This graph shows that the number of cookies goes down over time.
That means someone is eating your cookies!
The graph would go up if you baked or bought more cookies.

Also notice that `f(x)` is continuous and _smooth_.
That means that someone is eating a little bit of a cookie at a time, continuously.

Alternatively, what if whole cookies were disappearing at once?
Then the graph might look like this.

!!! Same scale and axes as as above. But we have a sequence of horizontal lines going down like a staircase. The lines will be in the same general position as in the previous graph. Like we took _samples_ from the first graph, then tried to fill in the remaining spaces with a horizontal line segment. Each segment has a closed circle on the left and an open circle on the right.

This function is _not_ smooth everywhere.
We can only talk about the derivative where it is smooth.
Where it is not smooth, we say the derivate is not defined.

## Derivate of a Line

Our cookie example is a straight line.
The derivative of a line is the slope of the line.
In this case someone is eating one cookie per minute.
The rate of change is -1 cookie per minute.

## Smaller Pieces

This example is a little more complicated.
You could say that the _average_ rate of change for the first 5 minutes is -1, just like the previous graph.
That's correct, but it's leaving out a lot of details.

!!! Draw a graph where the main line follows the four sections below. Also draw a lighter or dotted line showing a straight line that starts ands ends at the same place. That should have a slope of -1.

Let's break the graph into pieces.

- For the first minute the graph has a slope of 2, so the derivative in that section is 2.
- For the next two minutes the slope is -1, and so is the derivative.
- Then the graph jumps down by 5.
- For the last two minutes the slope is 0, and so is the derivate.

Here's a graph of the derivative.
Notice that the derivative is only defined where the original function is (a) defined, (b) continuous, and (c) smooth.

## Really Small Pieces

So, what's the derivative of x²?

!!! Draw a graph of x². x goes from -1 to 4. To save space y goes from -1 to 10. So the line will go off the top of the graph somewhere between x=3 and x=4. Label the x axis with an "x". Label the y axis with "y = x²".

You could say that the _average_ rate of change between 0 and 1 is 1.
And the average rate of change between 1 and 2 is 3.
If you keep going you'll get a graph like this for the derivative x².

!!! Keep the previous graph and add new lines in a different color. Draw straight lines connecting this series of points (-1, 1), (0,0), (1,1), (2,4), (3,9), (4,16). Add a second graph below the first. The x axis scales should line up perfectly. The y axis on the bottom should be labeled "y' = the derivative of x²". Fill in the values. These should each be horizontal segments with open circles on both sides.

But there's no reason to break things up that way.
What if you asked for the average every time x changes by ½?
Then the answers would look like this graph.

!!! Just like the previous pair of graphs, but draw twice as many points. x=0, x=0.5, x=1, x=1.5, etc.

As you look at smaller and smaller sections, you see more an more detail.
How small can we make the sections?

!!! Similar to previous two illustrations, but make the sections much smaller. Look at the result to decide how small to make these. It should still be obvious that these are separate segments, but, clearly getting closer to smooth.

As we get closer and closer to 0, the answer gets better and better.
What if we asked about a change of 0?
Every time x moves 0 units to the left, x² moves 0 units up.
And `0 ÷ 0` = _what?_

!!! Draw 2 graphs. On top, just x² without anything else. On the bottom draw the graph of 2x.

And that's why we learn limits before we learn derivatives.
When you work out the problem in class you'll eventually learn that the derivative of `x²` is `2x`, matching what we see on the graph.
But along the way to `2x` you'd see something (roughly) similar to `2x² ÷ x`.
Because you know limits you can simplify `2x² ÷ x` to `2x` without being afraid to divide by 0.

## Physics Examples

Derivatives are used a lot in physics. For example, if f(x) is the _position_ of your car at time x, then the derivative of f(x) will tell you the _speed_ you are going.

!!! Draw two charts, one on top of the other with matching scales for the x axes, as in the previous section. label the x axis for both "x = position". The y axis for the top graph is "y = distance (miles)", for the bottom graph "y = speed (miles/hour)". Mark the first part of the x axis "my neighborhood", the second part "surface roads", the third part "freeway," and the fourth part "surface roads," again. The position graph will be a little wavy, but definitely the slowest in the neighborhood and the fastest on the freeway. Draw light/thin lines on the top chart, like before, from the beginning to the end of each section. On the bottom chart show two different lines in different colors. One labeled average speed, and the other labeled speed.

Just like in the example above, you can talk about the average speed for your entire trip.
Or you can talk about the average speed for various parts of your trip.
You can get more precise answers if you look at smaller and smaller time intervals.
And, if you ask for the _exact_ speed at an _exact_ instant in time, that's the derivative.

Acceleration is the derivative of speed.
Electric current is the derivative of charge.
Etc.

## Interest Rates

Interest is money the bank puts into your your account.
Your account balance will change over time because the bank is adding money.

If `f(x)` represents your bank balance, then the derivate of `f(x)` says how quickly the bank is adding money.

Bankers often quote interest rates in different ways.
They might quote a rate for a year.
But they add money more than once a year, and the rate constantly changes.

Sometimes they talk about interest "compounding" yearly, quarterly, monthly, daily or continuously. ("APR" is banker-speak for "continuously.")
That's the same approximation that we did above.
The smaller the time span you look at, the closer you get to the ideal or continuous value.

There are more details, of course.
I'll leave those to your teacher.

## Terminology

The derivative of f(x) is often written as f'(x), pronounced "F prime of X."

The derivate of y is often written as dy / dx, pronounced "the derivate of y with respect to x."

# Integrals

When you see the ∫ symbol, that means to take the integral of a function.

## The Anti-Derivative

Integration and differentiation are inverses of each other.
If g(x) is an integral of f(x) then f(x) is the derivative of g(x).

That applies to all of the examples above.
E.g. Position is the integral of speed.

How did ships know their position before GPS was invented?
One way is called dead reckoning.
From time to time they would measure their speed.
They would multiply each speed measurement by the amount of time they were going that speed, then add all the values together.
That's the inverse of what we did in the derivative examples, above.

The more often they measured their speed, the more accurate their estimate would be.
If they could measure their speed constantly, they would know exactly where they were.

But that's tricky.
If they measure the speed constantly, they will have an infinite number of distances to add up.
And each distance is a speed times a time, and the times are all 0.
If you're not careful you'll get `∞ ⨉ 0`.
But by this time you'll be an expert at limits, so you will know how to get a real answer.

## Calculating the Anti-Derivative

How do you calculate an integral?

One option is to look at all of the rules for computing derivatives, and to invert each of them.
For example, we saw above that the derivative of `x²` is `2x`.
So any time you have to integrate `2x`, you can look that up in your list and say _an_ answer is `x²`.

_An_ answer.  
Remember, a derivative is just a fancy version of a slope, and more than one line can have the same slope.
So more than one function can have the same derivative.
So each function will have multiple anti-derivatives.

The short version is that you need to write `+ C` at the end of your answer.
So the integral of `2x` is `x² + C`.
Your teacher will take off a lot of points of you forget the `+ C`!

`C` is any number.
That means that `x²`, `x² + 2`, `x² + 3`, `x² + 3.1`, `x² + π`, `x² - 27`, etc., are all valid integrals of `2x`.

This method is nice because it gives you an exact answer.
However, this method can be difficult in some cases and impossible in others.

## Definite vs Indefinite Integrals

The previous section begs an important question.
Are you expecting a number or a formula for an answer?

If you see a problem like `∫ 2x dx`, that's called an _indefinite_ integral.
The answer should look like `x² + C`, as described above.

What if you wanted an exact value?
You can't just plug in a number for `x`.
Remember, `C` can be any number, so `x² + C` can be any number.
That's not very helpful!

Back to our boat example:
What if we add up all of our measurements and got a total of 10 miles?
That means the boat _moved_ 10 miles.
But that doesn't tell us the _position_ of the boat.
There could be two or more boats all going the same speed, but if they start at different positions they will end in different positions.
Crudely speaking, `C` corresponds to the initial position of the boat.

In practice, if you want an actual number from an integral, you will use what's called a _definite_ integral.
A _definite_ integral looks just like an _indefinite_ integral, except that the problem will specify a start value _and_ an end value.

In our boat example, you might ask how far did the boat move between 10am and 10:05.
In our `2x` example you might ask what's the integral of `2x` between `x = 3` and `x = 7`.
Those problems are both _definite_ integrals.

!!! Show examples of the symbol for a _definite_ integral.

If you know the _indefinite_ integral of a function, then it is trivial to compute a _definite_ integral of the same function.
You compute the _indefinite_ integral at the start and end values, and you subtract the second from the first.
What's the integral of `2x` between `x = 3` and `x = 7`?
Start with `x² + C`.
For the end value we get `7² + C` and for the start value we get `3² + C`.
So the answer will have to be `(7² + C) - (3² + C)`.
The `C`'s cancel out to give us `7² - 3²` or `49 - 9` or `40`.

## The Area Under the Curve

A different way to think about an integral is _the area under the curve_.

Same problem: What's the integral of `2x` between `x = 3` and `x = 7`?

Let's start by graphing `2x` and marking `x = 3` and `x = 7` on the same graph.
The area I've highlighted in green is the answer we want.
You could measure that with a ruler!
Or you could notice that it's a trapezoid, and Google "area of a trapezoid" if you don't remember that formula.
Or break it into a triangle and a rectangle if that's easier.

Notice that when the original function is below the x axis, we subtract that from the total area.

What if the function we are integrating is more complicated than a line?
Break it into smaller pieces.
Compute each piece separately then add them up.
Like we've been doing!

What if the function we are trying to integrate is a curve, not a set of line segments?
Break it into small pieces then add them up.
How small?
It depends how accurate you want your estimate to be.

But this method is not just for estimates.
If you take the _limit_ as the pieces get infinitely small, that will be the exact answer.

The formal definition of an integral involves an infinite sum.
And that's exactly what we did with the dead reckoning example, and with the area under the curve.

# Final Thoughts

Enjoy your studies. I'm just scratching the surface of what you will learn in class.

I am [Philip Smolen](https://github.com/TradeIdeasPhilip) writing [this](https://github.com/TradeIdeasPhilip/divide-by-zero) for the [Summer of Math Exposition 3](https://3blue1brown.substack.com/p/some3-begins) contest. #SoME3

Click on the images for attribution and other details.
