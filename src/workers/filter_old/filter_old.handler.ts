import FilterWorker from "worker-loader!./filter.worker";
import { Pose, WorkerCallback } from "../worker.model";

export const FilterHandler = () => {
    /// Load web worker
    const filterworker = new FilterWorker();

    let listeners: Map<String, WorkerCallback> = new Map();
    let workerFunctions: WorkerFunction[] = [];

    let callbacks: Map<String, void> = new Map();


    /// Handle callbacks from the worker
    filterworker.onmessage = event => {
        // console.log('event: ', event);
        if (!listeners.has(event.data.name)) return;
        listeners.get(event.data.name)(event.data.result);
    };

    // type funct = <T>(arg: T) => void;
    type WorkerFunc = (arg?: any) => void;

    const workerFunction = (fn: WorkerFunc) => (arg: any) => {
        filterworker.postMessage({
            name: fn.name,
            args: arg
        });
    };

    const addListener = (fn: WorkerFunc) => new Promise<void>((resolve, reject) => listeners.set(fn.name, () => resolve()));    


    const load: WorkerFunc = () => {};
    const updatePoseFn = (pose: Pose) => {};


    workerFunction(load);
    addListener(load);

    type ArgumentTypes<F extends WorkerFunc> = F extends (arg: infer A) => any ? A : never;
    // const hh: ArgumentTypes<typeof updatePoseFn> = [];
    type TestArguments = ArgumentTypes<typeof updatePoseFn>; // [string, number]

    const testFn = (fn): ((arg: ArgumentTypes<typeof updatePoseFn>) => Promise<void>) => (arg) => {
        return addListener(fn);
    };

    const rtf = testFn(updatePoseFn);

    const wrapper = (fn: WorkerFunc) => (arg: ArgumentTypes<typeof fn>) => {
        workerFunction(fn)(arg);
        return addListener(fn);
    }

    const tt = wrapper(updatePoseFn);

    type wt = ReturnType<typeof wrapper>;

    type ReturnKeys = 'load' | 'updatePose';

    type FilterFunctionsObject = Record<ReturnKeys, wt>;

    

    const returnObject: FilterFunctionsObject = {
        load: <() => Promise<void>>workerFunction(load),
        updatePose: wrapper(updatePoseFn)
    }

    returnObject.updatePose


    return {
        load: async () => {
            return new Promise<void>((resolve, reject) => {
                /// Post to webworker
                filterworker.postMessage({
                    name: 'load'
                });

                /// Add resolve to listeners as a clousre
                listeners.set('load', () => resolve());
            });
        },
        updatePose: async (pose: Pose) => {
            // console.log('pose: ', pose);
            return new Promise<void>((resolve, reject) => {
                /// Post to webworker
                filterworker.postMessage({
                    name: 'updatePose',
                    args: pose
                });

                /// Add resolve to listeners as a clousre
                listeners.set('updatePose', () => resolve());
            });
        }
    }
}

export type WorkerFunction = {
    name: string;
    args: any;
}



// export type workerCallback = <T>(result: T) => T