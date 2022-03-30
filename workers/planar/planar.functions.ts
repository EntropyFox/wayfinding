import { WasmFunctions } from "../worker.model";

export type PlanarFunctions = WasmFunctions & {
    init: () => void;
    setModel: (img: ImageData) => void;
    getModelRect: () => any;
    setFrameSrc: (width: number, height: number) => void;
    processFrame: (img: ImageData, timestamp: number) => void;
    getPose: () => any;
    getHomography: () => any;
}

// export type Rect = {
//     height: number;
//     width: number;
//     x: number;
//     y; number;
// };