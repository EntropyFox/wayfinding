import { AssetsManager, Color4, Engine, TransformNode, Vector3 } from "@babylonjs/core";
import { initializeScene } from "../webgl/scene.setup";

export const WayfindingRendere = async (canvas: HTMLCanvasElement) => {
    // Initialize engine and scene
    const engine = new Engine(canvas, true);
    const scene = initializeScene(engine)(canvas);
    // scene.clearColor = new Color4(0, 0, 0, 0);

    scene.createDefaultEnvironment({
        createSkybox: false,
    });

    let content = new TransformNode('content', scene);
    content.position = new Vector3(0, 0, 1);
    // content.setEnabled(false);

    /// Load arrow
    const assetsManager = new AssetsManager(scene);
	const meshTask = assetsManager.addMeshTask("Arrow task", "", "https://storage.googleapis.com/hololink/dev/arrow/", "scene.gltf");
    meshTask.onSuccess = (task) => {
        console.log('task: ', task);
        // task.loadedMeshes[0].position = new Vector3(0, 0, 1);
        task.loadedMeshes[0].parent = content;
    }

    assetsManager.load();


    engine.runRenderLoop(() => {
        scene.render();
    });
    window.addEventListener('resize', () => {
        engine.resize();
    });

    return {
        content        
    }
}