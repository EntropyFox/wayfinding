import FilterWorker from "worker-loader!./filter.worker";
import { WorkerCallback } from "../worker.model";

export const FilterHandler = () => {
    const filterWorker = new FilterWorker();
    let listeners: Map<String, WorkerCallback> = new Map();

    /// Handle all messages return from  our wasm worker
    filterWorker.onmessage = event => {
        if (!listeners.has(event.data.name)) return;
        listeners.get(event.data.name)(event.data.result);
    };

    return {
        load: () => {
            return new Promise<void>((resolve, reject) => {
                /// Post to webworker
                filterWorker.postMessage({
                    name: 'load'
                });

                /// Add resolve to listeners as a clousre
                listeners.set('load', () => resolve());
            });
        },
        init: (height: number, width: number, rect: Module.Rect) => {
            return new Promise<void>((resolve, reject) => {
                /// Post to webworker
                filterWorker.postMessage({
                    name: 'init',
                    args: [height, width, rect]
                });

                /// Add resolve to listeners as a clousre
                listeners.set('init', () => resolve());
            });
        },
        updatePose: (pose: Module.PoseContext) => {
            return new Promise<void>((resolve, reject) => {
                /// Post to webworker
                filterWorker.postMessage({
                    name: 'updatePose',
                    args: [pose]
                });

                /// Add resolve to listeners as a clousre
                listeners.set('updatePose', () => resolve());
            });
        },
        getPose: () => {
            return new Promise<Module.PoseResult>((resolve, reject) => {
                /// Post to webworker
                filterWorker.postMessage({
                    name: 'getPose'
                });

                /// Add resolve to listeners as a clousre
                listeners.set('getPose', pose => resolve(pose));
            });
        }
    }
}