function ColorpickerCanvas(canvasElement, color) {
    this.canvas = canvasElement;
    this.context2d = this.canvas.getContext('2d');
    this.color = color;
    this.isMouseDown = false;
    this.value;

    this.canvas.height = 100;
    this.canvas.width = 255;

    this.crosshair = new Crosshair(this.context2d);

    this.updateselection = function(x,y) {
        this.value = this.context2d.getImageData(x, y);
        this.crosshair.x = x;
        this.crosshair.y = y;
        this.crosshair.render();
        dispatchEvent.target.dispatchEvent(this.selectionchanged)
    }

    this.canvas.onmousemove = function(e) {
        if (e.buttons == 1) {
            console.log(this)
        }
    }

    this.selectionchanged = new CustomEvent("selectionchanged", {
        detail: {
            color : this.value
        }
    });

    this.selectionchanged.initEvent('selectionchanged', true, true);
}

function Crosshair(context2d, x, y) {
    this.context2d = context2d;

    this.x = x ? x : 0;
    this.y = y ? y : 0;

    this.render = function () {
        context2d.beginPath();
        context2d.lineWidth = 1;
        context2d.strokeStyle = "#000";
        context2d.moveTo(this.x + 5, this.y);
        context2d.lineTo(this.x - 5, this.y);
        context2d.moveTo(this.x, this.y + 5);
        context2d.lineTo(this.x, this.y - 5);
        context2d.stroke();
        context2d.closePath();
    }

}