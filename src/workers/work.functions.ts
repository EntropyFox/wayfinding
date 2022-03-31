// export namespace TestWorkerFunctions {
//     export const Load = async (): WorkerReturnType<void> => {
//         // return new Promise<void>((resolve, reject) => {
//         //     importScripts('/assets/tracker.js');
//         //     Module.onRuntimeInitialized = () => {
//         //         resolve();
//         //     };
//         //     /// TODO handle script errors
//         // });
//     }

//     export const Init = async (input: number): WorkerReturnType<void> => {
        
//     }


// }

var stuff: { [key: string]: WorkerFunction; } = {};


// export const TestWorkerFunctions: { [key: string]: <T>(...args) => WorkerReturnType<T>; } = {
//     // 'Load': async(): Promise<string> => {
//     // }
//     // 'Load': async (): WorkerReturnType<void> => {},
// }

export const TestWorkerFunctions: { [key: string]: (...args) => WorkerReturnType<void>; } = {
    // 'Load': async(): Promise<string> => {
    // }
    // 'Load': async (): WorkerReturnType<void> => {},
}

type WorkerFunction = <T>() => WorkerReturnType<T>;
export type WorkerArgs = any[];
export type WorkerReturnType<T> = Promise<T>;