import { WasmFunctions } from "../worker.model";

export type FilterFunctions = WasmFunctions & {
    init: (height: number, width: number, rect: Module.Rect) => Promise<void>;
    updatePose: (pose: Module.PoseContext) => Promise<void>;
    getPose: () => Promise<Module.PoseContext>;
}