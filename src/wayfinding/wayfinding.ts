import '../styles/wayfinding.css';
import { Angle, Quaternion, Vector3 } from '@babylonjs/core';
import { GetConstraint } from '../element-factories/video.factory';
import { isMobile } from '../webcam.manager';
import { Compass } from './compass';
import { GeoLocation, GeoPoint } from './geolocation';
import { first, map, mergeMap, tap } from 'rxjs/operators';
import { WayfindingRenderer as WayfindingRenderer } from './wayfinding.renderer';
import { firstValueFrom } from 'rxjs';

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

    const engKiosken: GeoPoint = {
        lat: 55.66936930537146,
        lng: 12.545206068647586,
    };

    const canvas = document.getElementById(
        'renderCanvasWayfinding'
    ) as HTMLCanvasElement;

    //const sensors = Sensors();
    const compass = await Compass();
    const geoLocation = GeoLocation(skjoldungerne);

    /// Video
    const videoConstraint: MediaTrackConstraints = isMobile()
        ? {
              width:
                  window.innerHeight ||
                  document.documentElement.clientHeight ||
                  document.body.clientHeight,
              height:
                  window.innerWidth ||
                  document.documentElement.clientWidth ||
                  document.body.clientWidth,
              facingMode: 'environment',
          }
        : GetConstraint('full');
    const video = document.getElementById('webcam') as HTMLVideoElement;
    const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraint,
        audio: false,
    });
    video.srcObject = stream;
    await video.play().then();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Hardcoded heading can give troubles on desktop

    const heading = await firstValueFrom(compass.heading$);
    console.log('heading: ', heading);
    const renderer = await WayfindingRenderer(canvas, heading);

    // const updateModel = (angleToPoint: number) => (heading: number) => {
    //     const angle = Angle.FromDegrees(heading);
    //     const modelQuaternion = Quaternion.FromEulerAngles(
    //         0,
    //         angle.radians() - angleToPoint,
    //         0
    //     );
    //     const particleQuaternion = Quaternion.FromEulerAngles(
    //         0,
    //         angle.radians() - angleToPoint,
    //         0
    //     );
    //     // renderer.content.rotationQuaternion = modelQuaternion;
    //     // renderer.particles.rotationQuaternion = particleQuaternion;
    // };

    geoLocation.geolocation$
        .pipe(
            map((geoloc) => {
                return {
                    distance: geoloc.distance,
                    angle: Angle.FromDegrees(geoloc.angle).radians(),
                };
            }),
            mergeMap((geoloc) => {
                //const dir = renderer.camera.getDirection(Vector3.Up());
                document.getElementById(
                    'cameraDir'
                ).innerHTML = `${geoloc.angle}`;
                return compass.heading$.pipe(
                    first()
                    ///tap(updateModel(geoloc.angle))
                );
            })
        )
        .subscribe();
};
