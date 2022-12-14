import { CircleDialog, GenericModule } from "./GenericModule"

export let globalState = { activeTool: "Image", circleDialogCenterLocation: { x: 0, y: 0 }, mouseIsDown: false, draggingWhat: undefined as unknown as HTMLElement }
export let modules: GenericModule[] = []
export let moduleChoices = ["Image Module", "Text Module", "Generic/Container Module"]
export let themeColors = { circleDialogColor: "lightgray" }
export let cDialog = new CircleDialog()
cDialog.hide()