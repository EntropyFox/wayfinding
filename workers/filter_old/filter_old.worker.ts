import { WorkerData } from "../worker-helper";
import { Pose } from "../worker.model";
import { filterFunctions } from "./filter_old.functions";

const filterWorkerCtx: Worker = self as any;

const updatePose = (addr: number, pose: Pose) => {
    if (!addr || !pose) return;
    Module.setValue(addr, true, 'i8', false);
    /// Write translations to memory
    Module.setValue(addr + 4, pose.tx, 'float', false);
    Module.setValue(addr + 4 * 2, pose.ty, 'float', false);
    Module.setValue(addr + 4 * 3, pose.tz, 'float', false);
    // Write rotations to memory
    Module.setValue(addr + 4 * 4, pose.rx, 'float', false);
    Module.setValue(addr + 4 * 5, pose.ry, 'float', false);
    Module.setValue(addr + 4 * 6, pose.rz, 'float', false);
}

const filterWorker = () => {

    let structAddr;
    filterWorkerCtx["setAddr"] = (addr: number) => {
        structAddr = addr;
        console.log('structAddr: ', structAddr);
    }

    let locked = true;
    filterWorkerCtx["unlock"] = () => {
        locked = false;
        console.log('locked: ', locked);
    };

    let currentPose: Pose;
    filterWorkerCtx['updateContext'] = () => updatePose(structAddr, currentPose);

    filterFunctions.load.workerFunction = () => {
        return new Promise<void>((resolve, reject) => {
            importScripts('/assets/filter.js');
            Module.onRuntimeInitialized = () => {
                resolve();
            };
            /// TODO handle if import fails
        });
    };
    filterFunctions.updatePose.workerFunction = (pose: Pose) => {
        return new Promise<void>((resolve, reject) => {
            currentPose = pose;
            resolve();
        });
    }

    return (data: WorkerData) => {
        return filterFunctions[data.name].workerFunction(data.args);
    }
}

const filterInstance = filterWorker();

/// Handle incomming event to worker
filterWorkerCtx.addEventListener('message', (event) => {

    if (!event.data.name) return;

    filterInstance(event.data as WorkerData).then(result => {
        /// Post message back to main thread
        filterWorkerCtx.postMessage({
            name: event.data.name,
            result
        });
    });

});