function el(id: string): HTMLElement {
    return document.getElementById(id)!
}

type XY = {
    x: number,
    y: number
}

class Module {
    constructor (
        public position: XY 
    ) {}
}

class TextModule extends Module {
    constructor(position: XY) {
        super(position)
    }
}

class ImageModule extends Module {
    constructor(position: XY, public imagesrc: string) {
        super(position)
    }
}

let img = new ImageModule({x: 10, y: 10}, "hi")
console.log(img.imagesrc)
