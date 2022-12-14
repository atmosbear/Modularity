import { cDialog, globalState } from "./Globals"


window.addEventListener("mousedown", () => {globalState.mouseIsDown = true})
window.addEventListener("mouseup", () => {globalState.mouseIsDown = false})

window.onmousedown = (e: MouseEvent) => {
    console.log(e.button);
    if (e.button === 1) { // middle mouse button on linux... will need to adjust for other OSs
        e.preventDefault();
        cDialog.show();
        let xy = {x: e.clientX - cDialog.getSize().x / 2, y: e.clientY - cDialog.getSize().y / 2}
        cDialog.moveTo(xy)
        globalState.circleDialogCenterLocation = {x: e.clientX, y: e.clientY}
    }
}

