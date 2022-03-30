import { FreeCamera, Matrix, MeshBuilder, Quaternion, Scene, StandardMaterial, Texture, TransformNode, Vector3, Vector4 } from '@babylonjs/core';
import { TrackingResult } from '../tracker/tracking.model';
import { TrackerInstance } from '../tracker/tracking.manager';

/// Used for debugging purpose
const debugBox = (scene: Scene) => {
    /// Example of dice in babylon playground
    /// https://playground.babylonjs.com/#A99R4C

    const mat = new StandardMaterial('mat', scene);
    const texture = new Texture(
        'https://assets.babylonjs.com/environments/numbers.jpg',
        scene
    );
    mat.diffuseTexture = texture;

    var columns = 6;
    var rows = 1;

    const faceUV = new Array(6);

    for (let i = 0; i < 6; i++) {
        faceUV[i] = new Vector4(
            i / columns,
            0,
            (i + 1) / columns,
            1 / rows
        );
    }

    const options = {
        faceUV: faceUV,
        wrap: true,
        size: 1,
    };

    const box = MeshBuilder.CreateBox('box', options, scene);
    box.material = mat;

    const debugContent = new TransformNode('DebugContent', scene);
    box.parent = debugContent;

    return debugContent;
};

export const BabylonTracker = (scene: Scene) => (
    tracker: TrackerInstance
) => {
    scene.getTransformNodeByID('content');
    const box = debugBox(scene);

    // Initial transform of chilren
    const content = new TransformNode('arRootNode');
    box.parent = content;
    content.setEnabled(false);

    const arRootNode = scene.getTransformNodeByID('content');
    arRootNode.setEnabled(true);
    arRootNode.parent = content;
    content.rotationQuaternion = Quaternion.Identity();

    const camera = scene.getCameraByID('ar-camera') as FreeCamera;

    /// First tracked is used so we do not use any lerping on models in the first tracking frame. This removes the model coming in from a weird place with funny rotation
    let firstTracked = true;

    const updateContent = (content: TransformNode) => (
        result: TrackingResult
    ) => {
        content.setEnabled(result.isTracked);
        if (result.isTracked) {
            
            const modelMatrix = Matrix.FromValues(
                result.modelMatrix.m00, -1 * result.modelMatrix.m01, result.modelMatrix.m02, result.modelMatrix.m03,
                -1 * result.modelMatrix.m10, result.modelMatrix.m11, -1 * result.modelMatrix.m12, result.modelMatrix.m13,
                result.modelMatrix.m20, -1 * result.modelMatrix.m21, result.modelMatrix.m22, result.modelMatrix.m23,
                result.modelMatrix.m30, -1 * result.modelMatrix.m31, result.modelMatrix.m32, result.modelMatrix.m33);
                
                const rotationMatrix = modelMatrix.getRotationMatrix();
                // const position = modelMatrix.getTranslation();
                
                content.position = modelMatrix.getTranslation();
                content.rotationQuaternion = Quaternion.FromRotationMatrix(rotationMatrix);    
        }

        // Update firstTracked so it's false if we have lost tracking
        firstTracked = (firstTracked && content.isEnabled()) ? false : !content.isEnabled();
    };

    tracker.trackingState$.subscribe(updateContent(content));
};

