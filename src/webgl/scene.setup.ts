import { Engine, FreeCamera, HemisphericLight, Scene, Vector3 } from "@babylonjs/core";
import("@babylonjs/inspector");

export const initializeScene =
    (engine: Engine) => (canvas: HTMLCanvasElement) => {
        const scene = new Scene(engine);
        const camera = new FreeCamera(
            'ar-camera',
            new Vector3(0, 0, 0),
            scene
        );
        camera.minZ = 0.01;

        /// Aproximate FOV from focal length
        /// https://learnopencv.com/approximate-focal-length-for-webcams-and-cell-phone-cameras/
        camera.fov = 2 * Math.atan(canvas.height / (2 * canvas.width));
        const light = new HemisphericLight(
            'light',
            new Vector3(1, 1, 0),
            scene
        );

        return scene;
    };