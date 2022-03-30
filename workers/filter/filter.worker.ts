import { WorkerData } from "../worker-helper";
import { FilterFunctions } from "./filter.functions";

const workerCtx: Worker = self as any;

const filterWorker = () => {

    let src: Module.Mat;
    let filter: Module.FilterBridge;

    const filterFunctions: FilterFunctions = {
        load: () => {
            return new Promise<void>((resolve, reject) => {
                importScripts('/assets/filter.js');
                Module.onRuntimeInitialized = () => {
                    resolve();
                };
            });
        },
        init: async (height: number, width: number, rect: Module.Rect) => {
            return new Promise<void>((resolve, reject) => {
                console.log('Init filter');
                console.log('height: ', height);
                console.log('width: ', width);

                filter = new Module.FilterBridge();
                const r = new Module.Rect(rect.x, rect.y, rect.width, rect.height);
                filter.Init(height, width, r);
                resolve();
            });
        },
        updatePose: async (pose: Module.PoseContext) => {
            // console.log('pose: ', pose);
            pose.homography = new Module.Matx33d(
                pose.homographyIndexed.m00, pose.homographyIndexed.m01, pose.homographyIndexed.m02,
                pose.homographyIndexed.m10, pose.homographyIndexed.m11, pose.homographyIndexed.m12,
                pose.homographyIndexed.m20, pose.homographyIndexed.m21, pose.homographyIndexed.m22,);

            // pose.homography = new Module.Matx33d(0.666, -0.003, 0, 0, 0, 0, 0, 2, 1);

            // // pose.homographyIndexed = pose.homographyIndexed;
            // console.log('pose 0,0', pose.homographyIndexed.m00);

            // console.log(pose.homographyIndexed.m00);
            return filter.UpdatePose(pose);
        },
        getPose: async () => {
            return filter.GetPose();
        },
        destroy: (destoryTracker: boolean) => {
            return new Promise<void>((resolve, reject) => {
                src.delete();
                
                // destoryTracker ? tracker.delete() : tracker.reset();
                resolve();
            });
        }
    };

    return (data: WorkerData) => data.args ? filterFunctions[data.name](...data.args) : filterFunctions[data.name]();
}

const filterInstance = filterWorker();


/// Handle incomming event to worker
workerCtx.addEventListener('message', (event) => {
    if (!event.data.name) return;

    filterInstance(event.data as WorkerData).then(result => {
        /// Post message back to main thread
        workerCtx.postMessage({
            name: event.data.name,
            result
        });
    });

});