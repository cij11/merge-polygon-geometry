# Usage

Install the exercise by running `npm install` from the directory containing `package.json`.  
Run unit tests by running `npm test` from the directory containing `package.json`.

# Overview

Implement an alogrthim that merges a pair of input polygons.

## Excersise

Provide an implemention for the `mergePolygons()` function. 

Please avoid the use of existing polygon manipulation/merging libraries [such as this one](https://github.com/w8r/martinez) when completing this excersise. 

Your `mergePolygons()` function should:

- return a single polygon representing the merge result of input polygons
- should be a generalised, capable of merging input polygons with arbitrary geometry
- return `undefined` if invalid input arguments provided
- return `undefined` if no overlap detected between input polygons
- return `undefined` if either polygon is fully contained by the other

A polygon is defined as a collection of half-edge data structures, linked together to define the polygons boundary:

![polygon](/doc/polygon.jpg)

When input polygons overlap, `mergePolygons()` should correctly detect and process intersections between respective half-edges as they occour. When merged polygon returned by `mergePolygons()` should be encoded as a colllection of half-edges, as shown above. The expected merging behaviour is illustrated as:

![merge](/doc/merge.jpg)

Assume that input polygons are [simple polygons](https://en.wikipedia.org/wiki/Simple_polygon). Verify your solution by extending the test suite: `test/merge-polygons.spec.js`

### Bonus points

- Check the validity of input polygons before performing the merge operation (are invariants satisfied? do input polygons form closed loops? are half-edge pairs defined? etc)
- If either input polygon is detected to be a [complex polygon](https://en.wikipedia.org/wiki/Complex_polygon) the function returns `undefined`