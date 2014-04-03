var cube,
    axisMatching = {        /* Matching between the translation axis of the screen, and the matching rotation axis of the cube (x, y and z) */
        screenX: {
            cubeRotationAxis: 'y',
            cubeRotationDirection: 1
        },
        screenY: {
            cubeRotationAxis: 'x',
            cubeRotationDirection: -1
        }
    },
    differenceX = {
        absolute: null,
        relative: null
    },
    differenceY = {
        absolute: null,
        relative: null
    },
    cubeRotations = [       /* Information about the rotations applied on the cube : axis, angle */
        {x: 5},
        {y: 10}
    ],
    userInput = {
        lockedAxis: null,       /* X, Y or null if there is no locked axis */
        pointerDownAt: {        /* Coordinates of the first point hitted by the user on the screen */
            x: null,
            y: null
        }
    };


/*
 * Convert a translation made by the mouse cursor into a rotation to apply to the cube.
 * @distance distance in pixels
 * @return angle in degrees
 */
function convertTranslationInRotation(distance) {
    'use strict';
    
    var speedMultiplicator = 1.3;
    
    return distance * 90 * speedMultiplicator / cube.clientHeight;
}


/*
 * Update the cube properties.
 * @angleAdditionalRX angle in degrees
 * @angleAdditionalRY angle in degrees
 */
function moveCube(angleAdditionalRX, angleAdditionalRY) {
    'use strict';
    
    //console.log('angleAdditionalRX=' + angleAdditionalRX);
    //console.log('angleAdditionalRY=' + angleAdditionalRY);
    
    cube.setAttribute(
        'style',
        '-webkit-transform: rotateX(' + angleAdditionalRX + 'deg) rotateY(' + angleAdditionalRY + 'deg);transform: rotateX(' + angleAdditionalRX + 'deg) rotateY(' + angleAdditionalRY + 'deg);'
    );
}


/*
 * Recalculate some values when resizing the browser.
 * Needed by you, dear web developers who will always try to resize your browser to see if the website is responsive ;-)
 */
function onResize(e) {
    'use strict';
    
}


function onMD(e) {
    'use strict';
    
    e.preventDefault();
    
    userInput = {
        lockedAxis: null,
        pointerDownAt: {
            x: e.clientX,
            y: e.clientY
        }
    };
}


function addCubeListeners(element) {
    'use strict';
    
    element.addEventListener('mousedown', onMD);
}


function removeCubeListeners(element) {
    'use strict';
    
    element.removeEventListener('mousedown', onMD);
}


function onMM(e) {
    'use strict';
    
    if (userInput.pointerDownAt.x !== null) {
        differenceX.relative = e.clientX - userInput.pointerDownAt.x;
        differenceX.absolute = Math.abs(differenceX.relative);
        differenceY.relative = userInput.pointerDownAt.y - e.clientY;
        differenceY.absolute = Math.abs(differenceY.relative);
        
        // Lock the axis after a minimum of 10px made by the pointer of the user (this minimum is a protection against errors)
        if (userInput.lockedAxis === null && (differenceX.absolute > 10 || differenceY.absolute > 10)) {
            if (differenceX.absolute > differenceY.absolute) {
                userInput.lockedAxis = 'x';
            } else {
                userInput.lockedAxis = 'y';
            }
        }
        
        if (userInput.lockedAxis === 'x') {
            moveCube(0, convertTranslationInRotation(differenceX.relative));
        } else if (userInput.lockedAxis === 'y') {
            moveCube(convertTranslationInRotation(differenceY.relative), 0);
        }
    }
}


function onMU(e) {
    'use strict';
    
    // Reset data from the first point registered after a 'pointer down' event
    userInput.lockedAxis = null;
    userInput.pointerDownAt.x = null;
    userInput.pointerDownAt.y = null;
    
    /*
     * Create a DIV element as a wrapper of the current cube,
     * in order to make it easier (for me !) to apply future rotations.
     */
    removeCubeListeners(cube);
    
    var cubeWrapper = document.createElement('div');
    cubeWrapper.setAttribute('class', 'cube');
    cubeWrapper.setAttribute('id', cube.getAttribute('id'));
    cube.removeAttribute('id');
    cubeWrapper.appendChild(cube.cloneNode(true));
    
    cube.parentNode.replaceChild(cubeWrapper, cube);
    
    cube = cubeWrapper;
    addCubeListeners(cube);
}


function onTD(e) {
    'use strict';
    
}


function onTM(e) {
    'use strict';
    
}


function onTU(e) {
    'use strict';
    
}


function setup() {
    'use strict';
    
    var body = document.getElementsByTagName('body')[0];
    cube = document.getElementById('cube');
    
    /*  Add mouse listeners */
    document.addEventListener('resize', onResize);
    body.addEventListener('mousemove', onMM);
    body.addEventListener('mouseup', onMU);
    
    /*  Add touch listeners */
    /*
    cube.addEventListener('touchstart', onTD);
    cube.addEventListener('touchmove', onTM);
    cube.addEventListener('touchend', onTU);
    */
    
    addCubeListeners(cube);
}


window.addEventListener('load', setup, false);