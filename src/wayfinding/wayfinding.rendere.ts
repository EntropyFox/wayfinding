import { AssetsManager, Color4, Engine, Quaternion, TransformNode, Vector3 } from "@babylonjs/core";
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
        task.loadedMeshes[0].rotationQuaternion = Quaternion.FromEulerAngles(0, 0, Math.PI / 2);
        // console.log('task.loadedMeshes[0].rotationQuaternion: ', task.loadedMeshes[0].rotationQuaternion);
        // task.loadedMeshes[0].
        task.loadedMeshes[0].parent = content;
    }

    assetsManager.load();

    // scene.debugLayer.show({
    //     embedMode: true
    // });


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