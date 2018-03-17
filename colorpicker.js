function colorpicker (idRed, idBlue, idGreen, idAlpha) {
    this.red = {
        canvas : document.getElementById(idRed),
        drawingContext : red.canvas.getContext('2d')
    }

    this.green = {
        canvas : document.getElementById(idGreen),
        drawingContext : canvas.getContext('2d')
    }

    this.blue = {
        canvas : document.getElementById(idBlue),
        drawingContext : canvas.getContext('2d')
    }
}