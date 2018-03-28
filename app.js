/*
    Skilaverkefni 2
    Forritun - HR
    Heiðar Hólmberg Jónsson
    Verkefnið er live á  https://heidarj.github.io/skilaverkefni2/
*/


/*
    Define variables
*/

var canvas;
var drawingContext;
var canvasContainer;

var colorSelector;

var initMousePos;
var mousetravel;
var canvasObjects = [];
var undoHistory = [];

var lineWidth;

var mouseIsDown = false;

var shape = 'square';

var currentObject;


/*
    Get the sliders used in stroke and fill color selection
*/
var strokeR = document.getElementById("strokeSelectorRed");
var strokeG = document.getElementById("strokeSelectorGreen");
var strokeB = document.getElementById("strokeSelectorBlue");
var strokeA = document.getElementById("strokeSelectorAlpha");

var fillR = document.getElementById("fillSelectorRed");
var fillG = document.getElementById("fillSelectorGreen");
var fillB = document.getElementById("fillSelectorBlue");
var fillA = document.getElementById("fillSelectorAlpha");


/*
    Get other elements used in the app
*/
canvasContainer = document.getElementById('canvasContainer');
canvas = document.getElementById('canvas');
drawingContext = canvas.getContext('2d');

colorSelector = document.getElementById('colorSelector');

lineWidth = document.getElementById('lineWidth');


/*
    function which returns a css rgba string
*/
function rgba(r, g, b, a){
    return "rgb("+r+","+g+","+b+","+ ( a != null ? a : 1 ) +")";
}

/*
    Document loaded
*/
window.addEventListener('load', event => {
    // resize canvas to fit screen
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;

    // ask the browser to call the renderObjects function when the next frame is ready
    window.requestAnimationFrame(renderObjects);
});

// add onclick to tool select buttons
document.querySelectorAll('.toolSelect').forEach(button => {
    button.onclick = function () {
        shape = this.id;
    }
});

// add onClick to border and fill color select
document.querySelectorAll('.colorSelect').forEach(button => {
    button.onclick = function () {
        colorSelector.style.display = "inherit"
    }
});

/*
    add onClick to done button in the color select tool
*/
document.getElementById("colorSelectorDone").addEventListener('click', function(e) {
    colorSelector.style.display = "none"  
})

document.getElementById('clear').addEventListener("click", event => {
    if (canvasObjects.length > 0) {
        undoHistory = canvasObjects;
        canvasObjects = [];
    }
})


/*
    add onClick to undo button 
*/
document.getElementById('undo').addEventListener("click", event => {
    if (canvasObjects.length > 0) {
        undoHistory.push(canvasObjects.pop());
    } else if (canvasObjects.length == 0 && undoHistory.length > 0) {
        canvasObjects = undoHistory;
        undoHistory = [];
    }
})

/*
    add onClick to redo button
*/
document.getElementById('redo').addEventListener("click", event => {
    if (undoHistory.length > 0) {
        canvasObjects.push(undoHistory.pop());
    }
})

/*
    get all the stroke sliders and add an onInput function 
*/
document.querySelectorAll('.strokeSelector').forEach(slider => {
    slider.addEventListener('input', updateStroke)
})

function updateStroke() {
    document.body.style.setProperty('--strokeColor', rgba(strokeR.value, strokeG.value, strokeB.value, strokeA.value));
}

/*
    get all the fill sliders and add an onInput function 
*/
document.querySelectorAll('.fillSelector').forEach(slider => {
    slider.addEventListener('input', updateFill)
})


function updateFill() {
    document.body.style.setProperty('--fillColor', rgba(fillR.value, fillG.value, fillB.value, fillA.value));
}

/*
    Window resize
*/
window.addEventListener('resize', event => {
    // resize canvas to fit screen
    canvas.width = 0;
    canvas.height = 0;
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
});


/*
    Mouse down
*/
canvas.addEventListener('mousedown', event => {
    /*
        as soon as the mouse is down create a new object
    */
    switch (shape) {
        case "square":
            currentObject = new square(event.offsetX, event.offsetY, event.offsetX, event.offsetY, document.body.style.getPropertyValue("--strokeColor"), document.body.style.getPropertyValue("--fillColor"), lineWidth.value);
            break;
        case "circle":
            currentObject = new circle(event.offsetX, event.offsetY, event.offsetX, event.offsetY, document.body.style.getPropertyValue("--strokeColor"), document.body.style.getPropertyValue("--fillColor"), lineWidth.value);
            break;
        case "line":
            currentObject = new line(event.offsetX, event.offsetY, event.offsetX, event.offsetY, document.body.style.getPropertyValue("--strokeColor"), lineWidth.value);
            break;
        case "pen":
            currentObject = new pen(event.offsetX, event.offsetY, [], document.body.style.getPropertyValue("--strokeColor"), lineWidth.value);
            break;
    }

    mousetravel = [];
    mouseIsDown = true;
});

