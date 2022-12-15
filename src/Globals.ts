import { CircleDialog, GenericModule } from "./GenericModule"

export let modules: GenericModule[] = []
export let moduleChoices = ["Image Module", "Text Module", "Generic/Container Module"]
export let globalState = { activeTool: "Image", circleDialogCenterLocation: { x: 0, y: 0 }, mouseIsDown: false, draggingWhat: undefined as unknown as HTMLElement }
export let cDialog = new CircleDialog()
cDialog.hide()
export let themeColors = { circleDialogColor: "lightgray", tableBGColor: {light: "lightblue", dark: "skyblue"}, textModule: {BGColor: "darkslateblue", fontColor: "white"} }