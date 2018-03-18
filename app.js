var canvas;
var drawingContext;
var canvasContainer;

var colorSelector;

var initMousePos;
var mousetravel;
var canvasObjects = [];
var undoHistory = [];
var colorType;
var strokeColor = "black";
var fillColor = "transparent";
var lineWidth;

var mouseIsDown = false;

var shape = 'square';

var currentObject;

canvasContainer = document.getElementById('canvasContainer');
canvas = document.getElementById('canvas');
drawingContext = canvas.getContext('2d');

colorSelector = document.getElementById('colorSelector');

lineWidth = document.getElementById('lineWidth');

var colorPickerRed;

/*
    Document loaded
*/
window.addEventListener('load', event => {

    // resize canvas to fit screen
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;

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
            colorType = this.id;
        }
    });

    document.querySelectorAll('.color').forEach(color => {
        color.onclick = function () {
            switch (colorType) {
                case 'fill':
                    fillColor = this.id;
                    document.documentElement.style.setProperty("--fillColor", this.id);
                    break;
                case 'stroke':
                    strokeColor = this.id;
                    document.documentElement.style.setProperty("--strokeColor", this.id);
                    break;
            }
            colorSelector.style.display = "none";
        }
    });

    document.querySelectorAll('.lineWidthChange').forEach(button => {
        button.onclick = function () {
            switch (this.id) {
                case 'plus':
                    lineWidth.value++;
                    break;
                case 'minus':
                    lineWidth.value--;
                    break;
            }
        }
    });

    document.getElementById('clear').addEventListener("click", event => {
        if (canvasObjects.length > 0) {
            undoHistory = canvasObjects;
            canvasObjects = [];
        }
    })

    document.getElementById('undo').addEventListener("click", event => {
        if (canvasObjects.length > 0) {
            undoHistory.push(canvasObjects.pop());
        } else if (canvasObjects.length == 0 && undoHistory.length > 0) {
            canvasObjects = undoHistory;
            undoHistory = [];
        }
    })

    document.getElementById('redo').addEventListener("click", event => {
        if (undoHistory.length > 0) {
            canvasObjects.push(undoHistory.pop());
        }
    })

    colorPickerRed = new ColorpickerCanvas(document.getElementById('colorPickerRed'), "red");

    // start drawing
    window.requestAnimationFrame(renderObjects);
});

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
    switch (shape) {
        case "square":
            currentObject = new square(event.offsetX, event.offsetY, event.offsetX, event.offsetY, strokeColor, fillColor, lineWidth.value);
            break;
        case "circle":
            currentObject = new circle(event.offsetX, event.offsetY, event.offsetX, event.offsetY, strokeColor, fillColor, lineWidth.value);
            break;
        case "line":
            currentObject = new line(event.offsetX, event.offsetY, event.offsetX, event.offsetY, strokeColor, fillColor, lineWidth.value);
            break;
        case "pen":
            currentObject = new pen(event.offsetX, event.offsetY, [], strokeColor, lineWidth.value);
            break;
    }

    mousetravel = [];
    mouseIsDown = true;
});

/*
    Mouse move
*/
canvas.addEventListener('mousemove', event => {

    if (currentObject) {
        currentObject.updateSize(event.offsetX, event.offsetY)
    }
});


/*
    Mouse up
*/
canvas.addEventListener('mouseup', event => {
    if (currentObject && (currentObject.x2 != null || currentObject.path)) {
        canvasObjects.push(currentObject);
    }

    currentObject = null;
});

var renderObjects = function () {
    drawingContext.clearRect(0, 0, canvas.width, canvas.height)
    canvasObjects.forEach(obj => {
        obj.render();
    });
    // If there is a object being drawn render it
    if (currentObject) {
        currentObject.render();
    }
    window.requestAnimationFrame(renderObjects);
}

function getDistance(a, b) {
    return Math.sqrt(a * a + b * b);
}


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