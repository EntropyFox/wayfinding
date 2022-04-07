import {
    AssetsManager,
    Color4,
    Engine,
    MeshBuilder,
    Quaternion,
    TransformNode,
    Vector3,
    DeviceOrientationCamera,
    Angle,
    Mesh,
    Color3,
    StandardMaterial,
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import { initializeScene } from '../webgl/scene.setup';
import { Particles } from './particles';

export const WayfindingRenderer = async (
    canvas: HTMLCanvasElement,
    heading?: number
) => {
    // Initialize engine and scene
    const engine = new Engine(canvas, true);
    const scene = initializeScene(engine)(canvas);
    scene.clearColor = new Color4(0, 0, 0, 0);

    // This creates and positions a device orientation camera
    var camera = new DeviceOrientationCamera(
        'DevOr_camera',
        new Vector3(0, 2, 0),
        scene
    );

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    scene.setActiveCameraByName('DevOr_camera');

    const northVector = new Vector3(0, 0, 10);
    const quat = Quaternion.FromEulerAngles(
        0,
        Angle.FromDegrees(45).radians(),
        0
    );
    let headingVector = Vector3.Zero();
    northVector.rotateByQuaternionToRef(quat, headingVector);
    // camera.setTarget(headingVector);
    camera.setTarget(northVector);

    const world = new TransformNode('world', scene);
    const content = new TransformNode('content', scene);

    // GridMaterial
    // const gridMaterial = new GridMaterial('grid', scene);

    // gridMaterial.lineColor = new Color3(1, 0.75, 0);
    // gridMaterial.mainColor = new Color3(0, 0, 0);
    // gridMaterial.opacity = 1;
    // gridMaterial.gridRatio = 0.1;
    // gridMaterial.majorUnitFrequency = 10;
    // gridMaterial.minorUnitVisibility = 0.5;
    // gridMaterial.gridOffset = new Vector3(0, 0, 0);

    // // Ground
    // const ground = Mesh.CreateGround(`ground`, 6.01, 6.01, 10, scene);
    // ground.parent = world;
    // ground.material = gridMaterial;

    // Create North Arrow
    const nordpil = MeshBuilder.CreateDisc('nordpil', {
        tessellation: 3,
        arc: 0.75,
    });
    nordpil.rotationQuaternion = Quaternion.FromEulerAngles(
        Angle.FromDegrees(90).radians(),
        Angle.FromDegrees(45).radians(),
        0
    );
    nordpil.position = new Vector3(0, 0.1, 0);
    const red = new StandardMaterial('red', scene);
    red.diffuseColor = new Color3(1, 0, 0);
    nordpil.material = red;
    nordpil.parent = world;

    /// Load destination arrow
    const assetsManager = new AssetsManager(scene);
    const meshTask = assetsManager.addMeshTask(
        'Arrow task',
        '',
        'https://storage.googleapis.com/hololink/dev/arrow/',
        'scene.gltf'
    );
    meshTask.onSuccess = (task) => {
        console.log('task: ', task);
        // task.loadedMeshes[0].position = new Vector3(0, 0, 1);
        const arrow = task.loadedMeshes[0];
        arrow.parent = content;
        arrow.position = new Vector3(0, 0.5, 0);
        arrow.rotationQuaternion = Quaternion.FromEulerAngles(
            Angle.FromDegrees(90).radians(),
            0,
            0
        );
    };
    assetsManager.load();

    const particles = Particles(scene);

    // scene.debugLayer.show();

    engine.runRenderLoop(() => {
        scene.render();
    });
    window.addEventListener('resize', () => {
        engine.resize();
    });

    return {
        content,
        particles,
        updateCamera: (heading: number) => {
            // camera.setTarget()
        }
    };
};

export type WayfindingRendere = ReturnType<typeof WayfindingRenderer>;
