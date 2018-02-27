function clearCanvas() {
    undoClear = shapeObjects;
    shapeObjects = [];
}

function undo() {
    if (shapeObjects.length > 0) {
        shapeObjectsUndoHistory.push(shapeObjects.pop());
        redoBtn.disabled = false
    }
    else if (shapeObjects.length == 0 && undoClear) {
        shapeObjects = undoClear;
        undoClear = [];
    }
}

function redo() {
    if (shapeObjectsUndoHistory.length > 0) {
        shapeObjects.push(shapeObjectsUndoHistory.pop());
        if (shapeObjectsUndoHistory.length == 0) {
            redoBtn.disabled = true
        }
    }
}

function renderShape(objshape, x, y, x2, y2, strokeColor, fillColor) {
    ctx.beginPath();
    switch (objshape) {
        case "square": ctx.rect(x, y, x2 - x, y2 - y);
        break;
        case "circle": ctx.arc(x, y, getDistance(x2 - x, y2 - y), 0, 2 * Math.PI);
        break;
        case "line": ctx.moveTo(x, y); ctx.lineTo(x2, y2);
        break;
    }
    ctx.fillStyle = fillColor ? fillColor : "rgba(0,0,0,0)";
    
    ctx.strokeStyle = strokeColor ? strokeColor : "rgba(0,0,0,1)";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function updateMousePos(event) {
    mouse_x = event.offsetX;
    mouse_y = event.offsetY;
}

function updateSelectedShape(newShape) {
    shape = newShape;
}

var getWidth = function() { return mouse_x - start_x;}
var getHeight = function() { return mouse_y - start_y; }
var getDistance = function(width, height) { return Math.sqrt(width * width + height * height); }

var getFill = function() {
    return document.getElementById("chkFill").checked ? rgba(fillR.value,fillG.value,fillB.value,fillA.value) : rgba(0,0,0,0)
}

var getStroke = function() {
    return rgba(strokeR.value,strokeG.value,strokeB.value,strokeA.value)
}

function updateFill() {
    document.getElementById("SVGfill").style.color = getFill();
}

function updateStroke() {
    document.getElementById("SVGstroke").style.color = getStroke();
}

function rgba(r, g, b, a){
    return "rgb("+r+","+g+","+b+","+ ( a != null ? a : 1 ) +")";
}

function rgb(r, g, b) {
    return rgba(r,g,b)
}