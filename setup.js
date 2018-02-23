    // get the canvas and drawing context
var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');

c.width = document.getElementById("canvasContainer").clientWidth;

var redoBtn = document.getElementById("redo");

var strokeR = document.getElementById("strokeR");
var strokeG = document.getElementById("strokeG");
var strokeB = document.getElementById("strokeB");
var strokeA = document.getElementById("strokeA");

var fillR = document.getElementById("fillR");
var fillG = document.getElementById("fillG");
var fillB = document.getElementById("fillB");
var fillA = document.getElementById("fillA");

c.addEventListener('mousedown', start); 
c.addEventListener('mouseup', end);
c.addEventListener('mousemove', updateMousePos)

window.requestAnimationFrame(drawFrame);

// define collection to store objects and history
var shapeObjects = [];
var shapeObjectsUndoHistory = [];

// define global variables
var mouseIsDown = false;
var shape = "square";
var start_x;
var start_y;
var mouse_x;
var mouse_y;
var getWidth = function() { return mouse_x - start_x;}
var getHeight = function() { return mouse_y - start_y; }
var getDistance = function(width, height) { return Math.sqrt(width * width + height * height); }

var getFill = function() {
    return document.getElementById("chkFill").checked ? rgba(fillR.value,fillG.value,fillB.value,fillA.value) : rgba(0,0,0,0)
}

function updateFill() {
    document.getElementById("SVGfill").style.color = getFill();
}

function updateStroke() {
    document.getElementById("SVGstroke").style.color = rgba(strokeR.value,strokeG.value,strokeB.value,strokeA.value)
}

function rgba(r, g, b, a){
    return "rgb("+r+","+g+","+b+","+ ( a != null ? a : 1 ) +")";
}

function rgb(r, g, b) {
    return rgba(r,g,b)
}

function start(event)
{
    start_x = event.offsetX;
    start_y = event.offsetY;

    mouseIsDown = true;
}

function end(event)
{						
    shapeObjects.push(
        {
            "shape" : shape,
            "start_x" : start_x,
            "start_y" : start_y,
            "width" : event.offsetX - start_x, 
            "height" : event.offsetY - start_y,
            "stroke" : rgba(strokeR.value,strokeG.value,strokeB.value,strokeA.value),
            "fill" : getFill()
        }
    );
    
    shapeObjectsUndoHistory = [];

    mouseIsDown = false;
}

function updateMousePos(event) {
    mouse_x = event.offsetX;
    mouse_y = event.offsetY;
}

function updateSelectedShape(newShape) {
    shape = newShape;
    console.log(shape)
}

function drawFrame() {
    ctx.clearRect(0, 0, c.width, c.height);
    shapeObjects.forEach(
        shapeObject => {
            renderShape(shapeObject.shape, shapeObject.start_x, shapeObject.start_y, shapeObject.width, shapeObject.height, shapeObject.stroke, shapeObject.fill)
        }
    )

    if (mouseIsDown) {
        renderShape(shape, start_x, start_y, getWidth(), getHeight(), rgba(strokeR.value,strokeG.value,strokeB.value,strokeA.value))
    }
    window.requestAnimationFrame(drawFrame)
}

function clearCanvas() {
    shapeObjectsUndoHistory = shapeObjects;
    shapeObjects = [];
}

function undo() {
    if (shapeObjects.length > 0) {
        shapeObjectsUndoHistory.push(shapeObjects.pop());
    }
}

function redo() {
    if (shapeObjectsUndoHistory.length > 0) {
        shapeObjects.push(shapeObjectsUndoHistory.pop());
    }
}

function renderShape(objshape, x, y, width, height, strokeColor, fillColor) {
    ctx.beginPath();
    switch (objshape) {
        case "square": ctx.rect(x, y, width, height);
        break;
        case "circle": ctx.arc(x, y, getDistance(width, height), 0, 2 * Math.PI);
        break;
        case "line": ctx.rect(x, y, width, height);
        break;
    }
    ctx.fillStyle = fillColor ? fillColor : "rgba(0,0,0,0)";
    
    ctx.strokeStyle = strokeColor ? strokeColor : "rgba(0,0,0,1)";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}
