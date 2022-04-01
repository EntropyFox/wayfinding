import {
    AssetsManager,
    Color4,
    Engine,
    MeshBuilder,
    Quaternion,
    ParticleSystem,
    Space,
    Texture,
    TransformNode,
    Vector3,
    DeviceOrientationCamera,
} from '@babylonjs/core';
import { initializeScene } from '../webgl/scene.setup';

export const WayfindingRendere = async (canvas: HTMLCanvasElement) => {
    // Initialize engine and scene
    const engine = new Engine(canvas, true);
    const scene = initializeScene(engine)(canvas);
    scene.clearColor = new Color4(0, 0, 0, 0);

    /********** DEVICE ORIENTATION CAMERA EXAMPLE **************************/

    // This creates and positions a device orientation camera
    var camera = new DeviceOrientationCamera(
        'DevOr_camera',
        new Vector3(0, 0, 0),
        scene
    );

    // This targets the camera to scene origin
    camera.setTarget(new Vector3(0, 0, 10));

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    scene.setActiveCameraByName('DevOr_camera');

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    //var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    let content = new TransformNode('content', scene);
    content.position = new Vector3(0, 0, 1);
    // content.setEnabled(false);

    /// Load arrow
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
        arrow.rotationQuaternion = Quaternion.FromEulerAngles(
            0,
            0,
            Math.PI / 2
        );

        // Load Particle system
        // We don't have to load the particles in this callback
        loadParticles: {
            const emitterBox = MeshBuilder.CreateBox('emitter', { size: 2 });
            emitterBox.position = new Vector3(2, 0, 0);
            emitterBox.setPivotPoint(new Vector3(-2, 0, 0));
            emitterBox.visibility = 0.4;

            // Create a particle system
            const particleSystem = new ParticleSystem('particles', 2000, scene);

            //Particle emitter
            //particleSystem.createBoxEmitter(new Vector3(-5, -1, 9) ,new Vector3(-5, 1, 8), new Vector3(2, 5, 5), new Vector3(2, -5, -5) )
            // Where the particles come from
            particleSystem.emitter = emitterBox; // the starting object, the emitter
            particleSystem.minEmitBox = new Vector3(1, -2, 2); // Starting all from
            particleSystem.maxEmitBox = new Vector3(1, 2, -2); // To...

            //Texture of each particle
            particleSystem.particleTexture = new Texture(
                '/textures/flare.png',
                scene
            );

            // Colors of all particles
            particleSystem.color1 = new Color4(0.8, 0.7, 1.5, 2);
            particleSystem.color2 = new Color4(1, 1, 1, 1);
            particleSystem.colorDead = new Color4(0.5, 1, 1, 0);

            // Size of each particle (random between...
            particleSystem.minSize = 0.1;
            particleSystem.maxSize = 0.2;

            // Life time of each particle (random between...
            particleSystem.minLifeTime = 2;
            particleSystem.maxLifeTime = 4;

            // Emission rate
            particleSystem.emitRate = 250;

            // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
            particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;

            // Set the gravity of all particles
            //particleSystem.gravity = new Vector3(0, -9.81, 0);

            // Direction of each particle after it has been emitted
            particleSystem.direction1 = new Vector3(-1, -0.1, 0);
            particleSystem.direction2 = new Vector3(-1, 0.1, 0);

            // Angular speed, in radians
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = Math.PI;

            // Speed
            particleSystem.minEmitPower = 1;
            particleSystem.maxEmitPower = 5;
            particleSystem.updateSpeed = 0.005;

            particleSystem.isLocal = true;

            // Start the particle system
            particleSystem.start();

            //emitterBox.rotate(new Vector3(0, 1, 0), 0 * Math.PI / 180 );
            emitterBox.rotationQuaternion = Quaternion.FromEulerAngles(
                0,
                0,
                Math.PI / 2
            );
        }
    };

    assetsManager.load();

    engine.runRenderLoop(() => {
        scene.render();
    });
    window.addEventListener('resize', () => {
        engine.resize();
    });

    return {
        content,
    };
};