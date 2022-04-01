import { Angle, Quaternion } from '@babylonjs/core';
import { first, map, mergeMap, tap } from 'rxjs/operators';
import { Compass } from './compass';
import { GeoLocation, GeoPoint } from './geolocation';
import { Sensors } from './sensors';
import { WayfindingRendere } from './wayfinding.renderer';

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
    const updateModel = (angleToPoint: number) => (heading: number) => {
        const angle = Angle.FromDegrees(heading);
        const modelQuaternion = Quaternion.FromEulerAngles(
            0,
            angle.radians() - angleToPoint,
            0
        );
        const particleQuaternion = Quaternion.FromEulerAngles(
            0,
            angle.radians() - angleToPoint,
            0
        );
        renderer.content.rotationQuaternion = modelQuaternion;
        renderer.particles.rotationQuaternion = particleQuaternion;
    };

    geoLocation.geolocation$
        .pipe(
            first(),
            map((geoloc) => {
                return {
                    distance: geoloc.distance,
                    angle: Angle.FromDegrees(geoloc.angle).radians(),
                };
            }),
            mergeMap((geoloc) => {
                return compass.heading$.pipe(
                    first(),
                    tap(updateModel(geoloc.angle))
                );
            })
        )
        .subscribe();
};
