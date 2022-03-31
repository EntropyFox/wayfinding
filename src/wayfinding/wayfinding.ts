import { Quaternion } from "@babylonjs/core";
import { Sensors } from "./sensors"
import { WayfindingRendere } from "./wayfinding.rendere";

export const WayFinding = async() => {
    console.log('Way finding');
    const canvas = document.getElementById('renderCanvasWayfinding') as HTMLCanvasElement;
    const rendere = await WayfindingRendere(canvas);
    const sensors = Sensors();

    sensors.sensor.subscribe(quaternion => {
        console.log('quaternion: ', quaternion);
        const modelQuaternion = Quaternion.Inverse(Quaternion.FromArray(quaternion));
        rendere.content.rotationQuaternion = modelQuaternion;
    });
}