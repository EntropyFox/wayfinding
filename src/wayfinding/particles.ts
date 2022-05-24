import {
    Color4,
    MeshBuilder,
    ParticleSystem,
    Scene,
    Texture,
    TransformNode,
    Vector3,
} from '@babylonjs/core';

export const Particles = (scene: Scene) => {
    const particles = new TransformNode('particles', scene);
    // ************************ Particle system ************************
    // We don't have to load the particles in this callback

    const emitterBox = MeshBuilder.CreateBox('emitter', { size: 2 });
    emitterBox.position = new Vector3(5, 0, 0);
    emitterBox.setPivotPoint(new Vector3(-5, 0, 0));
    emitterBox.visibility = 0.0;

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
        '/textures/single-note.png',
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
    particleSystem.minLifeTime = 5;
    particleSystem.maxLifeTime = 10;

    // Emission rate
    particleSystem.emitRate = 100;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;

    // Set the gravity of all particles
    //particleSystem.gravity = new Vector3(0, -9.81, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new Vector3(-1, -0.1, 0);
    particleSystem.direction2 = new Vector3(-1, 0.1, 0);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = 0.001;

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 5;
    particleSystem.updateSpeed = 0.005;

    particleSystem.isLocal = true;

    // Start the particle system
    particleSystem.start();

    emitterBox.rotate(new Vector3(0, 1, 0), (0 * Math.PI) / 180);
    emitterBox.parent = particles;

    // ************************************************

    return particles;
};
