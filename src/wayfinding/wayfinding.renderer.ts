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
    MeshAssetTask,
    Mesh,
    GlowLayer,
    Matrix,
    Color3,
    StandardMaterial,
    HighlightLayer,
    setAndStartTimer,
    AdvancedTimer,
    Scene,
    ActionManager,
    ExecuteCodeAction,
} from '@babylonjs/core';
import { initializeScene } from '../webgl/scene.setup';

import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import { AdvancedDynamicTexture, Button, Control } from '@babylonjs/gui';

export const WayfindingRenderer = async (canvas: HTMLCanvasElement) => {
    // Initialize engine and scene
    const engine = new Engine(canvas, true);
    const scene = initializeScene(engine)(canvas);

    const clearColor = new Color4(0, 0, 0, 0);
    scene.clearColor = clearColor;

    var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');

    // scene.debugLayer.show();

    // This creates and positions a device orientation camera
    var camera = new DeviceOrientationCamera(
        'DevOr_camera',
        new Vector3(0, 2, 0),
        scene
    );

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    scene.setActiveCameraByName('DevOr_camera');

    /// Glow is cool
    const gl = new GlowLayer('glow', scene);

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

    /// Game settings
    let squidLives = 15;
    let playerLives = 5;
    let gameStarted = false;

    /// Nodes and squid
    const squidbox = new TransformNode('squidbox', scene);
    const content = new TransformNode('content');
    content.position = new Vector3(0, 0, -30);
    content.parent = squidbox;

    /// Load squid
    const assetManager = new AssetsManager(scene);
    assetManager.addMeshTask(
        'squid',
        '',
        'https://assets.hololink.io/models/experimentarium/',
        'Evil_Skin.glb'
    );
    assetManager.onTaskSuccess = (task: MeshAssetTask) => {
        console.log(task.loadedMeshes[0]);
        task.loadedMeshes[0].metadata = {
            name: 'squid',
        };
        task.loadedMeshes[0].parent = content;
        task.loadedAnimationGroups[0].speedRatio = 10;
        console.log('squid ready');
    };
    await assetManager.loadAsync();
    console.log('loaded');

    /// Shell is the one we clone bullet from
    const shell = MeshBuilder.CreateCylinder('shell', {
        diameterTop: 0.2,
        diameterBottom: 0.2,
        height: 0.3,
    });
    shell.position = content.position;
    shell.rotation = new Vector3(Math.PI / 4, 0, 0);
    shell.parent = squidbox;
    const shellGlowingMaterial = new StandardMaterial('glowing', scene);
    shellGlowingMaterial.emissiveColor = Color3.Green();
    shell.material = shellGlowingMaterial;
    shell.isVisible = false;

    /// Timer
    let advancedTimer = new AdvancedTimer({
        timeout: 2000,
        contextObservable: scene.onBeforeRenderObservable,
    });

    advancedTimer.onTimerEndedObservable.add(() => {
        const nextShot = generateRandomInteger(4000, 10000);
        console.log(nextShot);

        advancedTimer.start(nextShot);
        shot(scene, shell, shieldMesh);
    });

    /// Shield
    const shieldMesh = MeshBuilder.CreateCylinder(
        'shields',
        {
            diameter: 1,
            height: 0.1,
        },
        scene
    );
    /// TODO Update according to camera
    // shieldMesh.po
    shieldMesh.parent = camera;
    shieldMesh.position = new Vector3(0, -0.2, 2);
    shieldMesh.rotation = new Vector3(2.1, 0, 0);

    const glowingMaterial = new StandardMaterial('glowing', scene);
    glowingMaterial.emissiveColor = Color3.Teal();
    glowingMaterial.alpha = 0.7;
    shieldMesh.material = glowingMaterial;

    shieldMesh.setEnabled(false);

    const squidMove = () => {
        const newY = Math.random() * (2 * Math.PI + 1);
        console.log('squidMove', newY);
        squidbox.rotation = new Vector3(0, newY, 0);
    };

    const hl = new HighlightLayer('hl1', scene);
    scene.onPointerDown = function castRay() {
        if (!gameStarted || shieldMesh.isEnabled()) return;

        var ray = scene.createPickingRay(
            scene.pointerX,
            scene.pointerY,
            Matrix.Identity(),
            camera
        );
        var hit = scene.pickWithRay(ray);

        if (
            hit.pickedMesh &&
            hit.pickedMesh?.parent?.metadata.name == 'squid'
        ) {
            const eyes = <Mesh>scene.getMeshById('Eyebows_v02');
            const kraken = <Mesh>scene.getMeshById('kraken:kraken_low');
            /// Only allow hits if not "red"
            if (hl.hasMesh(kraken)) {
                return;
            }
            squidLives -= 1;
            if (squidLives % 5 === 0 && squidLives > 0) {
                squidMove();
            }

            console.log('SquidLives', squidLives);
            hl.addMesh(kraken, Color3.Red());
            hl.addMesh(eyes, Color3.Red());
            if (squidLives === 0) {
                gameWon();
                return;
            }
            setAndStartTimer({
                timeout: 750,
                contextObservable: scene.onBeforeRenderObservable,
                onEnded: () => {
                    hl.removeAllMeshes();
                },
            });
        }
    };

    const shot = (scene: Scene, shell: Mesh, shield: Mesh) => {
        const speed = 0.8;
        console.log('Squid shot');
        const bullet = shell.clone('bullet');
        bullet.isVisible = true;
        bullet.actionManager = new ActionManager(scene);
        bullet.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger,
                    parameter: shield,
                },
                () => {
                    if (shield.isEnabled()) {
                        console.log('Shield');

                        (<StandardMaterial>shieldMesh.material).emissiveColor =
                            Color3.Magenta();
                        setAndStartTimer({
                            timeout: 750,
                            contextObservable: scene.onBeforeRenderObservable,
                            onEnded: () => {
                                (<StandardMaterial>(
                                    shieldMesh.material
                                )).emissiveColor = Color3.Teal();
                            },
                        });

                        bullet.dispose();
                    }
                }
            )
        );

        const bulletVector = camera.position
            .subtract(bullet.position)
            .normalize();
        console.log('bulletVector: ', bulletVector);

        bullet.onBeforeRenderObservable.add(() => {
            bullet.position.addInPlace(bulletVector.scale(speed));
            // bullet.position.z += speed;
            if (bullet.position.z > -0.8) {
                scene.clearColor = new Color4(0.76, 0.05, 0.05, 0.5);
                setAndStartTimer({
                    timeout: 100,
                    contextObservable: scene.onBeforeRenderObservable,
                    onEnded: () => {
                        scene.clearColor = new Color4(0, 0, 0, 0);
                    },
                });
                bullet.dispose();
                playerLives -= 1;
                console.log('Player hit lives left', playerLives);
                if (playerLives === 0) {
                    gameLost();
                }
            }
        });
    };

    const shield = () => {
        shieldMesh.setEnabled(!shieldMesh.isEnabled());
    };

    // UI
    const btnColor = '#4C8CF9';

    const shieldBtn = Button.CreateSimpleButton('but1', 'Skjold');
    shieldBtn.width = '150px';
    shieldBtn.height = '40px';
    shieldBtn.color = 'white';
    shieldBtn.cornerRadius = 20;
    shieldBtn.background = btnColor;
    shieldBtn.top = '30%';
    // shieldBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    // shieldBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    shieldBtn.onPointerUpObservable.add(() => {
        shield();
    });
    shieldBtn.isVisible = false;
    advancedTexture.addControl(shieldBtn);

    const btnStart = Button.CreateSimpleButton('but1', 'Start');
    btnStart.width = '150px';
    btnStart.height = '40px';
    btnStart.color = 'white';
    btnStart.cornerRadius = 20;
    btnStart.background = btnColor;
    btnStart.onPointerUpObservable.add(() => {
        startGame();
    });
    advancedTexture.addControl(btnStart);

    // /// Game Lost
    const btnGameLost = Button.CreateSimpleButton('btnLost', 'Du tabte');
    btnGameLost.width = '150px';
    btnGameLost.height = '40px';
    btnGameLost.color = 'white';
    btnGameLost.cornerRadius = 20;
    btnGameLost.background = btnColor;
    btnGameLost.onPointerUpObservable.add(() => {
        startGame();
    });
    btnGameLost.isVisible = false;
    advancedTexture.addControl(btnGameLost);

    /// Game won
    const btnGameWon = Button.CreateSimpleButton('btnLost', 'Du vandt!');
    btnGameWon.width = '150px';
    btnGameWon.height = '40px';
    btnGameWon.color = 'white';
    btnGameWon.cornerRadius = 20;
    btnGameWon.background = btnColor;
    btnGameWon.onPointerUpObservable.add(() => {
        window.location.href =
            'https://experimentariet.hololink.io/won/monster';
    });
    btnGameWon.isVisible = false;
    advancedTexture.addControl(btnGameWon);

    const startGame = () => {
        squidLives = 15;
        playerLives = 5;
        btnStart.isVisible = false;
        shieldBtn.isVisible = true;
        btnGameLost.isVisible = false;
        gameStarted = true;
        advancedTimer.start(4000);
    };

    const stopGame = () => {
        shieldMesh.isEnabled(false);
        gameStarted = false;
        advancedTimer.stop();
    };

    const gameWon = () => {
        stopGame();
        btnGameWon.isVisible = true;
    };

    const gameLost = () => {
        stopGame();
        btnGameLost.isVisible = true;
    };

    engine.runRenderLoop(() => {
        scene.render();
    });
    window.addEventListener('resize', () => {
        engine.resize();
    });

    return {
        content,
        camera,
    };
};

/// JA DEN ER FRA STACKOVERFLOW! OG hvad så?!?
function generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

export type WayfindingRendere = ReturnType<typeof WayfindingRenderer>;
