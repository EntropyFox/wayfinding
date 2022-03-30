import PlanarWorker from "worker-loader!./planar.worker";
import { WorkerCallback } from "../worker.model";
// import { PlanarFunctions } from "./planar.functions";

export const PlanarHandler = () => {
    const planarWorker = new PlanarWorker();
    let listeners: Map<String, WorkerCallback> = new Map();

    /// Handle all messages return from  our wasm worker
    planarWorker.onmessage = event => {
        if (!listeners.has(event.data.name)) return;
        listeners.get(event.data.name)(event.data.result);
    };

    return {
        load: () => {
            return new Promise<void>((resolve, reject) => {
                /// Post to webworker
                planarWorker.postMessage({
                    name: 'load'
                });

                /// Add resolve to listeners as a clousre
                listeners.set('load', () => resolve());
            });
        },
        init: () => {
            return new Promise<void>((resolve, reject) => {
                /// Post to webworker
                planarWorker.postMessage({
                    name: 'init'
                });

                /// Add resolve to listeners as a clousre
                listeners.set('init', () => resolve());
            });
        },
        setMarker: (imageData: ImageData) => {
            return new Promise<Module.Rect>((resolve, reject) => {
                /// Post to webworker
                planarWorker.postMessage({
                    name: 'setModel',
                    args: [imageData]
                });

                /// Add resolve to listeners as a clousre
                listeners.set('setModel', rect => resolve(rect));
            });
        },
        getModelRect: () => {
            return new Promise<Module.Rect>((resolve, reject) => {
                /// Post to webworker
                planarWorker.postMessage({
                    name: 'getModelRect'
                });

                /// Add resolve to listeners as a clousre
                listeners.set('getModelRect', rect => resolve(rect));
            });
        },
        setFrameSrc: async (width: number, height: number) => {
            return new Promise<void>((resolve, reject) => {
                planarWorker.postMessage({
                    name: 'setFrameSrc',
                    args: [width, height]
                });
                listeners.set('setFrameSrc', () => resolve());
            });
        },
        processFrame: (imageData: ImageData, timestamp: number) => {
            return new Promise<void>((resolve, reject) => {
                /// Post to webworker
                planarWorker.postMessage({
                    name: 'processFrame',
                    args: [imageData, timestamp]
                });

                /// Add resolve to listeners as a clousre
                listeners.set('processFrame', () => resolve());
            });
        },
        getPose: () => {
            return new Promise<Module.PoseContext>((resolve, reject) => {
                /// Post to webworker
                planarWorker.postMessage({
                    name: 'getPose'
                });

                /// Add resolve to listeners as a clousre
                listeners.set('getPose', pose => resolve(pose));
            });
        },
        getHomography: () => {
            return new Promise<Module.PoseContext>((resolve, reject) => {
                /// Post to webworker
                planarWorker.postMessage({
                    name: 'getHomography'
                });

                /// Add resolve to listeners as a clousre
                listeners.set('getHomography', homography => resolve(homography));
            });
        },
        destroy: () => {
            return new Promise<void>((resolve, reject) => {
                /// Post to webworker
                planarWorker.postMessage({
                    name: 'destroy',
                });

                /// Add resolve to listeners as a clousre
                listeners.set('destroy', () => resolve());
            });
        }
    }
}