/*
    Mouse move
*/
canvas.addEventListener('mousemove', event => {
    /*
        check that there is a current object, so that we can update it's size as the mouse moves
    */
    if (currentObject) {
        currentObject.updateSize(event.offsetX, event.offsetY)
    }
});


/*
    Mouse up
*/
canvas.addEventListener('mouseup', event => {
    /*
        If there is a current object when the mouse is released, and it has either a size or path
    */
    if (currentObject && (currentObject.x2 != null || currentObject.path)) {
        // add the current object to a list of objects to be drawn every frame
        canvasObjects.push(currentObject);
    }
    /*
        reset the current object
    */
    currentObject = null;
});

/*
    function called every 'frame' to draw all the shapes
*/
var renderObjects = function () {
    /*
        start by clearing the screen
    */
    drawingContext.clearRect(0, 0, canvas.width, canvas.height)
    
    /*
        then render all the objects registered in the canvasObjects array
    */
    canvasObjects.forEach(obj => {
        obj.render();
    });
    // If the mouse is down and an currentObject exists, render it
    if (currentObject) {
        currentObject.render();
    }

    /*
        ask the browser to run this funcion again before the next frame
    */
    window.requestAnimationFrame(renderObjects);
}

/*
    pythagoras' theorem
*/
function getDistance(a, b) {
    return Math.sqrt(a * a + b * b);
}

/*
    Shape object class definitions
*/

function square(x, y, x2, y2, stroke, fill, lineWidth) {
    this.x = x;
    this.y = y;
    this.x2 = x2;
    this.y2 = y2;
    this.stroke = stroke ? stroke : "rgba(0,0,0,1)";
    this.fill = fill ? fill : "rgba(0,0,0,0)";
    this.lineWidth = parseInt(lineWidth) > 0 ? lineWidth : 1

    this.render = function () {
        drawingContext.beginPath();
        drawingContext.lineWidth = this.lineWidth;
        drawingContext.fillStyle = this.fill;
        drawingContext.strokeStyle = this.stroke;
        drawingContext.rect(this.x, this.y, this.x2 - this.x, this.y2 - this.y);
        drawingContext.fill();
        drawingContext.stroke();
        drawingContext.closePath();
    };

    this.updateSize = function (x2, y2) {
        this.x2 = x2;
        this.y2 = y2;
    }
}

function circle(x, y, x2, y2, stroke, fill, lineWidth) {
    this.x = x;
    this.y = y;
    this.x2 = x2;
    this.y2 = y2;
    this.stroke = stroke ? stroke : "rgba(0,0,0,1)";
    this.fill = fill ? fill : "rgba(0,0,0,0)";
    this.lineWidth = lineWidth ? lineWidth : 1;

    this.render = function () {
        drawingContext.beginPath();
        drawingContext.lineWidth = this.lineWidth;
        drawingContext.fillStyle = this.fill;
        drawingContext.strokeStyle = this.stroke;
        drawingContext.arc(this.x, this.y, getDistance(this.x2 - this.x, this.y2 - this.y), 0, 2 * Math.PI);
        drawingContext.fill();
        drawingContext.stroke();
        drawingContext.closePath();
    }

    this.updateSize = function (x2, y2) {
        this.x2 = x2;
        this.y2 = y2;
    }
}

function line(x, y, x2, y2, stroke, lineWidth) {
    this.x = x;
    this.y = y;
    this.x2 = x2;
    this.y2 = y2;
    this.stroke = stroke ? stroke : "rgba(0,0,0,1)";
    this.lineWidth = lineWidth ? lineWidth : 1;

    this.render = function () {
        drawingContext.beginPath();
        drawingContext.lineWidth = this.lineWidth;
        drawingContext.strokeStyle = this.stroke;
        drawingContext.moveTo(this.x, this.y);
        drawingContext.lineTo(this.x2, this.y2);
        drawingContext.stroke();
        drawingContext.closePath();
    }

    this.updateSize = function (x2, y2) {
        this.x2 = x2;
        this.y2 = y2;
    }
}

function pen(x, y, path, stroke, lineWidth) {
    this.x = x;
    this.y = y;
    this.path = path ? path : [];
    this.stroke = stroke ? stroke : "rgba(0,0,0,1)";
    this.lineWidth = lineWidth ? lineWidth : 1;

    this.render = function () {
        drawingContext.beginPath();
        drawingContext.lineWidth = this.lineWidth;
        drawingContext.strokeStyle = this.stroke;
        drawingContext.moveTo(this.x, this.y);
        this.path.forEach(pos => {
            drawingContext.lineTo(pos.x, pos.y)
        });
        drawingContext.stroke();
        drawingContext.closePath();
    }

    this.updateSize = function (x, y) {
        this.path.push({
            'x': x,
            'y': y
        })
    }
}