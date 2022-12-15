import { modules, globalState, moduleChoices, themeColors } from "./Globals"
import { el } from "../helpers";

export class GenericModule {
    constructor(
        public position: XY,
        public element: HTMLElement,
        public movable: boolean = true,
        public shouldHaveContainer: boolean = false,
        public containerElement?: GenericModule,
        public onscreen: boolean = false,
        public childrenModules: GenericModule[] = [],
    ) {
        if (!containerElement && shouldHaveContainer) {
            let containerPosX = position.x - 10
            let containerPosY = position.y - 10
            let containerPos = { x: containerPosX, y: containerPosY }
            this.containerElement = new GenericModule(containerPos, document.createElement("div"), true, false, undefined, false, [])
        }
        GenericModule.makeMovable(position, element); // there's a hacky error here, but it still works. added to issues on GitHub
        modules.push(this);
        if (shouldHaveContainer) {
            document.body.append(this.containerElement!.element)
            this.containerElement!.element.onmousemove = (e) => {
                if (globalState.mouseIsDown) {
                    this.moveTo({ x: e.clientX - this.getSize().x / 2, y: e.clientY - this.getSize().y / 2 });
                }
            }
        }
        if (movable && !shouldHaveContainer && containerElement) {
            console.log(this.element)
            this.moveTo({x: 30, y: 30})
            this.containerElement!.element.onmousemove = (e) => {
                if (globalState.mouseIsDown) {
                    this.moveTo({ x: e.clientX - this.getSize().x / 2, y: e.clientY - this.getSize().y / 2 });
                }
            };
        }
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

    updateContainerSize() {
        if (this.shouldHaveContainer) {
            Object.assign(this.containerElement!.element.style, {
                width: this.element.offsetWidth + 20 + "px",
                height: this.element.offsetHeight + 20 + "px",
                backgroundColor: "darkblue"
            });
        }
    }

    show() {
        // this.element.style.display = this.usualDisplayState
        document.body.append(this.element);
        this.onscreen = true;
        this.updateContainerSize()
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
        public element: HTMLTextAreaElement = document.createElement("textarea")
    ) {
        super(position, element, true, true);
        Object.assign(this.element.style, {
            backgroundColor: themeColors.textModule.BGColor,
            color: themeColors.textModule.fontColor,
            border: "none",
            fontSize: "2rem",
            width: "fit-content",
            fontFamily: "Manjari Thin, sans-serif"
        })
    }
}
export class ImageModule extends GenericModule {
    constructor(
        public position: XY,
        public imgsrc: string,
        public element: HTMLImageElement = document.createElement("img"),
        public size?: XY
    ) {
        super(position, element, false, true);
        this.element.src = imgsrc;
        this.size = { x: this.element.width, y: this.element.height };
        console.log(this.element.width);
        this.updateContainerSize()
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
        let newCoords = scaleIMGMap(0.3, areas);
    }
}

class TableCellModule extends GenericModule {
    constructor(position: XY, public coords: XY, cellWH: XY) {
        super(position, document.createElement("input"), false)
        this.element.inputMode = "text"
        Object.assign(this.element.style, {
            backgroundColor: (coords.y % 2 === 0 ? themeColors.tableBGColor.light : themeColors.tableBGColor.dark),
            width: cellWH.x + "px",
            height: cellWH.y + "px"
        })
        this.element.ondblclick = () => { }
    }
}

export class TableModule extends GenericModule {
    constructor(position: XY, public rowCols: XY = { x: 2, y: 5 }) {
        super(position, document.createElement("div"), false, true)
        let cellWidth = 150
        let cellHeight = 30
        for (let row = 0; row < rowCols.x; row++) {
            for (let col = 0; col < rowCols.y; col++) {
                let cell = new TableCellModule({ x: position.x + (cellWidth + 1) * row, y: position.y + cellHeight * col }, { x: row, y: col }, { x: cellWidth, y: cellHeight })
                this.childrenModules.push(cell)
                this.element.appendChild(cell.element)
                cell.show()
            }
        }
        // this.element.style.backgroundColor = "red"
        Object.assign(this.element.style, {width: cellWidth * rowCols.x + 10 + "px", height: cellHeight * rowCols.y + 10 + "px"})
        this.updateContainerSize()
    }
}