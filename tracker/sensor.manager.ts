import { BehaviorSubject } from "rxjs";

export type MotionData = {
    type: 'motion';
    acceleration: number[];
    accelerationIncludingGravity: number[];
};

type OrientationData = {
    type: 'orientation';
    alpha: number;
    beta: number;
    gamma: number;
}

export type SensorData = MotionData | OrientationData;

export const SensorManager = async () => {
    // let instantMotion: MotionData =  {
    //     acceleration:                   [0, 0, 0],
    //     accelerationIncludingGravity:   [0, 0, 0],
    //     rotationRate:                   [0, 0, 0],
    // };
    // let instantOrientation: OrientationData = [0, 0, 0];
    // let sensorData: SensorData = {... instantMotion,  ...{orientation: instantOrientation}};
    const subject: BehaviorSubject<SensorData> = new BehaviorSubject<SensorData>(null);

    const parseNullFloat = (input: number | null) => input == null ? 0.0 : input;

    const parseAcceleration = <T extends DeviceMotionEventAcceleration>(acceleration: T) => {
        return [
            acceleration.x,
            acceleration.y,
            acceleration.z
        ].map(parseNullFloat);
    }

    const parseRotation = <T extends DeviceMotionEventRotationRate | DeviceOrientationEvent>(rotation: T) => {
        return [
            rotation.alpha,
            rotation.beta,
            rotation.gamma
        ].map(parseNullFloat);
    }

    const updateDeviceMotion = (e: DeviceMotionEvent) => {
        subject.next({
            type: "motion",
            acceleration: parseAcceleration(e.acceleration),
            accelerationIncludingGravity: parseAcceleration(e.accelerationIncludingGravity)
        });
    }
    const updateDeviceOrientation = (e: DeviceOrientationEvent) => {
        subject.next({
            type: 'orientation',
            alpha: e.alpha,
            beta: e.beta,
            gamma: e.gamma
        });
    };

    /// Issues with IOS read more 
    /// https://medium.com/flawless-app-stories/how-to-request-device-motion-and-orientation-permission-in-ios-13-74fc9d6cd140
    const requestPermission = async() => {
        // Request sensor access for iOS 13+
        if (typeof (<any>DeviceMotionEvent).requestPermission === 'function') {
            const permissionState = await (<any>DeviceMotionEvent).requestPermission()
            if (permissionState === 'granted') {
                window.addEventListener('devicemotion', updateDeviceMotion);
            }
        } else {
            // handle regular non iOS 13+ devices
            window.addEventListener('devicemotion', updateDeviceMotion);
        }
        /// Gyroscope
        if (typeof (<any>DeviceOrientationEvent).requestPermission === 'function') {
            const permissionState = await (<any>DeviceOrientationEvent).requestPermission()
            if (permissionState === 'granted') {
                window.addEventListener('devicemotion', updateDeviceOrientation);
            }
        } else {
            window.addEventListener('deviceorientation',updateDeviceOrientation);
        }
        
        console.log('PERMISSIONS');
    }
    // clickable.click(); 
    
    return {
        requestPermission,
        sensorData: subject.asObservable()
    };
}