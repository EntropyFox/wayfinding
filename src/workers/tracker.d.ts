declare namespace Module {
    declare var CV_8UC4: number;
    declare var CV_8UC3: number;
    declare var CV_64F: number;
    declare var CV_64FC3: number;


    
    declare function onRuntimeInitialized(): void;
    declare function locateFile(path, prefix): void;

    function setValue(ptr: number, value: any, type: ptrType, noSafe : boolean): void;
    type ptrType = 'i1' | 'i8' | 'i16' | 'i32' | 'i64' | 'float' | 'double' | '*';

    declare function testFromJs(tracker: any): void;


    // declare function VectorFloat(): {
    //     size(): number;
    //     push_back(float: number): void;
    //     get(index: number): number;
    // }

    // declare type VectorFloat = ReturnType<typeof VectorFloat>;

    declare function onAbort(): void;
    // declare var TrackingResult

    declare class VectorFloat {
        push_back(float: number): void;
    }

    declare class Mat {
        // data: {
        //     set (data: Uint8ClampedArray): void;
        // }

        data; any;
        cols;
        rows;

        // constructor()
        constructor(height: number, width: number, CV_8UC4);

        delete(): void;

    }

    declare class Matx33d {
        constructor(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number);
    }

    declare class Rect {
        constructor();
        constructor(x: number, y: number, width: number, height: number);

        height: number;
        width: number;
        x: number;
        y: number;

    }

    enum PoseSource {
        Other,
        VisualDetector,
        VisualTracker,
        OrientationTracker,
        PositionTracker,
        KalmanFilter
    }

    declare class PoseContext {
        pose: {
            r_x: number;
            r_y: number;
            r_z: number;
            t_x: number;
            t_y: number;
            t_z: number;
        };
        homographyIndexed: HomographyIndexed;
        homography: Matx33d;
        timestamp: number
        certainty: number;
        PoseSource: PoseSource;
    }

    declare class PoseResult {
        modelMatrix: any;
        isTracked: boolean;
    }

    declare class HomographyIndexed {
        m00: number;
        m01: number;
        m02: number;
        m10: number;
        m11: number;
        m12: number;
        m20: number;
        m21: number;
        m22: number;
    };

    declare class PlanarDetectorTrackerBridge {

        setModel(template: Mat): Rect;
        getModelRect(): Rect;
        setFrameSize(height: number, width: number): void;
        processFrame(Mat, timestamp: number): void;
        processSensors(sensorData: VectorFloat): void;
        getPose(): any;
        getHomography(): any;
        reset(): void;
        delete(): void;
    }

    declare class FilterBridge {
        Init(height: number, width: number, rect: Rect): void;
        UpdatePose(pose: PoseContext): void;
        GetPose(): PoseContext;
    }

    declare class TrackingResult {

        constructor()

        wasObserved(): boolean;
        tvecX(): number;
        tvecY(): number;
        tvecZ(): number;

        rvecX(): number;
        rvecY(): number;
        rvecZ(): number;

    }
}
