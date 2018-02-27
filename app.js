// get the canvas and drawing context
var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');

c.width = document.getElementById("canvasContainer").clientWidth;
c.height = document.getElementById("canvasContainer").clientHeight;

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
var undoClear = [];

// define global variables
var mouseIsDown = false;
var shape = "square";
var start_x;
var start_y;
var mouse_x;
var mouse_y;

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
            "x" : start_x,
            "y" : start_y,
            "x2" : event.offsetX, 
            "y2" : event.offsetY,
            "stroke" : getStroke(),
            "fill" : getFill()
        }
    );
    
    shapeObjectsUndoHistory = [];
    undoClear = [];

    mouseIsDown = false;
}

function drawFrame() {
    ctx.clearRect(0, 0, c.width, c.height);
    shapeObjects.forEach(
        shapeObject => {
            renderShape(shapeObject.shape, shapeObject.x, shapeObject.y, shapeObject.x2, shapeObject.y2, shapeObject.stroke, shapeObject.fill)
        }
    )

    if (mouseIsDown) {
        renderShape(shape, start_x, start_y, mouse_x, mouse_y, getStroke(), getFill())
    }
    window.requestAnimationFrame(drawFrame)
}