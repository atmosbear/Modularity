import { modules, globalState, moduleChoices } from "./Globals"
import { el } from "../helpers";

export class GenericModule {
    constructor(
        public position: XY,
        public element: HTMLElement,
        public onscreen: boolean = false,
        public childrenModules: GenericModule[] = [],
    ) {
            GenericModule.makeMovable(position, element); // there's a hacky error here, but it still works. added to issues on GitHub
            modules.push(this);
            this.element.onmousemove = (e) => {
                if (globalState.mouseIsDown) {
                    this.moveTo({ x: e.clientX - this.getSize().x / 2, y: e.clientY - this.getSize().y / 2 });
                }
            };
    }
    static makeMovable(position: XY, element: HTMLElement) {
        Object.assign(element.style, { top: position.y + "px", left: position.x + "px", position: "absolute" });
    }

    getSize(): XY { // @ts-ignore-error
        return { x: this.element.width, y: this.element.height };
    }

    moveTo(newPos: XY) {
        this.position.y = newPos.y;
        this.position.x = newPos.x;
        this.element.style.top = this.position.y + "px";
        this.element.style.left = this.position.x + "px";
    }

    show() {
        // this.element.style.display = this.usualDisplayState
        document.body.append(this.element);
        this.onscreen = true;
    }

    hide() {
        // this.usualDisplayState = this.element.style.display
        // this.element.style.display = "none"
        document.body.removeChild(this.element);
        this.onscreen = false;
    }
}
export class TextModule extends GenericModule {
    constructor(
        public position: XY,
        public element: HTMLDivElement = document.createElement("div")
    ) {
        super(position, element);
    }
}
export class ImageModule extends GenericModule {
    constructor(
        public position: XY,
        public imgsrc: string,
        public element: HTMLImageElement = document.createElement("img"),
        public size?: XY
    ) {
        super(position, element);
        this.element.src = imgsrc;
        this.size = { x: this.element.width, y: this.element.height };
        console.log(this.element.width);
    }

    changeImageSize(newSize: XY) {
        this.size = newSize;
        this.element.width = newSize.x;
        this.element.height = newSize.y;
    }
}
export class CircleDialog extends GenericModule {
    constructor(
        public choices = moduleChoices,
        public element: HTMLElement = el("circle-dialog-img")
    ) {
        super(globalState.circleDialogCenterLocation, element);
        let a = el("area-1") as HTMLAreaElement;
        function scaleIMGMap(newPercent: number, imgmapAreas: HTMLAreaElement[]) {
            let scalar = newPercent;
            imgmapAreas.forEach((areaElement) => {
                let coords = areaElement.coords.split(",");
                let newCoords: string[] = [];
                coords.forEach(coord => {
                    newCoords.push(((Math.round(Number(coord) * scalar)).toString()));
                });
                areaElement.coords = newCoords.join(",");
            });
            let e = element as HTMLImageElement;
            e.width = scalar * e.width;
        }
        let areas = [
            el("area-1"),
            el("area-2"),
            el("area-3"),
            el("area-4"),
            el("area-5"),
            el("area-6")
        ] as HTMLAreaElement[];
        function areaClicked(et: EventTarget, circleDialog: CircleDialog) {
            let target = et as HTMLElement;
            if (target.id === "area-1") {
                let im = new ImageModule(globalState.circleDialogCenterLocation, "empty");
                im.show();
                circleDialog.hide();
            } if (target.id === "area-2") {
                let table = new TableModule(globalState.circleDialogCenterLocation);
                table.show();
                circleDialog.hide();
            } if (target.id === "area-3") {
            } if (target.id === "area-4") {
            } if (target.id === "area-5") {
            } if (target.id === "area-6") {
                let txt = new TextModule(globalState.circleDialogCenterLocation);
                txt.show();
                txt.element.innerText = "Unedited text module";
                circleDialog.hide();
            }
        }
        areas.forEach(area => {
            area.onclick = (e) => {
                e.preventDefault();
                areaClicked(e.target!, this);
            };
        });
        let newCoords = scaleIMGMap(0.2, areas);
    }
}

class TableCellModule extends GenericModule {
    constructor(position: XY, public coords: XY) {
        super(position, document.createElement("textinput"))
    }
}

export class TableModule extends GenericModule {
    constructor(position: XY, public rowCols: XY = { x: 2, y: 1 }) {
        super(position, document.createElement("div"))
        for (let row = 0; row < rowCols.x; row++) {
            for (let col = 0; col < rowCols.y; col++) {
                this.childrenModules.push(new TableCellModule(position, { x: row, y: col }))
            }
        }
    }
}