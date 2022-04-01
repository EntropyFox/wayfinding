import "../styles/wayfinding.css"; 
import { Angle, Quaternion } from "@babylonjs/core";
import { map, mergeMap, tap } from "rxjs/operators";
import { GetConstraint } from "../element-factories/video.factory";
import { isMobile } from "../webcam.manager";
import { Compass } from "./compass";
import { GeoLocation, GeoPoint } from "./geolocation";
import { WayfindingRendere } from "./wayfinding.renderer";

export const WayFinding = async () => {
    console.log('Way finding');

    const skjoldungerne: GeoPoint = {
        lat: 55.59919287227375,
        lng: 11.978895680155723,
    };

    const stationen: GeoPoint = {
        lat: 55.60487774953194,
        lng: 11.971625664068533,
    };

    const canvas = document.getElementById(
        'renderCanvasWayfinding'
    ) as HTMLCanvasElement;
    //const sensors = Sensors();
    const compass = await Compass();
    const geoLocation = GeoLocation(skjoldungerne);
    const renderer = await WayfindingRendere(canvas);
    
    /// Video
    const videoConstraint: MediaTrackConstraints = isMobile() ? {
        width: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight),
        height: (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth),
        facingMode: 'environment',
    } : GetConstraint('vga');
    const video = document.getElementById('webcam') as HTMLVideoElement;
    const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraint,
        audio: false,
    });
    video.srcObject = stream;
    await video.play().then();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    

    const updateModel = (angleToPoint: number) => (heading: number) => {
        const angle = Angle.FromDegrees(heading);
        const modelQuaternion = Quaternion.FromEulerAngles(0, 0, angle.radians() - angleToPoint);
        renderer.content.rotationQuaternion = modelQuaternion;
    };

    geoLocation.geolocation$
        .pipe(
            map((geoloc) => {
                return {
                    distance: geoloc.distance,
                    angle: Angle.FromDegrees(geoloc.angle).radians(),
                };
            }),
            mergeMap((geoloc) => {
                return compass.heading$.pipe(tap(updateModel(geoloc.angle)));
            })
        )
        .subscribe();
};
