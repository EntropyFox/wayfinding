import { TestWorkerFunctions, WorkerReturnType } from "./work.functions";

const devWorkerCtx: Worker = self as any;


const DevWorker = () => {
    return (fnName: string, ...args) => {
        let fn: () => Promise<void>;
        let fn2: () => Promise<any>;
        switch (fnName) {
            case 'load':
                fn = async () => {
                    return new Promise<void>((resolve, reject) => {
                        importScripts('./tracker.js');
                        Module.onRuntimeInitialized = () => {
                            resolve();
                        }
                    });
                }
                fn2 = async () => new Promise<string>((resolve, reject) => {
                    resolve('hello world');
                })
            case 'arguments':
                // return async (args) => {
                    
                // };
            default:
                break;
        }

        type Foo<A> = {
            // conflict removed
            map: <B>(f: (_: A) => B) => Foo<B>
        }
        
        const makeFoo = <A>(a: A): Foo<A> => ({
           map: f => makeFoo(f(a)) //ok
        })

        return fn2();
        
    }
}

const devWorker = DevWorker();

devWorkerCtx.addEventListener('message', (event) => {

    if (!event.data.name) return;

    devWorker(event.data.name, ...event.data.args).then(result => {
        devWorkerCtx.postMessage({
            name: event.data.name,
            result
        });
    })
});

// export

export type devWorkerFunction = <T>(fnName: string) => Promise<T>