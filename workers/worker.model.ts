export type WasmFunctions = {
    load: () => Promise<void>;
    destroy: (args: any) => Promise<void>;
}

export type WorkerCallback = (...args) => void;


/// Below is depricated

export type TrackingContextState = {
    pose: Pose
}

export type Pose = {
    tx: number;
    ty: number;
    tz: number;

    rx: number;
    ry: number;
    rz: number;
}