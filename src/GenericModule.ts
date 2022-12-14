import {modules, globalState, moduleChoices} from "./Globals"
import { el } from "../helpers";

export class GenericModule {
    constructor(
        public position: XY,
        public element: HTMLElement,
        public onscreen: boolean = false,
        public childrenModules: GenericModule[] = []
    ) {
        GenericModule.makeMovable(position, element);
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
        document.body.append(this.element);
        this.onscreen = true;
    }

    hide() {
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
        function scaleIMGMap(newPercent, imgmapAreas: HTMLAreaElement[]) {
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
