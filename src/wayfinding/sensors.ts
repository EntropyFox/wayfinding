import { BehaviorSubject } from "rxjs";
import {filter } from "rxjs/operators"

export const Sensors = () => {
	const sensorReading = new BehaviorSubject<number[]>(null);
	const sensor = new AbsoluteOrientationSensor({
		frequency: 60,
		referenceFrame: "device",
	});

	sensor.addEventListener("reading", (ev) => {
		// console.log("ev: ", ev);
		sensorReading.next(sensor.quaternion);
		// model is a Three.js object instantiated elsewhere.
		// model.quaternion.fromArray(sensor.quaternion).inverse();
	});
	sensor.addEventListener("error", (error) => {
		// if (error.name == "NotReadableError") {
		//   console.log("Sensor is not available.");
		// }
	});
	sensor.start();
	console.log("Sensor started");

	return {
		sensor: sensorReading.asObservable().pipe(filter(q => {
			return q != null;
		}))
	}
};
