// get the canvas and drawing context
var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');
var canvasContainer = document.getElementById("canvasContainer");

c.width = canvasContainer.clientWidth;
c.height = canvasContainer.clientHeight;

var strokeWidth = document.getElementById("strokeWidth");

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

document.getElementById('save').addEventListener('click', function() {
    this.href = c.toDataURL();
    this.download = "masterpiece.png";
}, false);

window.onresize = event => {
    c.width = canvasContainer.clientWidth;
    c.height = canvasContainer.clientHeight;
}

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
var path = [];

function start(event)
{
    start_x = event.offsetX;
    start_y = event.offsetY;

    mouseIsDown = true;

    if (shape == "path") {
        path = [];
        path.push({ "x" : start_x, "y" : start_y })
    }

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
                "fill" : getFill(),
                "lineWidth" : parseInt(strokeWidth.value) > 0 ? strokeWidth.value : 1,
                "path" : path
            }
        );

    shapeObjectsUndoHistory = [];
    undoClear = [];
    path = [];
    mouseIsDown = false;
}

function drawFrame() {
    ctx.clearRect(0, 0, c.width, c.height);
    shapeObjects.forEach(
        shapeObject => {
            renderShape(shapeObject.shape, shapeObject.x, shapeObject.y, shapeObject.x2, shapeObject.y2, shapeObject.stroke, shapeObject.fill, shapeObject.lineWidth, shapeObject.path)
        }
    )

    if (mouseIsDown) {
        renderShape(shape, start_x, start_y, mouse_x, mouse_y, getStroke(), getFill(), parseInt(strokeWidth.value) > 0 ? strokeWidth.value : 1, path)
    }
    window.requestAnimationFrame(drawFrame)
}