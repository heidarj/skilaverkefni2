function ColorpickerCanvas(canvasElement, color) {
    var _this = this;

    this.canvas = canvasElement;
    this.context2d = this.canvas.getContext('2d');
    this.color = color;
    this.isMouseDown = false;
    this.value;

    this.canvas.height = 100;
    this.canvas.width = 255;

    this.gradient = this.context2d.createLinearGradient(0,0,255,0);

    this.gradient.addColorStop(0, "transparent");
    this.gradient.addColorStop(1, "#f00");

    this.context2d.fillStyle = this.gradient;
    this.context2d.fillRect(0,0,255,100)

    this.crosshair = new Crosshair(this.context2d);

    this.updateselection = function(x,y) {
        this.value = this.context2d.getImageData(x, y,1,1);
        this.crosshair.x = x;
        this.crosshair.y = y;
        this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context2d.fillStyle = this.gradient;
        this.context2d.fillRect(0,0,255,100)
        this.crosshair.render();
        this.canvas.dispatchEvent(this.selectionchanged)
    }

    this.canvas.onmousemove =  event => {
        if (event.buttons == 1) {
            _this.updateselection(event.offsetX, event.offsetY)
        }
    }

    this.canvas.onclick =  event => {
        if (event.buttons == 1) {
            _this.updateselection(event.offsetX, event.offsetY)
        }
    }

    this.selectionchanged = new CustomEvent("selectionchanged", {
        detail: this,
        bubbles : true
    });

    this.selectionchanged.initEvent('selectionchanged', true, true);
}

function Crosshair(context2d, x, y) {
    this.context2d = context2d;

    this.x = x ? x : 0;
    this.y = y ? y : 0;

    this.render = function () {
        this.context2d.beginPath();
        this.context2d.lineWidth = 1;
        this.context2d.strokeStyle = "#fff";
        this.context2d.moveTo((this.x + 5), this.y);
        this.context2d.lineTo((this.x - 5), this.y);
        this.context2d.moveTo(this.x, (this.y + 5));
        this.context2d.lineTo(this.x, (this.y - 5));
        this.context2d.stroke();
        this.context2d.closePath();
    }

}