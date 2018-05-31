# Positionizer

Set relative position to element from a referentiel element

 <div style="display:inline">
    <a target="_blank" title="build" href="https://travis-ci.org/Sylvain59650/positionizer"><img src="https://travis-ci.org/Sylvain59650/positionizer.png?branch=master" /></a>
    <a target="_blank" title="version" href="https://www.npmjs.com/package/positionizer"><img src="https://img.shields.io/npm/v/positionizer.svg" /></a>
    <a target="_blank" title="package" href="https://github.com/Sylvain59650/positionizer"><img src="https://img.shields.io/github/package-json/v/Sylvain59650/positionizer.svg" /></a>
    <a target="_blank" title="dependencies" href="https://david-dm.org/Sylvain59650/positionizer"><img src="https://img.shields.io/david/Sylvain59650/positionizer.svg" /></a>
    <a target="_blank" title="dependencies graph" href="http://npm.anvaka.com/#/view/2d/positionizer"><img src="https://img.shields.io/badge/dependencies-graph-blue.svg" /></a>
    <img src="https://img.shields.io/bundlephobia/min/positionizer.svg" />
    <img src="https://img.shields.io/badge/eslint-ok-blue.svg" />
    <a target="_blank" title="tests" href="https://sylvain59650.github.io/positionizer/"><img src="https://img.shields.io/badge/tests-passing-brightgreen.svg" /></a>
    <img src="https://img.shields.io/npm/l/positionizer.svg" />
    <img src="https://hits.dwyl.com/Sylvain59650/positionizer.svg" />
  </div>


 <div class="Note" style="color:orange;font-style:italic">
 
The lastest version of this document is available on [Github > positionizer](https://github.com/Sylvain59650/positionizer/blob/master/README.md)


</div>



## Installation
<code>

    npm install positionizer --save

OR

    yarn add positionizer --save
</code>

## Reference in browser

    <script src="node_modules/positionizer/distrib/positionizer.min.js"></script>

## usage

    Positionizer.setRelativePosition(refElement, floatingElement, placement, appendToBody, distX, distY);

where:

    refElement: the fixed element
    floatingElement: the element to be placed in relation to the reference element
    placement: relative position
        like :

            bottom-right
            bottom-left
            bottom
            top-right
            right-bottom
            bottom-right
            left-bottom
            left-top
            top-left
            top-center
            right
            left
            right-top
            top-right-outside
            top-left-outside
            bottom-left-outside
            bottom-right-outside
            bottom-right-inside
            bottom-left-inside
            bottom-inside
            top-right-inside
            top-left-inside
            top-inside
            left-inside
            right-inside

    appendToBody: boolean
    distX : horizontal distance between the 2 elements, default is 0.
    distY : vertical distance between the 2 elements, default is 0.
<img src="position.png" />

<a href="https://sylvain59650.github.io/positionizer/">API & Demo</a>