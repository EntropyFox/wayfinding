declare module "worker-loader!*" {
    class WebpackWorker extends Worker {
      constructor();
    }

    export default WebpackWorker;
}


declare type Size = {
  width: number,
  height: number
}