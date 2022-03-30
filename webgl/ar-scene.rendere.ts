import { Color4, Engine, TransformNode } from "@babylonjs/core";
import { TrackerInstance } from "../tracker/tracking.manager";
import { BabylonTracker } from "./babylon-tracker";
import { initializeScene } from "./scene.setup";

export const ARSceneRendere = async (canvas: HTMLCanvasElement) => {
    // Initialize engine and scene
    const engine = new Engine(canvas, true);
    const scene = initializeScene(engine)(canvas);
    scene.clearColor = new Color4(0, 0, 0, 0);

    const babylonTracker = BabylonTracker(scene);

    scene.createDefaultEnvironment({
        createSkybox: false,
    });


    let content = new TransformNode('content', scene);
    content.setEnabled(false);

    engine.runRenderLoop(() => {
        scene.render();
    });
    window.addEventListener('resize', () => {
        engine.resize();
    });

    return {
        runTracker: (tracker: TrackerInstance) => babylonTracker(tracker)
    }
}