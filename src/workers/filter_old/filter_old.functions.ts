import { WorkerData } from "../worker-helper";
import { Pose } from "../worker.model";

/// Functions 
export const filterFunctions = {
    'load': {
        workerFunction: () => {},
        workerCall: (data: WorkerData) => { },
        workerCallback: (result: any) => { }
    },
    'updatePose': {
        workerFunction: (pose: Pose) => {},
        workerCall: (data: WorkerData) => { },
        workerCallback: (result: any) => { }
    }
}