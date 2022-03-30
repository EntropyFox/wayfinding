import { WorkerData } from "../worker-helper";
import { PlanarFunctions } from "./planar.functions";

const workerCtx: Worker = self as any;

const plenarWorker = () => {

    let src: Module.Mat;
    let tracker: Module.PlanarDetectorTrackerBridge;

    let structAddr;
    workerCtx["setAddr"] = (addr: number) => {
        structAddr = addr;
        console.log('structAddr: ', structAddr);
    }

    workerCtx['setModelDone'] = () => {
        console.log('SET MODEL DONE');
    }

    const planarFunctions: PlanarFunctions = {
        load: () => {
            return new Promise<void>((resolve, reject) => {
                importScripts('/assets/planar.js');
                Module.onRuntimeInitialized = () => {
                    resolve();
                };
            });
        },
        init: () => {
            return new Promise<void>((resolve, reject) => {
                tracker = new Module.PlanarDetectorTrackerBridge();
                // console.log('tracker: ', tracker);
                // Module.testFromJs(tracker);
                resolve();
            });
        },
        setModel: (img: ImageData) => {
            return new Promise<Module.Rect>((resolve, reject) => {
                const model = new Module.Mat(img.height, img.width, Module.CV_8UC4);
                model.data.set(img.data);
                const rect = tracker.setModel(model);
                resolve({
                    height: rect.height,
                    width: rect.width,
                    x: rect.x,
                    y: rect.y
                });
            });
        },
        getModelRect: async() => {
            const rect = tracker.getModelRect();
            return {
                height: rect.height,
                width: rect.width,
                x: rect.x,
                y: rect.y
            }
        },
        setFrameSrc: async (height: number, width: number) => {
            console.log('width: ', width);
            console.log('height: ', height);
            src = new Module.Mat(height, width, Module.CV_8UC4);
            tracker.setFrameSize(height, width);
        },
        processFrame: async (img: ImageData, timestamp: number) => {
            src.data.set(img.data);
            tracker.processFrame(src, 1);
        },
        getPose: async () => {
            return tracker.getPose();
        },
        getHomography: async () => {
            return tracker.getHomography();
        },
        destroy: (destoryTracker: boolean) => {
            return new Promise<void>((resolve, reject) => {
                src.delete();
                
                destoryTracker ? tracker.delete() : tracker.reset();
                resolve();
            });
        }
    };

    return (data: WorkerData) => data.args ? planarFunctions[data.name](...data.args) : planarFunctions[data.name]();
}

const planarInstance = plenarWorker();


/// Handle incomming event to worker
workerCtx.addEventListener('message', (event) => {
    if (!event.data.name) return;

    planarInstance(event.data as WorkerData).then(result => {
        /// Post message back to main thread
        workerCtx.postMessage({
            name: event.data.name,
            result
        });
    });

});