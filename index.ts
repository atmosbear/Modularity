function el(id: string): HTMLElement {
    return document.getElementById(id)!
}


let catimg = "https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=8"

type XY = { x: number, y: number }

function styleModule(position: XY, element: HTMLElement) {
    Object.assign(element.style, { top: position.y + "px", left: position.x + "px", position: "absolute" })
}

class IMGModule {
    constructor(
        public position: XY,
        public imgsrc: string,
        public element: HTMLImageElement = document.createElement("img")
    ) {
        styleModule(position, element)
        this.element.src = imgsrc
    }

    move(newPos: XY) {
        this.position.y = newPos.x
        this.position.x = newPos.y
        this.element.style.top = this.position.y + "px"
        this.element.style.left = this.position.x + "px"
    }
}

function addModuleToScreen(what: any) { document.body.append(what.element); console.log(what.element) }
let a = new IMGModule({ x: 100, y: 300 }, catimg)
addModuleToScreen(a)
a.move({x: 30, y: 20})
a.move({x: -300, y: -100})