function el(id: string): HTMLElement {
    return document.getElementById(id)!
}

let catimg = "https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=8"

type XY = { x: number, y: number }


function GlobalState(activeTool: string) {
    return { activeTool, circleDialogCenterLocation: { x: 0, y: 0 } }
}
let globalState = GlobalState("Image")

class GenericModule {
    constructor(
        public position: XY,
        public element: HTMLElement,
        public onscreen: boolean = false,
        public childrenModules: GenericModule[] = []
    ) {
        GenericModule.makeMovable(position, element)
        modules.push(this)
    }
    static makeMovable(position: XY, element: HTMLElement) {
        Object.assign(element.style, { top: position.y + "px", left: position.x + "px", position: "absolute" })
    }

    getSize(): XY { //@ts-ignore-error
        return { x: this.element.width, y: this.element.height }
    }

    moveTo(newPos: XY) {
        this.position.y = newPos.y
        this.position.x = newPos.x
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

class ImageModule extends GenericModule {
    constructor(
        public position: XY,
        public imgsrc: string,
        public element: HTMLImageElement = document.createElement("img"),
        public size?: XY
    ) {
        super(position, element)
        this.element.src = imgsrc
        this.size = { x: this.element.width, y: this.element.height }
        console.log(this.element.width)
    }

    changeImageSize(newSize: XY) {
        this.size = newSize
        this.element.width = newSize.x
        this.element.height = newSize.y
    }
}

class CircleDialog extends GenericModule {
    constructor(
        public choices = moduleChoices,
        public element: HTMLElement = el("circle-dialog-img")
    ) {
        super(globalState.circleDialogCenterLocation, element)
        let a = el("area-1") as HTMLAreaElement
        function scaleIMGMap(newPercent, imgmapAreas: HTMLAreaElement[]) {
            let scalar = newPercent
            imgmapAreas.forEach((areaElement) => {
                let coords = areaElement.coords.split(",")
                let newCoords: string[] = []
                coords.forEach(coord => {
                    newCoords.push(((Math.round(Number(coord) * scalar)).toString()))
                })
                areaElement.coords = newCoords.join(",")
                // return newCoords
            })
            let e = element as HTMLImageElement
            e.width = scalar * e.width
            // e.height = scalar * e.height
            // element.style.width = scalar * Number(element.style.width.replace("px", "")) + "px"
            // element.style.height = scalar * Number(element.style.height.replace("px", "")) + "px"
        }
        let areas = [
            el("area-1"),
            el("area-2"),
            el("area-3"),
            el("area-4"),
            el("area-5"),
            el("area-6")
        ] as HTMLAreaElement[]
        function areaClicked(et: EventTarget, circleDialog: CircleDialog) {
            let target = et as HTMLElement
            if (target.id === "area-1") {
                let im = new ImageModule(globalState.circleDialogCenterLocation, "empty")
                im.show()
                circleDialog.hide()
            } if (target.id === "area-2") {

            } if (target.id === "area-3") {

            } if (target.id === "area-4") {

            } if (target.id === "area-5") {

            } if (target.id === "area-6") {
                let im = new ImageModule(globalState.circleDialogCenterLocation, "empty")
                im.show()
                circleDialog.hide()
            }
        }
        areas.forEach(area => {
            area.onclick = (e) => {
                e.preventDefault();
                areaClicked(e.target!, this)
            }
        })
        let newCoords = scaleIMGMap(0.2, areas)
        // Object.assign(el("circle-dialog-map").style, { backgroundColor: "orange", width: "100px", height: "100px" })
        // Object.assign(this.element.style, {width: "2rem", height: "2rem", borderRadius: "50%", backgroundColor: themeColors.circleDialogColor})
        // let sectionArcLength = 360 / choices.length
    }
}

window.onmousedown = (e: MouseEvent) => {
    console.log(e.button);
    if (e.button === 1) { // middle mouse button
        e.preventDefault();
        cDialog.show();
        cDialog.moveTo({ x: e.clientX - cDialog.getSize().x / 2, y: e.clientY - cDialog.getSize().y / 2 })
    }
}

let modules: GenericModule[] = []
let moduleChoices = ["Image Module", "Text Module", "Generic/Container Module"]
let themeColors = { circleDialogColor: "lightgray" }
let cDialog = new CircleDialog()
cDialog.hide()

// let a = new ImageModule({ x: 100, y: 300 }, catimg)
// a.show()
// a.moveTo({ x: 30, y: 20 })
// // a.moveTo({ x: -300, y: -100 })
// a.changeImageSize({ x: 40, y: 50 })
// a.element.onclick = () => { a.moveTo({ x: 3, y: 200 }) }