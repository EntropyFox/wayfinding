export type Vector = {
    x: number,
    y: number,
    z: number
};

export type Size = {
    width: number,
    height: number
};

export type ViewMatrix = {
    m00: number;
    m01: number;
    m02: number;
    m03: number;
    m10: number;
    m11: number;
    m12: number;
    m13: number;
    m20: number;
    m21: number;
    m22: number;
    m23: number;
    m30: number;
    m31: number;
    m32: number;
    m33: number;
}

export type TrackingResult = {
    isTracked: boolean;
    tvec: Vector;
    rvec: Vector;
    viewMatrix: ViewMatrix;
};