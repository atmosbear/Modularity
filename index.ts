function el(id: string): HTMLElement {
    return document.getElementById(id)!
}

let catimg = "https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=8"

type XY = { x: number, y: number }

function styleModule(position: XY, element: HTMLElement) {
    Object.assign(element.style, { top: position.y + "px", left: position.x + "px", position: "absolute" })
}

class GenericModule {
    constructor(
        public position: XY,
        public element: HTMLElement,
        public onscreen: boolean = false,
        public childrenModules: GenericModule[] = []
    ) {
        styleModule(position, element)
        modules.push(this)
    }

    moveTo(newPos: XY) {
        this.position.y = newPos.x
        this.position.x = newPos.y
        this.element.style.top = this.position.y + "px"
        this.element.style.left = this.position.x + "px"
    }

    show() {
        document.body.append(this.element);
        this.onscreen = true
    }

    hide() {
        document.body.removeChild(this.element)
        this.onscreen = false
    }
}

class ImageModule extends GenericModule  {
    constructor(
        public position: XY,
        public imgsrc: string,
        public element: HTMLImageElement = document.createElement("img")
    ) {
        super(position, element)
        this.element.src = imgsrc
    }
}

let modules: GenericModule[] = []
let a = new ImageModule({ x: 100, y: 300 }, catimg)
a.show()
a.moveTo({ x: 30, y: 20 })
a.moveTo({ x: -300, y: -100 })
a.element.onclick = () => {a.moveTo({x: 3, y: 200})}